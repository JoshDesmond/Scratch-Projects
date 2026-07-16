"""Load and validate tournament configuration from JSON."""

import json
from pathlib import Path
from typing import Any

from simulation import BRACKET_TYPES


def load_tournament(path: str | Path) -> dict[str, Any]:
    """
    Load tournament data from a JSON file.
    Returns a dict with "players", "bracket", and optional "type".
    """
    path = Path(path)
    if not path.exists():
        raise FileNotFoundError(f"Tournament file not found: {path}")
    with open(path, encoding="utf-8") as f:
        data = json.load(f)
    _validate(data)
    return data


def _validate(data: dict[str, Any]) -> None:
    if "players" not in data or "bracket" not in data:
        raise ValueError("JSON must contain 'players' and 'bracket' keys")

    bracket_type = data.get("type", "top8_double_elimination")
    if bracket_type not in BRACKET_TYPES:
        raise ValueError(
            f"Unknown bracket type {bracket_type!r}. "
            f"Expected one of: {', '.join(sorted(BRACKET_TYPES))}"
        )

    bracket = data["bracket"]
    if bracket_type == "single_elimination":
        if "matches" not in bracket or "champion_match" not in bracket:
            raise ValueError(
                "Single-elimination bracket must contain 'matches' and 'champion_match'"
            )
        champion_match = bracket["champion_match"]
        if champion_match not in bracket["matches"]:
            raise ValueError(f"champion_match {champion_match!r} not found in matches")
    elif bracket_type == "top8_double_elimination":
        if "winners" not in bracket or "losers" not in bracket:
            raise ValueError("Top 8 bracket must contain 'winners' and 'losers'")
