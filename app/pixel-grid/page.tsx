"use client";

import React, { useCallback, useMemo, useRef, useState } from "react";

// Simple standalone page that renders the described component.
// Upload an image, input G names, it will search resolutions for >= G horizontal pairs and render the grid with labels.

const DEFAULT_RESOLUTIONS = [
	1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 13, 16, 20, 25, 30, 35, 40, 50, 60, 70, 80, 90, 100,
];

export default function PixelGridPage() {
	const containerRef = useRef<HTMLDivElement | null>(null);
	const [file, setFile] = useState<File | null>(null);
    const [namesText, setNamesText] = useState<string>("Alice,Bob,Carol,David,Eve,Frank");
	const [threshold, setThreshold] = useState<number>(235);
	const [cellSize, setCellSize] = useState<number>(16);
	const [isProcessing, setIsProcessing] = useState<boolean>(false);
	const [resultInfo, setResultInfo] = useState<{ N: number; groupCount: number } | null>(null);

	const names = useMemo(() =>
		namesText
			.split(/[,\n\r;\t]+/)
			.map((s) => s.trim())
			.filter(Boolean),
	[namesText]);

	const onRun = useCallback(async () => {
		if (!file) return;
		if (!containerRef.current) return;
		const container = containerRef.current;

		setIsProcessing(true);
		setResultInfo(null);
		container.innerHTML = "Processing...";

		try {
			const res = await renderGroupedPixelGrid({
				image: file,
				G: names.length,
				names,
				container,
				threshold,
				resolutions: DEFAULT_RESOLUTIONS,
				cellSize,
			});
			setResultInfo(res);
		} catch (e) {
			container.innerHTML = String(e);
		} finally {
			setIsProcessing(false);
		}
	}, [cellSize, file, names, threshold]);

	return (
		<div style={{ padding: 24, display: "grid", gap: 16 }}>
            <h1 style={{ fontSize: 22, margin: 0 }}>Pixel Pairing Grid Demo</h1>
			<div style={{ display: "grid", gap: 12, gridTemplateColumns: "1fr" }}>
                <label style={{ display: "grid", gap: 8 }}>
                    <span>Select image</span>
					<input
						type="file"
						accept="image/*"
						onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
					/>
				</label>
                <label style={{ display: "grid", gap: 8 }}>
                    <span>Names (comma or newline separated)</span>
					<textarea
						value={namesText}
						onChange={(e) => setNamesText(e.target.value)}
						rows={3}
						style={{ width: "100%" }}
					/>
				</label>
				<div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
                    <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span>Threshold: {threshold}</span>
						<input
							type="range"
							min={0}
							max={255}
							value={threshold}
							onChange={(e) => setThreshold(Number(e.target.value))}
						/>
					</label>
                    <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span>Cell size: {cellSize}</span>
						<input
							type="range"
							min={6}
							max={32}
							value={cellSize}
							onChange={(e) => setCellSize(Number(e.target.value))}
						/>
					</label>
                    <button onClick={onRun} disabled={!file || isProcessing}>
                        {isProcessing ? "Processing..." : "Render"}
					</button>
				</div>
                {resultInfo && (
                    <div style={{ color: "#555" }}>
                        Resolution N = {resultInfo.N}, Groups = {resultInfo.groupCount}
                    </div>
                )}
			</div>
			<div ref={containerRef} style={{ minHeight: 120, border: "1px solid #eee" }} />
		</div>
	);
}

// ================= Implementation =================

async function renderGroupedPixelGrid({
	image,
	G,
	names,
	container,
	threshold = 240,
	resolutions = DEFAULT_RESOLUTIONS,
	cellSize = 12,
}: {
	image: string | Blob | HTMLImageElement;
	G: number;
	names: string[];
	container: HTMLDivElement;
	threshold?: number;
	resolutions?: number[];
	cellSize?: number;
}) {
	if (!container) throw new Error("container is required");
	if (!Array.isArray(names) || names.length !== G) {
		throw new Error("names must be an array of length G");
	}

	const imgEl = await ensureImageElement(image);
	const srcData = getSquareImageData(imgEl);

	let chosen: null | {
		N: number;
		resized: { data: Uint8ClampedArray; width: number; height: number };
		isForeground: Uint8Array;
		colors: Uint8ClampedArray;
		groups: { x: number; y: number; left: number[]; right: number[] }[];
		usedRightMap: Uint8Array;
	} = null;

	for (const N of resolutions) {
		const resized = bicubicResize(srcData, N, N);
		const { isForeground, colors } = thresholdMaskAndColors(resized, N, N, threshold);
		const { groups, usedRightMap } = findHorizontalPairsBottomUp(isForeground, colors, N, G);
		if (groups.length >= G) {
			chosen = { N, resized, isForeground, colors, groups, usedRightMap };
			break;
		}
	}
	if (!chosen) throw new Error("No resolution produced enough groups");

	renderGrid({
		container,
		N: chosen.N,
		isForeground: chosen.isForeground,
		colors: chosen.colors,
		groups: chosen.groups,
		usedRightMap: chosen.usedRightMap,
		names,
		G,
		cellSize,
	});

	return { N: chosen.N, groupCount: chosen.groups.length };
}

async function ensureImageElement(input: string | Blob | HTMLImageElement): Promise<HTMLImageElement> {
	if (typeof window === "undefined") throw new Error("Must run in browser");
	if (input instanceof HTMLImageElement) {
		if ((input as HTMLImageElement).complete && (input as HTMLImageElement).naturalWidth > 0) return input as HTMLImageElement;
		await waitForImageLoad(input as HTMLImageElement);
		return input as HTMLImageElement;
	}
	if (typeof input === "string") {
		const img = new Image();
		(img as HTMLImageElement).crossOrigin = "anonymous";
		img.src = input;
		await waitForImageLoad(img);
		return img;
	}
	if (typeof createImageBitmap === "function" && input instanceof Blob) {
		const bmp = await createImageBitmap(input);
		const tmp = document.createElement("canvas");
		tmp.width = bmp.width;
		tmp.height = bmp.height;
		const ctx = tmp.getContext("2d", { willReadFrequently: true });
		if (!ctx) throw new Error("Canvas 2D unavailable");
		ctx.drawImage(bmp, 0, 0);
		const img = new Image();
		img.src = tmp.toDataURL();
		await waitForImageLoad(img);
		return img;
	}
	if (input instanceof Blob) {
		const url = URL.createObjectURL(input);
		const img = new Image();
		img.src = url;
		await waitForImageLoad(img);
		URL.revokeObjectURL(url);
		return img;
	}
	throw new Error("Unsupported image input");
}

function waitForImageLoad(img: HTMLImageElement): Promise<void> {
	return new Promise((resolve, reject) => {
		img.onload = () => resolve();
		img.onerror = (e) => reject(e);
	});
}

function getSquareImageData(imgEl: HTMLImageElement): ImageData {
	const w = imgEl.naturalWidth || (imgEl as HTMLImageElement).width;
	const h = imgEl.naturalHeight || (imgEl as HTMLImageElement).height;
	const side = Math.min(w, h);
	const sx = Math.floor((w - side) / 2);
	const sy = Math.floor((h - side) / 2);

	const cv = document.createElement("canvas");
	cv.width = side;
	cv.height = side;
	const ctx = cv.getContext("2d", { willReadFrequently: true });
	if (!ctx) throw new Error("Canvas 2D unavailable");
	ctx.drawImage(imgEl, sx, sy, side, side, 0, 0, side, side);
	const imageData = ctx.getImageData(0, 0, side, side);
	return imageData;
}

function bicubicResize(srcImageData: ImageData, outW: number, outH: number) {
	const srcW = srcImageData.width;
	const srcH = srcImageData.height;
	const src = srcImageData.data;
	const dst = new Uint8ClampedArray(outW * outH * 4);

	const scaleX = srcW / outW;
	const scaleY = srcH / outH;

	for (let j = 0; j < outH; j++) {
		const fy = (j + 0.5) * scaleY - 0.5;
		const y = Math.floor(fy);
		const ty = fy - y;

		for (let i = 0; i < outW; i++) {
			const fx = (i + 0.5) * scaleX - 0.5;
			const x = Math.floor(fx);
			const tx = fx - x;

			const rgba: number[] = [0, 0, 0, 0];
			for (let c = 0; c < 4; c++) {
				const col = new Float32Array(4);
				for (let m = -1; m <= 2; m++) {
					const yy = clamp(y + m, 0, srcH - 1);
					const p0 = getPx(src, srcW, srcH, clamp(x - 1, 0, srcW - 1), yy, c);
					const p1 = getPx(src, srcW, srcH, clamp(x + 0, 0, srcW - 1), yy, c);
					const p2 = getPx(src, srcW, srcH, clamp(x + 1, 0, srcW - 1), yy, c);
					const p3 = getPx(src, srcW, srcH, clamp(x + 2, 0, srcW - 1), yy, c);
					col[m + 1] = catmullRom(p0, p1, p2, p3, tx);
				}
				rgba[c] = clamp(Math.round(catmullRom(col[0], col[1], col[2], col[3], ty)), 0, 255);
			}

			const di = (j * outW + i) << 2;
			dst[di] = rgba[0];
			dst[di + 1] = rgba[1];
			dst[di + 2] = rgba[2];
			dst[di + 3] = rgba[3];
		}
	}

	return { data: dst, width: outW, height: outH };
}

function catmullRom(p0: number, p1: number, p2: number, p3: number, t: number) {
	const t2 = t * t;
	const t3 = t2 * t;
	return 0.5 * (
		(2 * p1) +
		(-p0 + p2) * t +
		(2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 +
		(-p0 + 3 * p1 - 3 * p2 + p3) * t3
	);
}

function getPx(buf: Uint8ClampedArray, w: number, h: number, x: number, y: number, c: number) {
	const i = ((y * w + x) << 2) + c;
	return buf[i];
}

function clamp(v: number, lo: number, hi: number) {
	return Math.max(lo, Math.min(hi, v));
}

function thresholdMaskAndColors(resized: { data: Uint8ClampedArray }, W: number, H: number, threshold: number) {
	const isForeground = new Uint8Array(W * H);
	const colors = new Uint8ClampedArray(resized.data);
	const d = colors;

	for (let idx = 0; idx < W * H; idx++) {
		const i = idx << 2;
		const r = d[i], g = d[i + 1], b = d[i + 2], a = d[i + 3];
		const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
		const fg = a >= 8 && lum < threshold;
		isForeground[idx] = fg ? 1 : 0;
		if (!fg) {
			d[i] = 255; d[i + 1] = 255; d[i + 2] = 255; d[i + 3] = 255;
		}
	}
	return { isForeground, colors };
}

function findHorizontalPairsBottomUp(
	isForeground: Uint8Array,
	colors: Uint8ClampedArray,
	N: number,
	G: number
) {
	const used = new Uint8Array(N * N);
	const usedRightMap = new Uint8Array(N * N);
	const groups: { x: number; y: number; left: number[]; right: number[] }[] = [];

	for (let y = N - 1; y >= 0; y--) {
		for (let x = 0; x < N - 1; x++) {
			const iL = y * N + x;
			const iR = y * N + (x + 1);
			if (!used[iL] && !used[iR] && isForeground[iL] && isForeground[iR]) {
				const cL = readRGBA(colors, N, x, y);
				const cR = readRGBA(colors, N, x + 1, y);
				groups.push({ x, y, left: cL, right: cR });
				used[iL] = 1; used[iR] = 1;
				usedRightMap[iR] = 1;
			}
		}
	}
	return { groups, usedRightMap };
}

function readRGBA(buf: Uint8ClampedArray, W: number, x: number, y: number): number[] {
	const i = ((y * W + x) << 2);
	return [buf[i], buf[i + 1], buf[i + 2], buf[i + 3]];
}

function renderGrid({
	container,
	N,
	isForeground,
	colors,
	groups,
	usedRightMap,
	names,
	G,
	cellSize,
}: {
	container: HTMLDivElement;
	N: number;
	isForeground: Uint8Array;
	colors: Uint8ClampedArray;
	groups: { x: number; y: number; left: number[]; right: number[] }[];
	usedRightMap: Uint8Array;
	names: string[];
	G: number;
	cellSize: number;
}) {
	container.innerHTML = "";

	const leftCellToGroup = new Map<number, { x: number; y: number; left: number[]; right: number[] }>();
	const rightCellIndexSet = new Set<number>();
	for (const g of groups) {
		const leftIdx = g.y * N + g.x;
		const rightIdx = g.y * N + (g.x + 1);
		leftCellToGroup.set(leftIdx, g);
		rightCellIndexSet.add(rightIdx);
	}

	const sortedForNames = [...groups].sort((a, b) => (a.y - b.y) || (a.x - b.x));
	const labelTargets = sortedForNames.slice(0, Math.min(G, sortedForNames.length));

	const nameByLeftIdx = new Map<number, string>();
	for (let i = 0; i < labelTargets.length; i++) {
		const g = labelTargets[i];
		const leftIdx = g.y * N + g.x;
		nameByLeftIdx.set(leftIdx, names[i]);
	}

	Object.assign(container.style, {
		display: "grid",
		gridTemplateColumns: `repeat(${N}, ${cellSize}px)`,
		gridAutoRows: `${cellSize}px`,
		gap: "0px",
		background: "#ffffff",
		position: "relative",
		userSelect: "none",
	} as CSSStyleDeclaration);

	for (let y = 0; y < N; y++) {
		for (let x = 0; x < N; x++) {
			const idx = y * N + x;
			if (rightCellIndexSet.has(idx)) continue;

			const div = document.createElement("div");
			(div.style as any).gridColumn = `${x + 1} / span ${leftCellToGroup.has(idx) ? 2 : 1}`;
			(div.style as any).gridRow = `${y + 1} / span 1`;

			const [r, g, b, a] = readRGBA(colors, N, x, y);
			const isFg = isForeground[idx] === 1;

			if (!isFg) {
				div.style.background = "#ffffff";
				div.style.border = "none";
			} else {
				if (leftCellToGroup.has(idx)) {
					const group = leftCellToGroup.get(idx)!;
					const [r1, g1, b1, a1] = group.left;
					const [r2, g2, b2, a2] = group.right;
					div.style.background = `linear-gradient(to right, rgba(${r1},${g1},${b1},${a1 / 255}), rgba(${r2},${g2},${b2},${a2 / 255}))`;
				} else {
					div.style.background = `rgba(${r},${g},${b},${a / 255})`;
				}
			}

			if (nameByLeftIdx.has(idx)) {
				const label = document.createElement("div");
				label.textContent = nameByLeftIdx.get(idx)!;
				Object.assign(label.style, {
					position: "relative",
					width: "100%",
					height: "100%",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					fontSize: `${Math.max(10, Math.floor(cellSize * 0.7))}px`,
					fontWeight: "600",
					lineHeight: "1",
					overflow: "hidden",
					whiteSpace: "nowrap",
					textOverflow: "ellipsis",
					padding: "0 2px",
					color: pickTextColorForGroup(leftCellToGroup.get(idx) || null),
					textShadow: "0 0 2px rgba(0,0,0,0.25)",
				} as CSSStyleDeclaration);
				div.appendChild(label);
			}

			container.appendChild(div);
		}
	}
}

function pickTextColorForGroup(group: { left: number[]; right: number[] } | null) {
	if (!group) return "#000";
	const [r1, g1, b1] = group.left;
	const [r2, g2, b2] = group.right;
	const r = (r1 + r2) / 2, g = (g1 + g2) / 2, b = (b1 + b2) / 2;
	const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
	return lum < 140 ? "#fff" : "#000";
}


