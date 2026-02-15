"""Tests for ELO and bracket math."""

import pytest
from util import elo_win_probability, combine_distributions, grand_final_and_reset_probabilities


def test_elo_400_diff_odds_10_to_1():
    """Difference of 400 Elo -> odds 10:1 for the higher-rated player."""
    p_high = elo_win_probability(2400, 2000)
    assert p_high == pytest.approx(10 / 11, rel=1e-9)
    p_low = elo_win_probability(2000, 2400)
    assert p_low == pytest.approx(1 / 11, rel=1e-9)


def test_elo_equal_rating():
    """Equal rating -> 50% each."""
    assert elo_win_probability(2500, 2500) == pytest.approx(0.5, rel=1e-9)


def test_combine_distributions_single_player_each():
    """Two certain players: result is just head-to-head probability."""
    elo_map = {"A": 2400, "B": 2000}
    dist_a = {"A": 1.0}
    dist_b = {"B": 1.0}
    winner = combine_distributions(dist_a, dist_b, elo_map)
    assert winner["A"] == pytest.approx(10 / 11, rel=1e-9)
    assert winner["B"] == pytest.approx(1 / 11, rel=1e-9)


def test_grand_final_reset_sums_to_one():
    """Champion distribution should sum to 1."""
    winner_d = {"A": 0.6, "B": 0.4}
    winner_l = {"A": 0.2, "B": 0.8}
    elo_map = {"A": 2500, "B": 2500}
    champ = grand_final_and_reset_probabilities(winner_d, winner_l, elo_map)
    assert sum(champ.values()) == pytest.approx(1.0, rel=1e-9)
