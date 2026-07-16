#!/usr/bin/env python3
"""Export single-elimination simulation results to visualizer/data.json."""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path


def round4(distribution: dict[str, float]) -> dict[str, float]:
    return {
        name: round(prob, 4)
        for name, prob in sorted(distribution.items(), key=lambda item: -item[1])
        if prob > 1e-6
    }


def display_name(data: dict) -> str:
    name = data.get("visualizer_name") or data.get("name", "")
    return re.sub(r"\s*\([^)]*\)\s*$", "", name).strip()


def display_subtitle(data: dict) -> str:
    if subtitle := data.get("visualizer_subtitle"):
        return subtitle

    description = data.get("description", "")
    match = re.search(r"through\s+([^.(]+)", description, re.IGNORECASE)
    if match and "opinionated" in description.lower():
        return f"Opinionated ELO — Live Results through {match.group(1).strip()}"
    return description


def export(config_path: Path, output_path: Path) -> None:
    pred_dir = config_path.parent.resolve()
    sys.path.insert(0, str(pred_dir))

    from bracket_core import apply_known_results, run_match
    from data_loader import load_tournament
    from players import build_roster
    from single_elimination_simulation import _ordered_match_ids

    data = load_tournament(config_path)
    bracket_type = data.get("type", "top8_double_elimination")
    if bracket_type != "single_elimination":
        raise SystemExit(
            f"Visualizer export supports single_elimination only, got {bracket_type!r}"
        )

    roster = build_roster(data["players"])
    elo_map = {name: player.elo for name, player in roster.items()}
    bracket = data["bracket"]
    matches = bracket["matches"]
    results = data.get("results", {})

    state: dict[str, dict[str, float]] = {}
    apply_known_results(state, results, matches, elo_map)
    for match_id in _ordered_match_ids(bracket):
        if match_id in results:
            continue
        run_match(match_id, matches[match_id], state, matches, elo_map)

    champion_match = bracket["champion_match"]
    champion = state[f"{champion_match}_winner"]

    match_entries: dict[str, dict] = {}
    for match_id in _ordered_match_ids(bracket):
        winner_key = f"{match_id}_winner"
        if winner_key not in state:
            continue
        sides = matches[match_id]
        match_entries[match_id] = {
            "teams": sides,
            "label": f"{sides[0]} vs {sides[1]}",
            "outcomes": round4(state[winner_key]),
            "decided": match_id in results,
        }

    payload = {
        "name": display_name(data),
        "subtitle": display_subtitle(data),
        "champion_match": champion_match,
        "round_names": bracket.get("round_names", []),
        "rounds": bracket.get("rounds", []),
        "matches": match_entries,
        "champion": round4(champion),
    }

    output_path.write_text(json.dumps(payload, indent=2) + "\n", encoding="utf-8")
    print(f"Wrote {output_path}")


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Export tournament simulation data for the bracket visualizer"
    )
    root = Path(__file__).resolve().parent.parent
    default_config = root / "predictions/world-cup-2026-opiniated-live/config.json"
    default_output = Path(__file__).resolve().parent / "data.json"

    parser.add_argument(
        "config",
        nargs="?",
        default=str(default_config),
        help=f"Tournament JSON config (default: {default_config.relative_to(root)})",
    )
    parser.add_argument(
        "-o",
        "--output",
        default=str(default_output),
        help=f"Output path (default: {default_output.relative_to(root)})",
    )
    args = parser.parse_args()

    export(Path(args.config).resolve(), Path(args.output).resolve())


if __name__ == "__main__":
    main()
