# FIFA-style Cards API

This document describes the API implemented in this workspace. It covers models, validation rules, endpoints, and example requests.

Base URL: `http://localhost:3000`

Run the server:
```bash
node src/index.js
```

Quick test:
```bash
curl http://localhost:3000/test
```

---

## Models

- `Player` (`src/model/PlayerModel.js`)
  - `playerId` (string, unique)
  - `name` (string, required)
  - `photo` (string, required) — accepts a data URI or base64. Middleware normalizes to data URI.

- `Sport` (`src/model/SportModel.js`)
  - `sportId` (string, unique)
  - `name` (string, required)
  - `icon` (string, optional)
  - `attributeDefs` (array) — metadata for front-end (keys, labels, min/max/default suggested values)

- `PlayerSport` (`src/model/PlayerSportModel.js`)
  - `playerSportId` (string, unique)
  - `player` (ObjectId ref `Player`, required)
  - `sport` (ObjectId ref `Sport`, required)
  - `position` (string, optional)
  - `overall` (number 0–100) — stored value; may be provided by client or computed by server
  - `attributes` (object) — keys/values provided by the API/client

---

## Validation (middleware)

- `PlayerValidation` (`src/middlewares/PlayerValidation.js`)
  - `name`: required, string, min length 2
  - `photo`: required, must be base64 or data URI; allowed MIME types: `image/png`, `image/jpeg`, `image/jpg`, `image/webp`, `image/gif`
  - Enforces a max decoded image size of 2.5 MB and normalizes `req.body.photo` to a `data:<mime>;base64,<data>` form.

- `SportValidation` (`src/middlewares/SportValidation.js`)
  - `name`: required, string, min length 2
  - `icon`: optional string
  - On `PUT /sport/:id`: checks `:id` ObjectId format and that sport exists.

- `PlayerSportValidation` (`src/middlewares/PlayerSportValidation.js`)
  - `player` and `sport`: required, valid ObjectId, must exist
  - `attributes`: required object (not array), keys count must be between 3 and 6
  - each attribute value: numeric 0..100 (backend validates, does not alter values)
  - optional `overall`: if supplied, numeric 0..100 (validated)
  - If `overall` is not provided, controller computes a simple average and stores it.

---

## Endpoints

All requests/response bodies are JSON unless otherwise noted.

### Players

- `POST /player` — create a player
  - Middleware: `PlayerValidation`
  - Body:
    ```json
    {
      "name": "Player Name",
      "photo": "data:image/png;base64,AAAA..." // or raw base64
    }
    ```
  - Response: `201` created with Player object.

- `GET /player` — list players

- `GET /player/:id` — get player by id

- `PUT /player/:id` — update player
  - Middleware: `PlayerValidation`

- `DELETE /player/:id` — delete player

### Sports

- `POST /sport` — create sport
  - Middleware: `SportValidation`
  - Body example:
    ```json
    {
      "name": "Soccer",
      "icon": "/icons/soccer.png",
      "attributeDefs": [
        { "key": "pace", "label": "Pace", "min": 0, "max": 100, "default": 70 },
        { "key": "shooting", "label": "Shooting", "min": 0, "max": 100, "default": 65 }
      ]
    }
    ```

- `GET /sport` — list sports
- `GET /sport/:id` — get sport (includes `attributeDefs`)
- `PUT /sport/:id` — update sport (uses `SportValidation`)
- `DELETE /sport/:id` — delete sport

### PlayerSport (cards)

- `POST /playersport` — create a player-sport card
  - Middleware: `PlayerSportValidation`
  - Body examples:
    - Let server compute overall:
      ```json
      {
        "player":"<playerObjectId>",
        "sport":"<sportObjectId>",
        "attributes":{"pace":80,"shooting":77,"passing":75},
        "position":"CAM"
      }
      ```
    - Provide overall from client:
      ```json
      {
        "player":"<playerObjectId>",
        "sport":"<sportObjectId>",
        "attributes":{"pace":80,"shooting":77,"passing":75},
        "overall":77
      }
      ```
  - Rules:
    - `attributes` must be an object with 3..6 keys
    - values numeric 0..100 (validated)
    - If `overall` provided it must be 0..100; otherwise server computes and stores rounded average

- `GET /playersport` — list all player-sport entries (populates `player` and `sport`)

---

## Example curl requests

- Create player:
```bash
curl -X POST http://localhost:3000/player \
 -H "Content-Type: application/json" \
 -d '{"name":"John Doe","photo":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUg..."}'
```

- Create sport:
```bash
curl -X POST http://localhost:3000/sport \
 -H "Content-Type: application/json" \
 -d '{"name":"Soccer","icon":"/icons/soccer.png","attributeDefs":[{"key":"pace","label":"Pace","min":0,"max":100,"default":70}]}'
```

- Create player-sport (server computes overall):
```bash
curl -X POST http://localhost:3000/playersport \
 -H "Content-Type: application/json" \
 -d '{"player":"<playerId>","sport":"<sportId>","attributes":{"pace":80,"shooting":77,"passing":75},"position":"CAM"}'
```

---

## Notes & Recommendations

- Photo storage: currently photos are stored as data URIs in the DB. For production consider storing images on disk or cloud (S3) and saving only URLs in the DB.
- Attribute handling: the backend validates attribute values and expects the frontend to provide the attributes object (3–6 keys). `attributeDefs` in `Sport` provide UI metadata.
- Route naming: current routes are singular (`/player`, `/sport`, `/playersport`). Consider switching to plural (e.g., `/players`) for REST conventions.
- Tests & seed data: consider adding a seed script for demo sports and unit tests for middleware.

---

If you want, I can add a `seed.js` that inserts example sports (`Soccer`, `Basketball`, `Tennis`) with `attributeDefs`, or I can rename routes to plurals. Tell me which you'd like next.
