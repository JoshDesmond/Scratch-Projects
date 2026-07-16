"""Player datatype and roster built from tournament config."""

from dataclasses import dataclass
from typing import Any


@dataclass(frozen=True)
class Player:
    """A player with a name and ELO rating."""

    name: str
    elo: float

    def __str__(self) -> str:
        return f"{self.name} ({self.elo})"


def build_roster(players_config: dict[str, Any]) -> dict[str, "Player"]:
    """
    Build a name -> Player roster from config (e.g. from JSON "players": { "Name": elo }).
    """
    roster: dict[str, Player] = {}
    for name, elo in players_config.items():
        roster[name] = Player(name=name, elo=float(elo))
    return roster


def elo_map_from_roster(roster: dict[str, "Player"]) -> dict[str, float]:
    """Name -> ELO for use in util.combine_distributions and grand final logic."""
    return {name: p.elo for name, p in roster.items()}
