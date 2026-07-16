"""Dispatch tournament simulation by bracket type."""

from __future__ import annotations

from typing import Any

from players import Player
from single_elimination_simulation import run_simulation as run_single_elimination
from top_eight_tournament_simulation import run_simulation as run_top_eight

BRACKET_TYPES = {
    "top8_double_elimination",
    "single_elimination",
}


def run_simulation(
    roster: dict[str, Player],
    config: dict[str, Any],
    verbose: bool = False,
) -> dict[str, float]:
    """Run the appropriate simulation for the tournament config."""
    bracket_type = config.get("type", "top8_double_elimination")
    if bracket_type not in BRACKET_TYPES:
        raise ValueError(
            f"Unknown bracket type {bracket_type!r}. "
            f"Expected one of: {', '.join(sorted(BRACKET_TYPES))}"
        )
    if bracket_type == "single_elimination":
        return run_single_elimination(roster, config, verbose=verbose)
    return run_top_eight(roster, config, verbose=verbose)
