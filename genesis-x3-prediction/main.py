"""Orchestrate load -> simulate -> print tournament win probabilities."""

import argparse
from pathlib import Path

from data_loader import load_tournament
from players import build_roster
from top_eight_tournament_simulation import run_simulation


def main() -> None:
    parser = argparse.ArgumentParser(description="Genesis X3 Top 8 win probability simulation")
    parser.add_argument(
        "-v", "--verbose",
        action="store_true",
        help="Print debug match-by-match distributions",
    )
    parser.add_argument(
        "config",
        nargs="?",
        default="g3x.json",
        help="Path to tournament JSON (default: g3x.json)",
    )
    args = parser.parse_args()

    path = Path(args.config)
    data = load_tournament(path)
    roster = build_roster(data["players"])
    champion = run_simulation(roster, data, verbose=args.verbose)

    # Main output: each player sorted by P(win tournament) (skip when verbose—already printed)
    if not args.verbose:
        print("Tournament win probability (by player):\n")
        for name, prob in sorted(champion.items(), key=lambda x: -x[1]):
            pct = prob * 100
            print(f"  {name}: {pct:.2f}%")
        print()


if __name__ == "__main__":
    main()
