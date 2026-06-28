"""Tests for tournament simulation."""

import pytest
from pathlib import Path

from data_loader import load_tournament
from players import build_roster
from simulation import run_simulation


ROOT = Path(__file__).parent.parent


def test_g3x_champion_probabilities_sum_to_one():
    """Full G3X simulation champion distribution should sum to 1."""
    data = load_tournament(ROOT / "g3x.json")
    roster = build_roster(data["players"])
    champion = run_simulation(roster, data)
    assert sum(champion.values()) == pytest.approx(1.0, rel=1e-5)


def test_g3x_highest_elo_has_highest_win_prob():
    """Cody Schwab (3206) should have the highest tournament win probability."""
    data = load_tournament(ROOT / "g3x.json")
    roster = build_roster(data["players"])
    champion = run_simulation(roster, data)
    sorted_players = sorted(champion.items(), key=lambda x: -x[1])
    assert sorted_players[0][0] == "Cody Schwab"
    assert champion["Cody Schwab"] > champion[sorted_players[1][0]]


def test_world_cup_champion_probabilities_sum_to_one():
    """World Cup simulation champion distribution should sum to 1."""
    data = load_tournament(ROOT / "world_cup_2026.json")
    roster = build_roster(data["players"])
    champion = run_simulation(roster, data)
    assert sum(champion.values()) == pytest.approx(1.0, rel=1e-5)


def test_world_cup_favorites_are_top_teams():
    """Argentina, Spain, and France should lead World Cup win probabilities."""
    data = load_tournament(ROOT / "world_cup_2026.json")
    roster = build_roster(data["players"])
    champion = run_simulation(roster, data)
    top_three = {name for name, _ in sorted(champion.items(), key=lambda x: -x[1])[:3]}
    assert top_three == {"Argentina", "Spain", "France"}


def test_world_cup_only_active_teams_have_nonzero_prob():
    """Teams not in the bracket should have zero win probability."""
    data = load_tournament(ROOT / "world_cup_2026.json")
    roster = build_roster(data["players"])
    champion = run_simulation(roster, data)
    assert len(champion) == 32
    assert all(prob > 0 for prob in champion.values())
