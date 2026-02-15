"""Load tournament configuration from JSON."""

import json
from pathlib import Path
from typing import Any


def load_tournament(path: str | Path) -> dict[str, Any]:
    """
    Load tournament data from a JSON file.
    Returns a dict with "players" (name -> elo) and "bracket" (bracket structure).
    """
    path = Path(path)
    if not path.exists():
        raise FileNotFoundError(f"Tournament file not found: {path}")
    with open(path, encoding="utf-8") as f:
        data = json.load(f)
    if "players" not in data or "bracket" not in data:
        raise ValueError("JSON must contain 'players' and 'bracket' keys")
    return data
