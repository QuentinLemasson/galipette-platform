# Campaign Management Level 1 - Backend Changes

## 📅 Date: October 5, 2025

## 🎯 Purpose

Implement backend features required for Campaign Management Level 1 specification, including campaign status tracking and enhanced player/GM information in API responses.

---

## ✅ Changes Implemented

### 1. **Database Schema Updates**

**File:** `prisma/schema.prisma`

- Added new `CampaignStatus` enum with values: `ACTIVE`, `PAUSED`, `ENDED`
- Added `status` field to `Campaign` model (defaults to `ACTIVE`)

```prisma
enum CampaignStatus {
  ACTIVE   // Campaign is currently active
  PAUSED   // Campaign is temporarily paused
  ENDED    // Campaign has ended
}

model Campaign {
  // ... existing fields
  status      CampaignStatus     @default(ACTIVE)
  // ... rest of fields
}
```

**Migration:** `prisma/migrations/20251005000000_add_campaign_status/migration.sql`

---

### 2. **Campaign Model & DTOs**

**File:** `src/modules/campaigns/campaign.model.ts`

- Imported and re-exported `CampaignStatus` enum
- Updated `CreateCampaignDto` to accept optional `status` field
- Updated `UpdateCampaignDto` to allow updating `status`
- Enhanced `CampaignResponseDto` to include:
  - `status: CampaignStatus` (required)
  - `gameMaster` object with userId, username, and email (optional)
- Modified `mapToCampaignDto()` to extract GM information from players list

---

### 3. **Campaign Controller**

**File:** `src/modules/campaigns/campaign.controller.ts`

**Updated Endpoints:**

- `GET /campaigns` - Now fetches players for each campaign to include GM info
- `GET /campaigns/:id` - Always includes players and GM information

**New Endpoint:**

- `GET /campaigns/:id/players` - Returns list of all players in a campaign with roles

---

### 4. **Campaign Routes**

**File:** `src/modules/campaigns/campaign.routes.ts`

- Added new route: `GET /:id/players` → `getCampaignPlayers`

---

### 5. **API Documentation**

**File:** `specs/endpoints.md`

Updated campaign endpoints documentation to reflect:

- New `GET /campaigns/:id/players` endpoint
- Status field support in POST/PATCH operations
- GM info included in responses

---

## 📊 API Response Changes

### Campaign Response Format (Before)

```json
{
  "id": 1,
  "name": "My Campaign",
  "description": "Campaign description",
  "createdAt": "2025-01-01T00:00:00Z",
  "updatedAt": "2025-01-01T00:00:00Z"
}
```

### Campaign Response Format (After)

```json
{
  "id": 1,
  "name": "My Campaign",
  "description": "Campaign description",
  "status": "ACTIVE",
  "gameMaster": {
    "userId": 42,
    "username": "john_gm",
    "email": "john@example.com"
  },
  "createdAt": "2025-01-01T00:00:00Z",
  "updatedAt": "2025-01-01T00:00:00Z",
  "players": [...]
}
```

---

## 🚀 Deployment Instructions

### Docker Development Mode

Since you're using `docker-compose.dev.yml`:

1. **Restart the backend container** to apply the migration:

   ```bash
   docker-compose -f docker-compose.dev.yml restart backend
   ```

2. **Or rebuild and restart all services:**
   ```bash
   docker-compose -f docker-compose.dev.yml down
   docker-compose -f docker-compose.dev.yml up --build
   ```

The migration will be automatically applied by Prisma when the backend container starts, thanks to the `start-dev.sh` script.

---

## 📝 Frontend Integration Notes

### Campaign Status Values

- `ACTIVE` - Green badge/indicator
- `PAUSED` - Gray badge/indicator
- `ENDED` - Red badge/indicator

### Available Endpoints for Frontend

| Endpoint                          | Purpose               | Response Includes        |
| :-------------------------------- | :-------------------- | :----------------------- |
| `GET /campaigns?playerId=:userId` | List user's campaigns | Status, GM info          |
| `GET /campaigns/:id`              | Campaign details      | Full info + players + GM |
| `GET /campaigns/:id/players`      | Players only          | Player list with roles   |
| `PATCH /campaigns/:id`            | Update campaign       | Can update status        |

### Example Frontend Usage

```typescript
// Fetch campaigns with GM info
const response = await fetch('/api/campaigns?playerId=123');
const { data } = await response.json();
// data[0].status → 'ACTIVE' | 'PAUSED' | 'ENDED'
// data[0].gameMaster → { userId, username, email }

// Update campaign status
await fetch('/api/campaigns/1', {
  method: 'PATCH',
  body: JSON.stringify({ status: 'PAUSED' }),
});
```

---

## ✅ Validation

All changes are backward compatible:

- Existing campaigns will default to `ACTIVE` status
- Optional fields won't break existing API consumers
- GM information is automatically resolved from campaign players

---

## 🔄 Next Steps

1. Restart Docker containers to apply migration
2. Test endpoints in Postman/Thunder Client
3. Implement frontend Campaign List page
4. Implement frontend Campaign Dashboard page
5. Implement frontend Campaign Management page
