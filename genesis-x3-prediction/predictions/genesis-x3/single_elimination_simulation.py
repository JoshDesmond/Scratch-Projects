"""Probability-based simulation of a single-elimination bracket."""

from __future__ import annotations

from typing import Any

from bracket_core import apply_known_results, resolve_slot, run_match
from players import Player


def _ordered_match_ids(bracket: dict[str, Any]) -> list[str]:
    """Return match IDs in dependency order (earlier rounds first)."""
    if "rounds" in bracket:
        ordered: list[str] = []
        for round_matches in bracket["rounds"]:
            ordered.extend(round_matches)
        return ordered
    return list(bracket["matches"].keys())


def run_simulation(
    roster: dict[str, Player],
    bracket_config: dict[str, Any],
    verbose: bool = False,
) -> dict[str, float]:
    """
    Run a single-elimination bracket simulation.
    Returns dict of player name -> P(winning the tournament).
    """
    elo_map = {name: p.elo for name, p in roster.items()}
    bracket = bracket_config.get("bracket", bracket_config)
    matches: dict[str, list[str]] = bracket["matches"]
    champion_match = bracket["champion_match"]

    state: dict[str, dict[str, float]] = {}
    results = bracket_config.get("results", {})
    apply_known_results(state, results, matches, elo_map)

    for match_id in _ordered_match_ids(bracket):
        if match_id in results:
            continue
        run_match(match_id, matches[match_id], state, matches, elo_map)

    champion = state.get(f"{champion_match}_winner")
    if not champion:
        sides = matches[champion_match]
        dist_a = resolve_slot(sides[0], state, matches, elo_map)
        dist_b = resolve_slot(sides[1], state, matches, elo_map)
        from util import combine_distributions

        champion = combine_distributions(dist_a, dist_b, elo_map)

    if verbose:
        _print_debug(state, champion, roster, bracket)

    return champion


def _print_debug(
    state: dict[str, dict[str, float]],
    champion: dict[str, float],
    roster: dict[str, Player],
    bracket: dict[str, Any],
) -> None:
    """Print verbose debug output for each match and final champion distribution."""
    round_names = bracket.get("round_names", [])
    rounds = bracket.get("rounds", [])

    print("=== Match Outcome Distributions ===\n")
    for round_idx, match_ids in enumerate(rounds):
        label = round_names[round_idx] if round_idx < len(round_names) else f"Round {round_idx + 1}"
        print(f"--- {label} ---\n")
        for match_id in match_ids:
            key = f"{match_id}_winner"
            if key not in state:
                continue
            dist = state[key]
            sides = bracket["matches"][match_id]
            print(f"  Match {match_id} ({sides[0]} vs {sides[1]}):")
            for name, p in sorted(dist.items(), key=lambda x: -x[1]):
                if p > 1e-6:
                    print(f"    {name}: {p:.2%}")
            print()

    print("=== Champion (tournament win) ===\n")
    for name, p in sorted(champion.items(), key=lambda x: -x[1]):
        if p > 1e-6:
            print(f"  {name}: {p:.2%}")
    print()
