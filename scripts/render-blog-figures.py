"""Render the Jev article's SVG/PNG figures. Requires matplotlib==3.9.4.

Run: python scripts/render-blog-figures.py
The results chart reads data/jev-results.json so its data stays reproducible.
SVGs adapt to the embedding page's color scheme; PNG exports stay light.
"""

from pathlib import Path
from io import StringIO
import json
import re

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.patches import Circle, FancyArrowPatch, FancyBboxPatch

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public/blog/jev"
PAPER, INK, MUTED, RULE = "#FFFFFF", "#252B33", "#626B75", "#DDE2E7"
BLUE, ORANGE, GREEN = "#4F749B", "#B77432", "#47765E"
BLUE_BG, ORANGE_BG, GREEN_BG = "#EDF3F9", "#FFF3DA", "#EAF3EC"
# Keep the light artwork unchanged while supplying a deliberate dark palette.
# Embedded SVG media queries follow the host image's CSS color-scheme, including
# the site's explicit theme toggle (not just the operating system preference).
SVG_PALETTE = {
    PAPER: ("paper", "#1C1F24"),
    INK: ("ink", "#D2D0CB"),
    MUTED: ("muted", "#B7BEC8"),
    RULE: ("rule", "#353E4B"),
    BLUE: ("blue", "#8DB5E2"),
    ORANGE: ("orange", "#E7AD70"),
    GREEN: ("green", "#91C7AC"),
    BLUE_BG: ("blue-bg", "#242F3E"),
    ORANGE_BG: ("orange-bg", "#393126"),
    GREEN_BG: ("green-bg", "#24372F"),
    "#ADB6BF": ("panel-border", "#657182"),
    "#EEF0F2": ("row-rule", "#252D38"),
    "#ECEFF2": ("grid", "#303946"),
}
# Dark outlines should define the cards without competing with their text.
SVG_STROKE_PALETTE = {INK: ("outline", "#7F8B99")}
plt.rcParams.update({"font.family": "sans-serif", "font.sans-serif": ["Arial", "DejaVu Sans"], "svg.fonttype": "none", "svg.hashsalt": "sregym-jev"})


def canvas(width, height):
    fig = plt.figure(figsize=(width / 100, height / 100), dpi=160, facecolor=PAPER)
    ax = fig.add_axes((0, 0, 1, 1), xlim=(0, width), ylim=(height, 0))
    ax.axis("off")
    return fig, ax


def text(ax, x, y, label, size=20, color=INK, weight="normal", ha="left", **kwargs):
    return ax.text(x, y, label, fontsize=size * 0.72, color=color, fontweight=weight,
                   ha=ha, va="center", linespacing=1.3, **kwargs)


def box(ax, x, y, width, height, fill="white", stroke=RULE, radius=12, lw=1.2):
    patch = FancyBboxPatch((x, y), width, height,
                          boxstyle=f"round,pad=0,rounding_size={radius}",
                          facecolor=fill, edgecolor=stroke, linewidth=lw)
    ax.add_patch(patch)
    return patch


def line(ax, xs, ys, color=RULE, lw=1, style="-"):
    ax.plot(xs, ys, color=color, linewidth=lw, linestyle=style, solid_capstyle="round")


def arrow(ax, start, end, color=MUTED, style="-", rad=0):
    ax.add_patch(FancyArrowPatch(start, end, arrowstyle="-|>", mutation_scale=13,
                                linewidth=1.5, color=color, linestyle=style,
                                connectionstyle=f"arc3,rad={rad}", zorder=3))


def label_dot(ax, x, y, label, color, size=17):
    ax.add_patch(Circle((x, y), 4, facecolor=color, edgecolor="none"))
    text(ax, x + 12, y, label, size, color)


def actor_icon(ax, x, y, size, actor, color=INK):
    """Small line symbols, kept vector-native like the rest of the figures."""
    if actor == "AGENT":
        box(ax, x - size / 2, y - size * .35, size, size * .7, "none", color, radius=2, lw=1)
        line(ax, [x - size * .32, x - size * .14, x - size * .32],
             [y - size * .14, y, y + size * .14], color, 1.2)
        line(ax, [x, x + size * .3], [y + size * .14] * 2, color, 1.2)
    elif actor == "JEV":
        box(ax, x - size * .34, y - size * .34, size * .68, size * .68, "none", color, radius=2, lw=1)
        for offset in (-.18, .18):
            for side in (-1, 1):
                line(ax, [x + side * size * .34, x + side * size * .5], [y + offset * size] * 2, color, 1)
                line(ax, [x + offset * size] * 2, [y + side * size * .34, y + side * size * .5], color, 1)
        line(ax, [x - size * .17, x - size * .04, x + size * .2],
             [y, y + size * .13, y - size * .15], color, 1.2)
    else:
        box(ax, x - size * .36, y - size * .45, size * .72, size * .9, "none", color, radius=1, lw=1)
        line(ax, [x - size * .2, x + size * .2], [y - size * .22] * 2, color, 1)
        line(ax, [x - size * .2, x - size * .04, x + size * .22],
             [y + size * .04, y + size * .2, y - size * .04], color, 1.2)


def phase_panel(ax, x, y, width, height, heading, mobile=False):
    phase, title = heading.split("  ", 1)
    fill = (ORANGE_BG, BLUE_BG, GREEN_BG)[int(phase) - 1]
    box(ax, x, y, width, height, PAPER, "#ADB6BF", radius=3, lw=.9)
    box(ax, x + 1, y + 1, width - 2, 43 if mobile else 46, fill, fill, radius=2, lw=0)
    cx, cy = x + 25, y + (22 if mobile else 24)
    ax.add_patch(Circle((cx, cy), 13, facecolor=PAPER, edgecolor=INK, linewidth=1))
    text(ax, cx, cy, phase, 18, INK, "bold", ha="center")
    text(ax, x + 49, cy, title, 22 if mobile else 25, INK, "bold")


def themed_svg(svg):
    """Theme paint declarations only; preserve geometry, labels, and light fallbacks."""
    def paint(match):
        prop, color = match.groups()
        palette = SVG_STROKE_PALETTE if prop == "stroke" and color.upper() in SVG_STROKE_PALETTE else SVG_PALETTE
        token, _ = palette[color.upper()]
        return f"{prop}: {color}; {prop}: var(--figure-{token}, {color})"

    svg = re.sub(r"(fill|stroke): (#[0-9a-fA-F]{6})\b", paint, svg)
    variables = "\n".join(
        f"      --figure-{token}: {dark.lower()};"
        for token, dark in [*SVG_PALETTE.values(), *SVG_STROKE_PALETTE.values()]
    )
    stylesheet = (
        '<style type="text/css">\n'
        '  @media (prefers-color-scheme: dark) {\n'
        f'    :root {{\n{variables}\n    }}\n'
        '  }\n'
        '</style>\n'
    )
    return svg.replace("<defs>", f"<defs>\n  {stylesheet}", 1)


def save(fig, name, description, png=True):
    OUT.mkdir(parents=True, exist_ok=True)
    svg = StringIO()
    fig.savefig(svg, format="svg", metadata={"Date": None, "Title": description, "Description": description})
    (OUT / f"{name}.svg").write_text(
        "\n".join(line.rstrip() for line in themed_svg(svg.getvalue()).splitlines()) + "\n"
    )
    if png:
        fig.savefig(OUT / f"{name}.png", dpi=200, metadata={"Description": description})
    plt.close(fig)


# Verified against SREGym/feat/jev-decision-tool at
# 3cecb00db2c099c0dbfad73d74cde33add73b717:
# config.py (enabled tools/instructions), server.py (jev_plan/jev_submit),
# review.py (required Noul checks), submission.py (Conductor acceptance).
FLOW_PHASES = [
    ("1  Plan & investigate", [
        ("AGENT", "Propose hypotheses", "3–5 causes and tests"),
        ("JEV · jev_plan", "Rank tests", "Choose what to test next"),
        ("AGENT", "Run selected tests", "Collect test results"),
    ]),
    ("2  Diagnose", [
        ("AGENT", "Build diagnosis", "Explain what went wrong"),
        ("JEV · jev_submit", "Review diagnosis", "Check the evidence"),
        ("CONDUCTOR", "Receive diagnosis", "Ready for repair"),
    ]),
    ("3  Recover", [
        ("AGENT", "Repair & verify", "Fix and test the system"),
        ("JEV · jev_submit", "Review repair", "Check the fix"),
        ("CONDUCTOR", "Grade result", "Score the final result"),
    ]),
]
ACTORS = {
    "AGENT": (BLUE, BLUE_BG),
    "JEV": (ORANGE, ORANGE_BG),
    "CONDUCTOR": (GREEN, GREEN_BG),
}
WORKFLOW_DESCRIPTION = (
    "Three phases: planning, diagnosis, and recovery. In the planning loop, the "
    "agent proposes three to five hypotheses and read-only tests, jev_plan ranks "
    "them using fresh system context, and the agent runs selected tests. Results "
    "feed back into updated hypotheses and more tests as needed. The agent then "
    "builds a diagnosis. jev_submit reviews its evidence before it "
    "is forwarded to the Conductor. After diagnosis submission is received, the "
    "agent repairs and verifies recovery; Jev reviews the repair before Conductor "
    "grading. An unsupported review in either stage requires replanning with Jev "
    "and running new tests before retrying that same stage."
)


def flow_card(ax, x, y, width, actor, title, detail, mobile=False):
    role = actor.split(" · ")[0]
    color, fill = ACTORS[role]
    height = 100 if mobile else 98
    box(ax, x, y, width, height, fill, INK, radius=3, lw=1)
    actor_icon(ax, x + 25, y + 22, 19, role, color)
    text(ax, x + 44, y + 22, actor, 13 if mobile else 14, color, "bold")
    text(ax, x + 17, y + 53, title, 25 if mobile else 24, INK, "bold")
    text(ax, x + 17, y + 81, detail, 18, MUTED)


def workflow_desktop():
    fig, ax = canvas(1200, 1000)
    text(ax, 24, 32, "The Decision loop", 31, INK, "bold")
    for i, (heading, cards) in enumerate(FLOW_PHASES):
        top = 138 + i * 318
        phase_panel(ax, 24, top - 66, 1152, 260, heading)
        for (actor, title, detail), x in zip(cards, (72, 456, 840)):
            flow_card(ax, x, top, 300, actor, title, detail)
        arrow(ax, (379, top + 50), (449, top + 50))
        if i == 0:
            arrow(ax, (763, top + 50), (833, top + 50))
            line(ax, [990, 990, 222, 222], [top + 100, top + 147, top + 147, top + 125], BLUE, 1.3, "--")
            arrow(ax, (222, top + 125), (222, top + 100), BLUE)
            text(ax, 606, top + 176, "Update hypotheses → test again as needed", 20, BLUE, ha="center")
        else:
            text(ax, 414, top + 29, "Evidence", 16, MUTED, ha="center")
            text(ax, 798, top + 29, "Supported", 16, GREEN, ha="center")
            arrow(ax, (763, top + 50), (833, top + 50), GREEN)
            # The callout explicitly reuses the full planning sequence above,
            # then returns to this stage, including after a refused repair.
            line(ax, [606, 606, 222, 222], [top + 100, top + 147, top + 147, top + 125], ORANGE, 1.3, "--")
            arrow(ax, (222, top + 125), (222, top + 100), ORANGE)
            text(ax, 631, top + 124, "Needs more evidence", 18, ORANGE)
            box(ax, 302, top + 131, 224, 32, BLUE_BG, INK, radius=2, lw=.8).set_zorder(2.5)
            text(ax, 414, top + 147, "Repeat planning (1)", 19, BLUE, "bold", ha="center")
            stage = "diagnosis" if i == 1 else "repair"
            text(ax, 414, top + 180, f"New evidence → retry {stage}", 17, ORANGE, ha="center")
        if i < 2:
            line(ax, [1142, 1187, 1187, 222], [top + 50, top + 50, top + 227, top + 227], INK, 1.1)
            arrow(ax, (222, top + 227), (222, top + 312), INK)
            transition = "Ready to build a diagnosis" if i == 0 else "Diagnosis received → proceed to repair"
            text(ax, 700, top + 211, transition, 19, MUTED, ha="center")
    save(fig, "decision-loop", WORKFLOW_DESCRIPTION)


def workflow_mobile():
    fig, ax = canvas(440, 1750)
    text(ax, 16, 42, "The Decision loop", 29, INK, "bold")
    for i, (heading, cards) in enumerate(FLOW_PHASES):
        top = (170, 670, 1250)[i]
        offsets = (0, 140, 280) if i == 0 else (0, 170, 360)
        phase_panel(ax, 16, top - 67, 408, offsets[2] + 185, heading, mobile=True)
        for (actor, title, detail), offset in zip(cards, offsets):
            y = top + offset
            flow_card(ax, 32, y, 338, actor, title, detail, mobile=True)
        arrow(ax, (178, top + 103), (178, top + offsets[1] - 4))
        arrow(ax, (178, top + offsets[1] + 103), (178, top + offsets[2] - 4), MUTED if i == 0 else GREEN)
        if i == 0:
            line(ax, [372, 410, 410, 391], [top + 330, top + 330, top + 50, top + 50], BLUE, 1.6, "--")
            arrow(ax, (391, top + 50), (372, top + 50), BLUE)
            box(ax, 218, top + 109, 200, 28, PAPER, PAPER, radius=0, lw=0).set_zorder(2.5)
            text(ax, 326, top + 123, "Refine hypotheses", 16, BLUE, ha="center")
        else:
            text(ax, 155, top + 135, "Evidence", 17, MUTED, ha="right")
            text(ax, 202, top + 315, "Supported", 19, GREEN)
            line(ax, [372, 410, 410, 391], [top + 220, top + 220, top + 50, top + 50], ORANGE, 1.6, "--")
            arrow(ax, (391, top + 50), (372, top + 50), ORANGE)
            box(ax, 218, top + 104, 200, 63, PAPER, PAPER, radius=0, lw=0).set_zorder(2.5)
            stage = "diagnosis" if i == 1 else "repair"
            text(ax, 326, top + 135, f"Needs more evidence\nRepeat planning (1)\nRetry {stage}", 16, ORANGE, ha="center")
        if i < 2:
            end = top + offsets[2] + 100
            next_top = (670, 1250)[i]
            arrow(ax, (178, end + 3), (178, next_top - 4))
            transition = "Ready to diagnose" if i == 0 else "Diagnosis received"
            text(ax, 201, end + 35, transition, 17, MUTED)
    save(fig, "decision-loop-mobile", WORKFLOW_DESCRIPTION, png=False)


# Keep exact benchmark IDs in the article while using readable chart labels.
FAULT_LABELS = {
    "edge_request_filter_cpu_saturation": "Request-filter CPU saturation",
    "namespace_memory_limit": "Namespace memory limit",
    "service_wrong_pod_selection_hotel_reservation": "Wrong pod selection",
    "internal_traffic_policy_local_astronomy_shop": "Local traffic policy",
    "network_policy_block": "Network policy block",
    "duplicate_pvc_mounts_social_network": "Duplicate PVC mounts",
    "rolling_update_misconfigured_social_network": "Misconfigured rolling update",
    "secret_rotation_stale_env_credentials_astronomy_shop": "Stale rotated credentials",
    "wrong_dns_policy_astronomy_shop": "Wrong DNS policy",
    "valkey_auth_disruption": "Valkey authentication",
}


def load_results():
    data = json.loads((ROOT / "scripts/data/jev-results.json").read_text())
    assert data["attempts_per_problem"] == 5
    rows = []
    for entry in data["results"]:
        fault = entry["problem"]
        assert fault in FAULT_LABELS, f"Add a chart label for {fault}"
        baseline, assisted = entry["without_jev"], entry["with_jev"]
        assert all(type(value) is int and 0 <= value <= 5 for value in (baseline, assisted))
        rows.append((FAULT_LABELS[fault], baseline, assisted))
    assert len(rows) == 10 and len({entry["problem"] for entry in data["results"]}) == 10
    total = (sum(r[1] for r in rows), sum(r[2] for r in rows))
    gains = sorted([r for r in rows if r[2] > r[1]], key=lambda r: r[1] - r[2])
    losses = sorted([r for r in rows if r[2] < r[1]], key=lambda r: r[2] - r[1])
    same = [r for r in rows if r[2] == r[1]]
    # Narrative callouts describe this particular experiment. Fail rather than
    # silently leave those annotations stale if the experiment's data changes.
    assert total == (20, 24) and (len(gains), len(losses), len(same)) == (4, 2, 4)
    assert gains[0] == ("Local traffic policy", 0, 3)
    return rows, total


def score_bar(ax, x, y, width, value, color, size=20, height=16):
    if value:
        ax.barh(y, width * value / 5, left=x, height=height,
                color=color, edgecolor=INK, linewidth=.45, zorder=3)
    else:
        # Zero-length marks retain the series color without implying a pass.
        ax.plot([x], [y], marker="|", markersize=height * .7,
                markeredgewidth=1.4, color=color, zorder=3)
    text(ax, x + width * value / 5 + 12, y, f"{value}/5", size, INK, zorder=4)


def chart_legend(ax, x, y, label, color, size=20):
    box(ax, x, y - 7, 22, 14, color, INK, radius=0, lw=.5)
    text(ax, x + 32, y, label, size, INK)


def results_desktop(rows, total):
    fig, ax = canvas(1200, 920)
    text(ax, 40, 44, "Results by SRE problem", 34, INK, "bold")
    chart_legend(ax, 40, 102, "Without Jev", BLUE)
    chart_legend(ax, 225, 102, "With Jev", ORANGE)
    text(ax, 780, 102, "Successful attempts (out of 5)", 22, INK, ha="center")
    for tick in range(6):
        x = 440 + tick * 126
        line(ax, [x, x], [170, 809], RULE, .7)
        text(ax, x, 148, str(tick), 20, INK, ha="center")
    line(ax, [440, 1070], [170, 170], INK, .9)
    text(ax, 40, 148, "SRE problem", 20, MUTED)
    for i, (label, before, after) in enumerate(rows):
        y = 220 + i * 62
        text(ax, 40, y, label, 22, INK)
        score_bar(ax, 440, y - 12, 630, before, BLUE)
        score_bar(ax, 440, y + 12, 630, after, ORANGE)
        if i < len(rows) - 1:
            line(ax, [40, 1155], [y + 31, y + 31], "#EEF0F2", .6)
    line(ax, [40, 1160], [839, 839], INK, .9)
    text(ax, 40, 879, "Total passes", 25, INK, "bold")
    text(ax, 440, 879, f"{total[0]}/50", 29, BLUE, "bold")
    arrow(ax, (552, 879), (613, 879), INK)
    text(ax, 640, 879, f"{total[1]}/50", 29, ORANGE, "bold")
    save(fig, "fault-results", "Paired bars on a shared zero-to-five scale compare successful attempts per SRE problem without Jev and with Jev. Totals: 20/50 and 24/50.")


def results_mobile(rows, total):
    fig, ax = canvas(440, 1070)
    text(ax, 24, 37, "Results by SRE problem", 28, INK, "bold")
    chart_legend(ax, 24, 82, "Without Jev", BLUE, 18)
    chart_legend(ax, 236, 82, "With Jev", ORANGE, 18)
    text(ax, 24, 121, "Successful attempts (out of 5)", 18, MUTED)
    for i, (label, before, after) in enumerate(rows):
        y = 181 + i * 82
        text(ax, 24, y, label, 19, INK, "bold")
        for tick in range(6):
            x = 32 + tick * 65.2
            line(ax, [x, x], [y + 12, y + 51], "#ECEFF2", .6)
        score_bar(ax, 32, y + 22, 326, before, BLUE, 17, 13)
        score_bar(ax, 32, y + 44, 326, after, ORANGE, 17, 13)
        if i < len(rows) - 1:
            line(ax, [24, 416], [y + 64, y + 64], RULE, .6)
    line(ax, [24, 416], [1000, 1000], INK, .9)
    text(ax, 24, 1035, f"Total passes: {total[0]}/50 → {total[1]}/50", 23, INK, "bold")
    save(fig, "fault-results-mobile", "Paired bars compare successful attempts per SRE problem without Jev and with Jev, out of five.", png=False)


def cover(total):
    fig, ax = canvas(760, 500)
    text(ax, 40, 49, "Jev for SRE", 42, INK, "bold")
    line(ax, [40, 720], [89, 89], RULE, .9)
    box(ax, 40, 128, 230, 205, BLUE_BG, INK, radius=3, lw=1.2)
    box(ax, 490, 128, 230, 205, ORANGE_BG, INK, radius=3, lw=1.2)
    actor_icon(ax, 87, 174, 45, "AGENT", BLUE)
    actor_icon(ax, 537, 174, 45, "JEV", ORANGE)
    text(ax, 63, 235, "SRE agent", 31, INK, "bold")
    text(ax, 63, 279, "Investigate · repair", 20, MUTED)
    text(ax, 513, 235, "Jev", 31, INK, "bold")
    text(ax, 513, 279, "Rank · review", 20, MUTED)
    text(ax, 380, 157, "Tests + evidence", 18, BLUE, ha="center")
    arrow(ax, (283, 181), (477, 181), INK)
    arrow(ax, (477, 253), (283, 253), INK)
    text(ax, 380, 281, "Rankings + reviews", 18, ORANGE, ha="center")
    line(ax, [40, 720], [370, 370], INK, .9)
    before, after = (value * 2 for value in total)
    text(ax, 40, 434, "Pass rate", 23, INK, "bold")
    text(ax, 273, 407, "Without Jev", 18, BLUE)
    text(ax, 273, 451, f"{before}%", 38, BLUE, "bold")
    arrow(ax, (410, 445), (483, 445), INK)
    text(ax, 529, 407, "With Jev", 18, ORANGE)
    text(ax, 529, 451, f"{after}%", 38, ORANGE, "bold")
    save(fig, "cover", "The agent investigates and repairs; Jev ranks and reviews. Pass rate: 40% without Jev, 48% with Jev.")


if __name__ == "__main__":
    rows, total = load_results()
    workflow_desktop()
    workflow_mobile()
    results_desktop(rows, total)
    results_mobile(rows, total)
    cover(total)
    print(f"Rendered responsive figures and blog cover in {OUT}. Verified totals: {total}.")
