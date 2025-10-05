## 🔹 Players (Users)

| Method & Endpoint           | Description               | Notes / Filters                             |
| --------------------------- | ------------------------- | ------------------------------------------- |
| `GET /users?fields=...`     | List all players          | Filter by `ids=1,2,3`, campaignId, playerId |
| `GET /users/:id?fields=...` | Get details of a player   |                                             |
| `POST /users`               | Create a new player       |                                             |
| `PATCH /users/:id`          | Update player information |                                             |
| `DELETE /users/:id`         | Delete a player           |                                             |

---

## 🔹 Campaigns

| Method & Endpoint                         | Description                              | Notes / Filters         |
| ----------------------------------------- | ---------------------------------------- | ----------------------- |
| `GET /campaigns?fields=...`               | List all campaigns (includes GM info)    | Filter: `?playerId=xxx` |
| `GET /campaigns/:id?fields=...`           | Get campaign details (players + GM info) |                         |
| `POST /campaigns`                         | Create a new campaign                    | Accepts `status` field  |
| `PATCH /campaigns/:id`                    | Update a campaign                        | Can update `status`     |
| `DELETE /campaigns/:id`                   | Delete a campaign                        |                         |
| `GET /campaigns/:id/players`              | Get all players in a campaign            |                         |
| `POST /campaigns/:id/players`             | Add a player to a campaign (pivot)       |                         |
| `DELETE /campaigns/:id/players/:playerId` | Remove a player from a campaign          |                         |

---

## 🔹 Characters

| Method & Endpoint                | Description                                              | Notes / Filters                                           |
| -------------------------------- | -------------------------------------------------------- | --------------------------------------------------------- |
| `GET /characters?fields=...`     | List all characters                                      | Filters: `?playerId=xxx`, `?campaignId=xxx`, `?ids=1,2,3` |
| `GET /characters/:id?fields=...` | Get character details                                    |                                                           |
| `POST /characters`               | Create a new character                                   |                                                           |
| `PATCH /characters/:id`          | Update character (attributes, points, afflictions, etc.) |                                                           |
| `DELETE /characters/:id`         | Delete a character                                       |                                                           |

---

## 🔹 Attributes (usually included in Character, but CRUD possible)

| Method & Endpoint                            | Description                 |
| -------------------------------------------- | --------------------------- |
| `PATCH /characters/:id/attributes`           | Bulk update attributes      |
| `PATCH /characters/:id/attributes/:attrType` | Update a specific attribute |

---

## 🔹 Afflictions

| Method & Endpoint                                  | Description                                 | Notes |
| -------------------------------------------------- | ------------------------------------------- | ----- |
| `GET /afflictions?fields=...`                      | List all afflictions (with tags)            |       |
| `GET /afflictions/:id?fields=...`                  | Get affliction details                      |       |
| `POST /afflictions`                                | Create a new affliction                     |       |
| `PATCH /afflictions/:id`                           | Update an affliction                        |       |
| `DELETE /afflictions/:id`                          | Delete an affliction                        |       |
| `POST /characters/:id/afflictions`                 | Apply an affliction to a character          |       |
| `PATCH /characters/:id/afflictions/:afflictionId`  | Update severity of a character's affliction |       |
| `DELETE /characters/:id/afflictions/:afflictionId` | Remove an affliction from a character       |       |

---

## 🔹 Races

| Method & Endpoint           | Description       |
| --------------------------- | ----------------- |
| `GET /races?fields=...`     | List all races    |
| `GET /races/:id?fields=...` | Get race details  |
| `POST /races`               | Create a new race |
| `PATCH /races/:id`          | Update a race     |
| `DELETE /races/:id`         | Delete a race     |

---

## 🔹 Rules

| Method & Endpoint       | Description                       | Notes |
| ----------------------- | --------------------------------- | ----- |
| `GET /rules?fields=...` | List all rules (key, description) |       |
| `GET /rules/:key`       | Get full JSON of a rule           |       |
| `POST /rules`           | Create a new rule                 |       |
| `PATCH /rules/:key`     | Update a rule                     |       |
| `DELETE /rules/:key`    | Delete a rule                     |       |

---

## ✅ Standardized Filters

- `?fields=id,name,email` &nbsp;→&nbsp; Lightweight projection (select only specific fields)
- `?ids=1,2,3` &nbsp;→&nbsp; Bulk retrieval by IDs
- `?playerId=xxx` &nbsp;→&nbsp; Filter by player (for characters/campaigns)
- `?campaignId=xxx` &nbsp;→&nbsp; Filter by campaign (for characters)
