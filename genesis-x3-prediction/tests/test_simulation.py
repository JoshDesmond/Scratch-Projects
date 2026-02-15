"""Tests for tournament simulation."""

import pytest
from pathlib import Path

from data_loader import load_tournament
from players import build_roster
from top_eight_tournament_simulation import run_simulation


def test_champion_probabilities_sum_to_one():
    """Full simulation champion distribution should sum to 1."""
    path = Path(__file__).parent.parent / "g3x.json"
    data = load_tournament(path)
    roster = build_roster(data["players"])
    champion = run_simulation(roster, data)
    assert sum(champion.values()) == pytest.approx(1.0, rel=1e-5)


def test_highest_elo_has_highest_win_prob():
    """Cody Schwab (3206) should have the highest tournament win probability."""
    path = Path(__file__).parent.parent / "g3x.json"
    data = load_tournament(path)
    roster = build_roster(data["players"])
    champion = run_simulation(roster, data)
    sorted_players = sorted(champion.items(), key=lambda x: -x[1])
    assert sorted_players[0][0] == "Cody Schwab"
    assert champion["Cody Schwab"] > 0.5
