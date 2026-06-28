# genesis-x3-prediction

ELO-based tournament win probability simulations. Supports plug-and-play JSON configs for different bracket formats.

## Setup

```bash
uv sync
```

## Run

**Genesis X3 Top 8 (double elimination):**

```bash
uv run python main.py
# or explicitly:
uv run python main.py g3x.json
```

**2026 FIFA World Cup knockout stage (32-team single elimination):**

```bash
uv run python main.py world_cup_2026.json
```

**Verbose match-by-match output:**

```bash
uv run python main.py world_cup_2026.json --verbose
```

## Bracket types

Configs include a `"type"` field that selects the simulator:

| Type | Config file | Description |
|------|-------------|-------------|
| `top8_double_elimination` | `g3x.json` | Genesis X3 Top 8 double-elimination with bracket reset |
| `single_elimination` | `world_cup_2026.json` | 32-team single elimination (Round of 32 → Final) |

## Config format

Each JSON file needs `"players"` (name → ELO) and `"bracket"`.

**Single elimination** (`world_cup_2026.json`):

- `"bracket.matches"`: map of match ID → `[team_a, team_b]` (use `winner_X` / `loser_X` for later rounds)
- `"bracket.rounds"`: ordered list of match IDs by round (ensures dependencies resolve correctly)
- `"bracket.champion_match"`: match ID whose winner is the tournament champion
- `"results"`: optional map of finished match IDs → winner name

**Top 8 double elimination** (`g3x.json`):

- `"bracket.winners"` and `"bracket.losers"`: match maps as before
- `"results"`: lock in outcomes as games finish

## Updating as the bracket plays out

When a match finishes, add the winner under `"results"` and re-run:

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
