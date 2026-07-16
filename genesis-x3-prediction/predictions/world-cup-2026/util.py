"""Math and bracket helpers: ELO win rate, grand finals reset, etc."""

import math
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from players import Player


def elo_win_probability(elo_a: float, elo_b: float) -> float:
    """
    Probability that the first player (elo_a) wins against the second (elo_b).
    Difference of 400 Elo -> odds 10:1 -> P = 10/(10+1) for the higher-rated.
    P(A wins) = 1 / (1 + 10^((elo_b - elo_a) / 400))
    """
    diff = elo_b - elo_a
    return 1.0 / (1.0 + math.pow(10, diff / 400.0))


def match_win_probability(player_a: "Player", player_b: "Player") -> float:
    """Probability that player_a wins vs player_b (using their ELOs)."""
    return elo_win_probability(player_a.elo, player_b.elo)


def combine_distributions(
    dist_a: dict[str, float],
    dist_b: dict[str, float],
    elo_map: dict[str, float],
) -> dict[str, float]:
    """
    Given two slot distributions (player name -> P(reaching this slot))
    and elo_map (name -> elo), return the distribution of the match winner.
    """
    result: dict[str, float] = {}
    for name_a, p_a in dist_a.items():
        for name_b, p_b in dist_b.items():
            if p_a <= 0 and p_b <= 0:
                continue
            prob_match = p_a * p_b
            if prob_match <= 0:
                continue
            elo_a = elo_map.get(name_a, 0.0)
            elo_b = elo_map.get(name_b, 0.0)
            p_a_wins = elo_win_probability(elo_a, elo_b)
            result[name_a] = result.get(name_a, 0.0) + prob_match * p_a_wins
            result[name_b] = result.get(name_b, 0.0) + prob_match * (1.0 - p_a_wins)
    return result


def grand_final_and_reset_probabilities(
    winners_bracket_dist: dict[str, float],
    losers_bracket_dist: dict[str, float],
    elo_map: dict[str, float],
) -> dict[str, float]:
    """
    Grand final: Winners bracket champion vs Losers bracket champion.
    Winners side needs 1 win; Losers side needs 2 wins (bracket reset).
    Returns distribution of tournament champion (player name -> P(win tournament)).
    """
    champion: dict[str, float] = {}
    for name in set(winners_bracket_dist) | set(losers_bracket_dist):
        champion[name] = 0.0

    for name_w, p_w in winners_bracket_dist.items():
        for name_k, p_k in losers_bracket_dist.items():
            if p_w <= 0 or p_k <= 0:
                continue
            prob_matchup = p_w * p_k
            elo_w = elo_map.get(name_w, 0.0)
            elo_k = elo_map.get(name_k, 0.0)
            p_wins_set = elo_win_probability(elo_w, elo_k)
            p_k_wins_set = 1.0 - p_wins_set

            # Winners bracket: wins with 1 set, or wins the reset after losing set 1
            champion[name_w] = champion.get(name_w, 0.0) + prob_matchup * (
                p_wins_set + p_k_wins_set * p_wins_set
            )
            # Losers bracket: must win both sets (bracket reset)
            champion[name_k] = champion.get(name_k, 0.0) + prob_matchup * p_k_wins_set * p_k_wins_set

    return champion
