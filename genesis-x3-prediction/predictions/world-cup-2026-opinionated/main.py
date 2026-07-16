"""Orchestrate load -> simulate -> print tournament win probabilities."""

import argparse
from pathlib import Path

from data_loader import load_tournament
from players import build_roster
from simulation import run_simulation


def main() -> None:
    parser = argparse.ArgumentParser(
        description="ELO-based tournament win probability simulation"
    )
    parser.add_argument(
        "-v", "--verbose",
        action="store_true",
        help="Print debug match-by-match distributions",
    )
    default_config = Path(__file__).parent / "config.json"
    parser.add_argument(
        "config",
        nargs="?",
        default=str(default_config),
        help="Path to tournament JSON (default: config.json; also config-v2.json)",
    )
    args = parser.parse_args()

    path = Path(args.config)
    data = load_tournament(path)
    roster = build_roster(data["players"])
    champion = run_simulation(roster, data, verbose=args.verbose)

    title = data.get("name", path.stem)
    if not args.verbose:
        print(f"{title} — tournament win probability:\n")
        for name, prob in sorted(champion.items(), key=lambda x: -x[1]):
            pct = prob * 100
            print(f"  {name}: {pct:.2f}%")
        print()


if __name__ == "__main__":
    main()
