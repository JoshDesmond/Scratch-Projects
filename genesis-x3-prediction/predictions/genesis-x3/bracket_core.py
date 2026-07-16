"""Shared bracket slot resolution and match outcome propagation."""

from __future__ import annotations

from typing import Any

from util import combine_distributions, elo_win_probability


def single_player_dist(name: str) -> dict[str, float]:
    """Distribution where one player has probability 1."""
    return {name: 1.0}


def loser_distribution(
    dist_a: dict[str, float],
    dist_b: dict[str, float],
    elo_map: dict[str, float],
) -> dict[str, float]:
    """Distribution of the loser of a match."""
    result: dict[str, float] = {}
    for name_a, p_a in dist_a.items():
        for name_b, p_b in dist_b.items():
            if p_a <= 0 or p_b <= 0:
                continue
            prob_match = p_a * p_b
            if prob_match <= 0:
                continue
            elo_a = elo_map.get(name_a, 0.0)
            elo_b = elo_map.get(name_b, 0.0)
            p_a_wins = elo_win_probability(elo_a, elo_b)
            p_b_wins = 1.0 - p_a_wins
            result[name_a] = result.get(name_a, 0.0) + prob_match * p_b_wins
            result[name_b] = result.get(name_b, 0.0) + prob_match * p_a_wins
    return result


def resolve_slot(
    slot: str,
    state: dict[str, dict[str, float]],
    matches: dict[str, list[str]],
    elo_map: dict[str, float],
) -> dict[str, float]:
    """Resolve a slot reference to a distribution (player name, winner_X, or loser_X)."""
    if slot in state:
        return state[slot]

    if slot in elo_map:
        return single_player_dist(slot)

    if slot.startswith("winner_"):
        match_id = slot.removeprefix("winner_")
        winner_key = f"{match_id}_winner"
        if winner_key in state:
            return state[winner_key]
        if match_id in matches:
            sides = matches[match_id]
            dist_a = resolve_slot(sides[0], state, matches, elo_map)
            dist_b = resolve_slot(sides[1], state, matches, elo_map)
            return combine_distributions(dist_a, dist_b, elo_map)

    if slot.startswith("loser_"):
        match_id = slot.removeprefix("loser_")
        loser_key = f"{match_id}_loser"
        if loser_key in state:
            return state[loser_key]
        if match_id in matches:
            sides = matches[match_id]
            dist_a = resolve_slot(sides[0], state, matches, elo_map)
            dist_b = resolve_slot(sides[1], state, matches, elo_map)
            winner = combine_distributions(dist_a, dist_b, elo_map)
            loser = loser_distribution(dist_a, dist_b, elo_map)
            state[f"{match_id}_winner"] = winner
            state[f"{match_id}_loser"] = loser
            return loser

    return {}


def apply_known_results(
    state: dict[str, dict[str, float]],
    results: dict[str, Any],
    matches: dict[str, list[str]],
    elo_map: dict[str, float],
) -> None:
    """Pre-populate state with known match results."""
    for match_id, result in results.items():
        slots = matches.get(match_id)
        if not slots:
            continue
        if isinstance(result, dict):
            winner_name = result.get("winner")
            loser_name = result.get("loser")
            if winner_name and loser_name:
                state[f"{match_id}_winner"] = single_player_dist(winner_name)
                state[f"{match_id}_loser"] = single_player_dist(loser_name)
        else:
            winner_name = str(result)
            if winner_name not in elo_map:
                continue
            other = [s for s in slots if s in elo_map and s != winner_name]
            if len(other) != 1:
                continue
            loser_name = other[0]
            state[f"{match_id}_winner"] = single_player_dist(winner_name)
            state[f"{match_id}_loser"] = single_player_dist(loser_name)


def run_match(
    match_id: str,
    slots: list[str],
    state: dict[str, dict[str, float]],
    matches: dict[str, list[str]],
    elo_map: dict[str, float],
) -> None:
    """Compute and store winner/loser distributions for one match."""
    dist_a = resolve_slot(slots[0], state, matches, elo_map)
    dist_b = resolve_slot(slots[1], state, matches, elo_map)
    state[f"{match_id}_winner"] = combine_distributions(dist_a, dist_b, elo_map)
    state[f"{match_id}_loser"] = loser_distribution(dist_a, dist_b, elo_map)
