# Casual Zyzzyva Word Lists

Frequency-filtered subsets of NWL2023 for casual Scrabble practice.

## What was built

| File | Source | Legal ∩ common |
|------|--------|----------------|
| `casual_10k.txt` | Top 10k Norvig words | **8,323** |
| `casual_15k.txt` | Top 15k Norvig words | **12,024** |
| `casual_20k.txt` | Top 20k Norvig words | **15,408** |

Sources:
- [Peter Norvig `count_1w.txt`](https://norvig.com/ngrams/count_1w.txt) (Google Ngrams frequency)
- NWL2023 from `C:\Program Files\NASPA Zyzzyva 3.4.2\data\words\North-American\NWL2023.txt`

Words are uppercase, one per line, in frequency order (most common first).

## Rebuild / tweak

```bash
# Re-download frequency list if needed
curl -fsSL -o count_1w.txt "https://norvig.com/ngrams/count_1w.txt"

python3 filter_wordlist.py --top 15000 -o casual_15k.txt
```

## Import into Zyzzyva (3.4.x)

Copies are already in `C:\Users\Jodes\Zyzzyva\words\` for easy browsing.

1. **Edit → Preferences → Load Lexicons** → choose **Custom** → **Browse**
2. Open e.g. `C:\Users\Jodes\Zyzzyva\words\casual_15k.txt`
3. Apply / OK, then **Tools → Rebuild Database** and rebuild the custom lexicon (needed for definitions/hooks)
4. Create quizzes/cardboxes with **Custom** as the lexicon instead of NWL2023
5. Rebuild length-based cardboxes (3s, 4s, 5s…) against that lexicon

Tip: start with `casual_15k.txt` — solid casual vocab without being tiny.
