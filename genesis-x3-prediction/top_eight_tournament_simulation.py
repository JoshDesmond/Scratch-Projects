"""Probability-based simulation of the top 8 double-elimination bracket."""

from __future__ import annotations

from typing import Any

from players import Player
from util import (
    combine_distributions,
    grand_final_and_reset_probabilities,
)


def _single_player_dist(name: str) -> dict[str, float]:
    """Distribution where one player has probability 1."""
    return {name: 1.0}


def _loser_distribution(
    dist_a: dict[str, float],
    dist_b: dict[str, float],
    elo_map: dict[str, float],
) -> dict[str, float]:
    """Distribution of the loser of a match (same as winner but with win probs reversed)."""
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
            # P(A wins) = elo_win_prob(elo_a, elo_b), so P(B wins) = 1 - that
            from util import elo_win_probability
            p_a_wins = elo_win_probability(elo_a, elo_b)
            p_b_wins = 1.0 - p_a_wins
            result[name_a] = result.get(name_a, 0.0) + prob_match * p_b_wins  # A loses
            result[name_b] = result.get(name_b, 0.0) + prob_match * p_a_wins  # B loses
    return result


def _resolve_slot(
    slot: str,
    state: dict[str, dict[str, float]],
    bracket: dict[str, Any],
    elo_map: dict[str, float],
) -> dict[str, float]:
    """Resolve a slot reference to a distribution (e.g. winner_A, loser_B, or player name)."""
    if slot in state:
        return state[slot]
    # Fixed player name
    if slot in elo_map:
        return _single_player_dist(slot)
    # winner_X or loser_X
    if slot.startswith("winner_"):
        key = slot.replace("winner_", "", 1)
        if (key + "_winner") in state:
            return state[key + "_winner"]
        # Match key might be uppercase in bracket
        for match_id, sides in list(bracket.get("winners", {}).items()) + list(bracket.get("losers", {}).items()):
            if match_id.upper() == key.upper():
                dist_a = _resolve_slot(sides[0], state, bracket, elo_map)
                dist_b = _resolve_slot(sides[1], state, bracket, elo_map)
                return combine_distributions(dist_a, dist_b, elo_map)
    if slot.startswith("loser_"):
        key = slot.replace("loser_", "", 1)
        if (key + "_loser") in state:
            return state[key + "_loser"]
        for match_id, sides in list(bracket.get("winners", {}).items()) + list(bracket.get("losers", {}).items()):
            if match_id.upper() == key.upper():
                dist_a = _resolve_slot(sides[0], state, bracket, elo_map)
                dist_b = _resolve_slot(sides[1], state, bracket, elo_map)
                winner = combine_distributions(dist_a, dist_b, elo_map)
                loser = _loser_distribution(dist_a, dist_b, elo_map)
                state[key + "_winner"] = winner
                state[key + "_loser"] = loser
                return loser
    return {}


def run_simulation(
    roster: dict[str, Player],
    bracket_config: dict[str, Any],
    verbose: bool = False,
) -> dict[str, float]:
    """
    Run the bracket simulation using probability propagation.
    Returns dict of player name -> P(winning the tournament).
    """
    elo_map = {name: p.elo for name, p in roster.items()}
    bracket = bracket_config.get("bracket", bracket_config)
    winners_b = bracket.get("winners", {})
    losers_b = bracket.get("losers", {})

    state: dict[str, dict[str, float]] = {}

    def resolve(slot: str) -> dict[str, float]:
        return _resolve_slot(slot, state, bracket, elo_map)

    def match_winner(slot1: str, slot2: str) -> dict[str, float]:
        d1 = resolve(slot1)
        d2 = resolve(slot2)
        return combine_distributions(d1, d2, elo_map)

    def match_loser(slot1: str, slot2: str) -> dict[str, float]:
        d1 = resolve(slot1)
        d2 = resolve(slot2)
        return _loser_distribution(d1, d2, elo_map)

    def run_match(match_id: str, slots: list[str]) -> None:
        state[f"{match_id}_winner"] = match_winner(slots[0], slots[1])
        state[f"{match_id}_loser"] = match_loser(slots[0], slots[1])

    # Winners bracket (A, B first; then C depends on A,B; then D depends on C and K)
    for mid, slots in winners_b.items():
        if mid in ("C", "D"):
            continue
        run_match(mid, slots)

    state["C_winner"] = match_winner("winner_A", "winner_B")
    state["C_loser"] = match_loser("winner_A", "winner_B")

    # Losers bracket (F, G; then H, I; then J; then K)
    for mid, slots in losers_b.items():
        if mid == "L":
            continue
        if mid in ("H", "I", "J", "K"):
            state[f"{mid}_winner"] = match_winner(slots[0], slots[1])
        else:
            run_match(mid, slots)

    # Winners Final D: winner_C vs winner_K
    state["D_winner"] = match_winner("winner_C", "winner_K")
    state["D_loser"] = match_loser("winner_C", "winner_K")

    # Losers Final L: winner_K vs loser_D
    state["L_winner"] = match_winner("winner_K", "loser_D")

    # Grand final: winner_C (winners bracket) vs winner_K (losers bracket)
    # Winners side needs 1 win; losers side needs 2 wins (bracket reset)
    champion = grand_final_and_reset_probabilities(
        state["C_winner"],
        state["K_winner"],
        elo_map,
    )

    if verbose:
        _print_debug(state, champion, roster)

    return champion


# Bracket slot -> display label for verbose output (LR1=Losers R1, WSF=Winners SF, etc.)
_DEBUG_LABELS: dict[str, str] = {
    "F_winner": "LR1 winner",
    "G_winner": "LR1 winner",
    "A_winner": "WSF winner",
    "B_winner": "WSF winner",
    "H_winner": "LQF winner",
    "I_winner": "LQF winner",
    "C_winner": "WF winner",
    "J_winner": "LSF winner",
    "K_winner": "LF winner",
    "D_winner": "GF winner",
    "L_winner": "GFR winner",
}


def _print_debug(
    state: dict[str, dict[str, float]],
    champion: dict[str, float],
    roster: dict[str, Player],
) -> None:
    """Print verbose debug output for each match and final champion distribution."""
    print("=== Match Outcome Distributions ===\n")
    for key in ["F_winner", "G_winner", "A_winner", "B_winner", "H_winner", "I_winner",
                "C_winner", "J_winner", "K_winner", "D_winner", "L_winner"]:
        if key not in state:
            continue
        dist = state[key]
        label = _DEBUG_LABELS.get(key, key.replace("_", " "))
        print(f"  {label}:")
        for name, p in sorted(dist.items(), key=lambda x: -x[1]):
            if p > 1e-6:
                print(f"    {name}: {p:.2%}")
        print()
    print("=== Champion (tournament win) ===\n")
    for name, p in sorted(champion.items(), key=lambda x: -x[1]):
        if p > 1e-6:
            print(f"  {name}: {p:.2%}")
    print()
