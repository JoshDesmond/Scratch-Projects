# genesis-x3-prediction

ELO-based tournament win probability simulations. Each prediction run lives in its own self-contained folder under `predictions/`.

## Setup

```bash
uv sync
```

## Prediction runs

| Folder | Description |
|--------|-------------|
| [`predictions/genesis-x3/`](predictions/genesis-x3/) | Genesis X3 Top 8 double-elimination bracket |
| [`predictions/world-cup-2026/`](predictions/world-cup-2026/) | 2026 FIFA World Cup knockout stage (ELO from eloratings.net) |
| [`predictions/world-cup-2026-opinionated/`](predictions/world-cup-2026-opinionated/) | Same World Cup bracket with adjusted ELO ratings (`config.json` and `config-v2.json`) |
| [`predictions/world-cup-2026-opiniated-live/`](predictions/world-cup-2026-opiniated-live/) | Opinionated fork updated with live knockout results as matches finish |

Each folder contains its own copy of the simulation code, a `config.json`, and saved `output.txt` from the run.

## Run

From any prediction folder:

```bash
uv run python predictions/genesis-x3/main.py
uv run python predictions/world-cup-2026/main.py
uv run python predictions/world-cup-2026-opinionated/main.py
uv run python predictions/world-cup-2026-opiniated-live/main.py

# Opinionated v2 config:
uv run python predictions/world-cup-2026-opinionated/main.py predictions/world-cup-2026-opinionated/config-v2.json
uv run python predictions/world-cup-2026-opiniated-live/main.py predictions/world-cup-2026-opiniated-live/config-v2.json

# Verbose match-by-match output:
uv run python predictions/world-cup-2026/main.py --verbose
```

## Bracket types

Configs include a `"type"` field that selects the simulator:

| Type | Used by | Description |
|------|---------|-------------|
| `top8_double_elimination` | genesis-x3 | Top 8 double-elimination with bracket reset |
| `single_elimination` | world-cup-* | 32-team single elimination (Round of 32 → Final) |

## Config format

Each JSON config needs `"players"` (name → ELO) and `"bracket"`.

**Single elimination** (world cup configs):

- `"bracket.matches"`: map of match ID → `[team_a, team_b]` (use `winner_X` / `loser_X` for later rounds)
- `"bracket.rounds"`: ordered list of match IDs by round (ensures dependencies resolve correctly)
- `"bracket.champion_match"`: match ID whose winner is the tournament champion
- `"results"`: optional map of finished match IDs → winner name

**Top 8 double elimination** (genesis-x3):

- `"bracket.winners"` and `"bracket.losers"`: match maps as before
- `"results"`: lock in outcomes as games finish

## Updating as the bracket plays out

When a match finishes, add the winner under `"results"` in the config and re-run:

```json
"results": {
  "73": "Canada",
  "74": "Germany"
}
```

For later matches with non-obvious losers, use:

```json
"89": { "winner": "France", "loser": "Germany" }
```

## World Cup data sources

- **ELO ratings**: [eloratings.net](https://www.eloratings.net/2026_World_Cup) (28 Jun 2026)
- **Bracket pairings**: [2026 FIFA World Cup knockout stage](https://en.wikipedia.org/wiki/2026_FIFA_World_Cup_knockout_stage) (combination #67, confirmed 28 Jun 2026)

## Tests

```bash
uv run pytest
```
