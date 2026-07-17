#!/usr/bin/env python3
"""Intersect top-N Norvig frequency words with NWL2023 legal Scrabble words."""

from __future__ import annotations

import argparse
from pathlib import Path


def load_common_words(path: Path, top_n: int) -> list[str]:
    """Load top_n frequency words, uppercased, alphabetic only, frequency order preserved."""
    words: list[str] = []
    seen: set[str] = set()
    with path.open(encoding="utf-8", errors="replace") as f:
        for line in f:
            if len(words) >= top_n:
                break
            part = line.split(None, 1)[0] if line.strip() else ""
            if not part.isalpha():
                continue
            word = part.upper()
            if word in seen:
                continue
            seen.add(word)
            words.append(word)
    return words


def load_legal_words(path: Path) -> set[str]:
    """Load NWL-style lexicon: first token on each line is the word."""
    legal: set[str] = set()
    with path.open(encoding="utf-8", errors="replace") as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            word = line.split(None, 1)[0].upper()
            if word.isalpha():
                legal.add(word)
    return legal


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--freq",
        type=Path,
        default=Path("count_1w.txt"),
        help="Norvig count_1w.txt path",
    )
    parser.add_argument(
        "--lexicon",
        type=Path,
        default=Path(
            "/mnt/c/Program Files/NASPA Zyzzyva 3.4.2/"
            "data/words/North-American/NWL2023.txt"
        ),
        help="NWL2023.txt path",
    )
    parser.add_argument(
        "--top",
        type=int,
        default=15000,
        help="How many frequency-list lines to consider (default: 15000)",
    )
    parser.add_argument(
        "-o",
        "--output",
        type=Path,
        default=None,
        help="Output path (default: casual_<top>.txt)",
    )
    args = parser.parse_args()
    out = args.output or Path(f"casual_{args.top // 1000}k.txt")

    common = load_common_words(args.freq, args.top)
    legal = load_legal_words(args.lexicon)
    # Keep frequency order
    filtered = [w for w in common if w in legal]

    out.write_text("\n".join(filtered) + "\n", encoding="utf-8")
    print(f"Frequency candidates considered: {len(common)}")
    print(f"Legal NWL2023 words loaded:     {len(legal)}")
    print(f"Intersection written:           {len(filtered)} -> {out}")


if __name__ == "__main__":
    main()
