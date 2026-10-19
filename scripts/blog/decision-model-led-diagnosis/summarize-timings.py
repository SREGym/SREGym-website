#!/usr/bin/env python3
"""Audit the 420 diagnosis timings without extracting or copying raw reports.

The benchmark's diagnosis-stage clock stops at submission, before judging.
Remove only the fixed 120-second observation delay, retaining agent startup,
collection, tool execution, review, report writing, and submission overhead.
"""

import argparse
import csv
import hashlib
import io
import json
import math
from pathlib import Path, PurePosixPath
import statistics
import tarfile


ROOT = Path(__file__).resolve().parents[3]
OUTPUT = ROOT / "content/blog/_data/decision-model-led-timings.json"
CONFIGURATIONS = ("luna-review", "luna-none", "jev-review", "jev-none")
DELAY_SECONDS = 120
DURATION_FIELD = "phase.stage:diagnosis.duration_s"


def summarize(archive_path):
    expected_faults = sorted(
        (ROOT / "public/data/sregym-lite-0904-problems.csv")
        .read_text()
        .strip()
        .splitlines()[1:]
    )
    runs = {name: {} for name in CONFIGURATIONS}
    with tarfile.open(archive_path, "r|gz") as archive:
        for member in archive:
            path = PurePosixPath(member.name)
            if (
                not member.isfile()
                or len(path.parts) != 4
                or path.parts[:2] != ("scores", "live")
                or path.name.startswith("._")
                or not path.name.endswith("_results.csv")
            ):
                continue
            configuration, attempt_text = path.parts[2].rsplit("-", 1)
            if configuration not in runs:
                raise ValueError(f"Unexpected configuration: {path.parts[2]}")
            attempt = int(attempt_text)
            if attempt not in range(1, 6):
                raise ValueError(f"Unexpected attempt: {path.parts[2]}")
            rows = list(csv.DictReader(io.StringIO(
                archive.extractfile(member).read().decode("utf-8-sig")
            )))
            if len(rows) != 1:
                raise ValueError(f"Expected one run in {path}")
            row = rows[0]
            problem = row["problem_id"]
            if problem not in expected_faults or path.name != f"{problem}_results.csv":
                raise ValueError(f"Unexpected fault in {path}")
            if row["phase.stage:diagnosis.outcome"] != "submitted":
                raise ValueError(f"Diagnosis was not submitted in {path}")
            seconds = float(row[DURATION_FIELD])
            if not math.isfinite(seconds) or seconds <= DELAY_SECONDS:
                raise ValueError(f"Invalid diagnosis timing in {path}")
            key = (problem, attempt)
            if key in runs[configuration]:
                raise ValueError(f"Duplicate run: {configuration} {key}")
            runs[configuration][key] = seconds

    configurations = []
    for name in CONFIGURATIONS:
        if len(runs[name]) != 105:
            raise ValueError(f"Expected 105 runs for {name}, got {len(runs[name])}")
        values = [
            [runs[name][(fault, attempt)] for attempt in range(1, 6)]
            for fault in expected_faults
        ]
        durations = [value - DELAY_SECONDS for row in values for value in row]
        configurations.append({
            "id": name,
            "attempts": len(durations),
            "meanDiagnosisSeconds": statistics.fmean(durations),
            "stageSecondsByFault": values,
        })
    return {
        "source": archive_path.name,
        "sourceSha256": hashlib.sha256(archive_path.read_bytes()).hexdigest(),
        "cohort": "SREGym-Lite-0904",
        "durationField": DURATION_FIELD,
        "excludedObservationSeconds": DELAY_SECONDS,
        "judgeTimeIncluded": False,
        "method": "Arithmetic mean over all 105 attempts per configuration. "
            "Diagnosis-stage duration minus the fixed observation delay. "
            "Includes startup, collection, tools, review, report writing, and "
            "submission overhead; excludes judging. Each row of stageSecondsByFault "
            "matches faultIds, with columns for attempts 1 through 5.",
        "faultIds": expected_faults,
        "configurations": configurations,
    }


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("archive", type=Path)
    mode = parser.add_mutually_exclusive_group()
    mode.add_argument("--write", action="store_true")
    mode.add_argument("--check", action="store_true")
    args = parser.parse_args()
    result = summarize(args.archive)
    if args.write:
        OUTPUT.write_text(json.dumps(result, indent=2) + "\n")
    if args.check and json.loads(OUTPUT.read_text()) != result:
        raise ValueError("Saved timing data does not match the source archive")
    for entry in result["configurations"]:
        print(f"{entry['id']}: {entry['attempts']} runs, "
              f"mean diagnosis {entry['meanDiagnosisSeconds']:.6f} s")


if __name__ == "__main__":
    main()
