"use client";

import { Maximize2 } from "lucide-react";
import type { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type ResearchFigureProps = {
  id: string;
  number: number;
  title: string;
  src: string;
  mobileSrc: string;
  height: number;
  mobileHeight: number;
  alt: string;
  caption: string;
  /** Complete text equivalent for charts, available without duplicating visible UI. */
  children?: ReactNode;
};

export function ResearchFigure({
  id,
  number,
  title,
  src,
  mobileSrc,
  height,
  mobileHeight,
  alt,
  caption,
  children,
}: ResearchFigureProps) {
  return (
    <figure
      id={id}
      className="research-figure not-prose"
      aria-labelledby={`${id}-caption`}
    >
      <Dialog>
        <DialogTrigger asChild>
          <button
            type="button"
            className="research-figure-trigger"
            aria-label={`Expand figure ${number}: ${title}`}
          >
            <picture>
              <source
                media="(max-width: 640px)"
                srcSet={mobileSrc}
                width={440}
                height={mobileHeight}
              />
              {/* SVGs retain crisp labels at every zoom level. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={alt}
                width={1200}
                height={height}
                loading="lazy"
              />
            </picture>
            <span className="research-figure-expand">
              <Maximize2 size={13} aria-hidden="true" />
              Expand figure
            </span>
          </button>
        </DialogTrigger>
        <DialogContent
          className="research-figure-dialog gap-3 p-4 font-sans sm:max-w-6xl sm:p-6"
          aria-describedby={undefined}
        >
          <DialogHeader className="pr-7 text-left">
            <DialogTitle className="leading-snug">
              Figure {number} · {title}
            </DialogTitle>
          </DialogHeader>
          <div
            className="research-figure-viewport"
            tabIndex={0}
            role="region"
            aria-label={`Full-size ${title}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt={alt} width={1200} height={height} />
            {children && <div className="sr-only">{children}</div>}
          </div>
        </DialogContent>
      </Dialog>
      <figcaption id={`${id}-caption`}>
        <p>
          <strong>Figure {number}.</strong> {caption}
        </p>
      </figcaption>
      {children && <div className="sr-only">{children}</div>}
    </figure>
  );
}
