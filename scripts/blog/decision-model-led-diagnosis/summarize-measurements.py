#!/usr/bin/env python3
"""Recalculate study measurements locally, without model calls or raw exports.

Regenerated trajectories contain cumulative message snapshots. Use only the
last snapshot of each run, so every recorded call is counted exactly once.
Only numerical measurements are written; prompts and tool output stay local.
"""

import argparse
import csv
import hashlib
from importlib.util import module_from_spec, spec_from_file_location
import io
import json
from pathlib import Path, PurePosixPath
import statistics
import tarfile

ROOT = Path(__file__).resolve().parents[3]
OUTPUT = ROOT / "content/blog/_data/decision-model-led-measurements.json"
CONFIGURATIONS = ("luna-review", "luna-none", "jev-review", "jev-none")


def summarize(scores_path, trajectories_path):
    spec = spec_from_file_location("timings", Path(__file__).with_name("summarize-timings.py"))
    timing_module = module_from_spec(spec)
    spec.loader.exec_module(timing_module)
    timings = timing_module.summarize(scores_path)
    fault_ids = timings["faultIds"]
    scores = {}
    with tarfile.open(scores_path, "r|gz") as archive:
        for member in archive:
            path = PurePosixPath(member.name)
            if (not member.isfile() or len(path.parts) != 4
                    or path.parts[:2] != ("scores", "live")
                    or path.name.startswith("._") or not path.name.endswith("_results.csv")):
                continue
            row = next(csv.DictReader(io.StringIO(
                archive.extractfile(member).read().decode("utf-8-sig")
            )))
            scores[(path.parts[2], row["problem_id"])] = float(row["Diagnosis.composite_score"])

    runs = {}
    other_members = []
    with tarfile.open(trajectories_path, "r|gz") as archive:
        for member in archive:
            path = PurePosixPath(member.name)
            if not member.isfile() or path.name.startswith("._"):
                continue
            if len(path.parts) != 3 or not path.name.endswith("_agent_trajectory.jsonl"):
                other_members.append(str(path))
                continue
            configuration, attempt_text = path.parts[1].rsplit("-", 1)
            if configuration not in CONFIGURATIONS or int(attempt_text) not in range(1, 6):
                raise ValueError(f"Unexpected run set: {path.parts[1]}")
            last_event = None
            for line in archive.extractfile(member):
                event = json.loads(line)
                if event.get("type") == "event":
                    last_event = event
            if last_event is None or not last_event["submitted"]:
                raise ValueError(f"Missing final submitted event: {path}")
            fault = last_event["problem_id"]
            if fault not in fault_ids:
                raise ValueError(f"Unknown fault: {fault}")
            key = (path.parts[1], fault)
            if key in runs:
                raise ValueError(f"Duplicate run: {key}")
            decision = {"calls": 0, "latencyMs": 0, "inputTokens": 0, "outputTokens": 0}
            llm = {"calls": 0, "reviewAndReportMs": 0, "usageRecords": 0, "templateFallbacks": 0}
            for message in last_event["messages"]:
                if message.get("type") != "AIMessage":
                    continue
                meta = message.get("response_metadata") or {}
                usage = message.get("usage_metadata")
                names = [call["name"] for call in message.get("tool_calls", [])]
                if any(name.endswith(".system_one") or name.endswith(".decisions") for name in names):
                    if len(names) != 1 or usage is None or "latency_ms" not in meta:
                        raise ValueError(f"Incomplete decision measurement: {key}")
                    decision["calls"] += 1
                    decision["latencyMs"] += meta["latency_ms"]
                    decision["inputTokens"] += usage["input_tokens"]
                    decision["outputTokens"] += usage["output_tokens"]
                elif "llm.review_origin" in names or ("submit" in names and "duration_ms" in meta):
                    duration = meta.get("latency_ms", meta.get("duration_ms"))
                    if duration is None:
                        raise ValueError(f"Missing LLM duration: {key}")
                    llm["calls"] += 1
                    llm["reviewAndReportMs"] += duration
                    llm["usageRecords"] += int(usage is not None)
                    llm["templateFallbacks"] += int(meta.get("source") == "template")
                elif usage is not None:
                    raise ValueError(f"Unrecognized usage-bearing call: {names}")
            expected_llm_calls = 2 if configuration.endswith("review") else 1
            if decision["calls"] == 0 or llm["calls"] != expected_llm_calls:
                raise ValueError(f"Unexpected call counts: {key}: {decision}, {llm}")
            runs[key] = {"score": scores[key], "decision": decision, "llm": llm}

    configurations = []
    for configuration in CONFIGURATIONS:
        values = [
            [runs[(f"{configuration}-{attempt}", fault)] for attempt in range(1, 6)]
            for fault in fault_ids
        ]
        flat = [run for row in values for run in row]
        passes = [sum(run["score"] >= 0.70 for run in row) for row in values]
        decision = {key: sum(run["decision"][key] for run in flat)
                    for key in flat[0]["decision"]}
        llm = {key: sum(run["llm"][key] for run in flat) for key in flat[0]["llm"]}
        configurations.append({
            "id": configuration,
            "attempts": len(flat),
            "passes": sum(passes),
            "passesByFault": passes,
            "scoreSum": sum(run["score"] * 100 for run in flat),
            "meanScore": statistics.fmean(run["score"] * 100 for run in flat),
            "faultsAllPass": passes.count(5),
            "faultsAllFail": passes.count(0),
            "meanDiagnosisSeconds": next(entry["meanDiagnosisSeconds"] for entry in timings["configurations"] if entry["id"] == configuration),
            "decision": {
                **decision,
                "meanSecondsPerAttempt": decision["latencyMs"] / 1000 / len(flat),
                "meanSecondsPerCall": decision["latencyMs"] / 1000 / decision["calls"],
            },
            "llm": {**llm, "meanReviewAndReportSecondsPerAttempt": llm["reviewAndReportMs"] / 1000 / len(flat)},
        })
    return {
        "sources": {path.name: hashlib.sha256(path.read_bytes()).hexdigest()
                    for path in (scores_path, trajectories_path)},
        "method": "All 105 runs per configuration. Call totals use each run's final cumulative message snapshot once. Decision-model time is summed API latency; per-call mean latency is total duration divided by total calls. Review/report time sums the recorded review and report-phase timers, including evidence selection and any template fallback, not isolated LLM API latency. All timing summaries are arithmetic means. Scores and diagnosis times use original benchmark CSVs. LLM token usage is absent from the regenerated trajectories and is not reconstructed.",
        "otherTrajectoryMembers": other_members,
        "faultIds": fault_ids,
        "configurations": configurations,
    }


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("scores", type=Path)
    parser.add_argument("trajectories", type=Path)
    mode = parser.add_mutually_exclusive_group()
    mode.add_argument("--write", action="store_true")
    mode.add_argument("--check", action="store_true")
    args = parser.parse_args()
    result = summarize(args.scores, args.trajectories)
    if args.write:
        OUTPUT.write_text(json.dumps(result, indent=2) + "\n")
    if args.check and json.loads(OUTPUT.read_text()) != result:
        raise ValueError("Saved measurements do not match the source archives")
    for entry in result["configurations"]:
        print(json.dumps({key: value for key, value in entry.items() if key != "passesByFault"}))
    print(f"Other trajectory members: {result['otherTrajectoryMembers']}")


if __name__ == "__main__":
    main()
