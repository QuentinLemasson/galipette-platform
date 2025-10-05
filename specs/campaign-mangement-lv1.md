# 🎯 Campaigns — Maturity Level 1 Specification

**STATUS** - TODO

## 1. Objectives

The goal of Maturity Level 1 is to establish the foundational campaign management layer in the application.
At this stage, users must be able to:

- View all campaigns they are part of.
- Access details of a specific campaign.
- Manage basic campaign information (for the GM only).
- Display players and characters linked to the campaign.

This level focuses entirely on integrating existing backend data (campaigns, players, characters) — no sessions or narrative tools yet.

## 2. Scope

| Area                     | Included | Not Included                       |
| :----------------------- | :------- | :--------------------------------- |
| Campaign listing         | ✅       | Filters / search                   |
| Campaign details         | ✅       | Sessions, notes, PNJ, maps         |
| Campaign management      | ✅       | Roles, permissions, advanced tools |
| Player & character lists | ✅       | Character sheets / creation        |
| Data sync with API       | ✅       | Real-time sync or collaboration    |
| UI & routing             | ✅       | Custom dashboards or widgets       |

## 3. Core Features

### 🧾 3.1 Campaign List (`/campaigns`)

Displays all campaigns the user is part of (either as a Game Master or Player).

**Features**

- Fetch campaigns via `GET /campaigns`
- Display cards with:
  - Campaign name
  - Short description
  - Game Master name
  - Status (active, paused, ended)
- “Create Campaign” button → opens a modal or form (uses `POST /campaigns`)
- Clicking a campaign card navigates to `/campaigns/:id/dashboard`

**Future extensions**

- Search & filter (by status, GM)
- Favorites / recently active campaigns

### 🧭 3.2 Campaign Dashboard (`/campaigns/:id/dashboard`)

Main screen for viewing campaign details, shared between players and the GM.

**Features**

- Fetch campaign details via `GET /campaigns/:id`
- Display:
  - Campaign name, description, and status
  - Game Master (owner)
- Fetch and display:
  - Players in this campaign (`GET /players?campaignId=...`)
  - Characters linked to this campaign (`GET /characters?campaignId=...`)
- Show basic layout:
  - Left: campaign info
  - Center: player & character lists
  - Right (optional): campaign metadata summary

**Future extensions**

- Session logs
- Campaign notes
- Activity timeline
- Collaborative updates

### 3.3 Campaign Management (`/campaigns/:id/management`)

Accessible only to the campaign’s Game Master.
Allows updating campaign information and managing members.

**Features**

- Update campaign details (`PATCH /campaigns/:id`)
  - Editable: name, description, status
- Display current members (players)
  - List of players with username and role
- Add a player to the campaign (existing user)
- Remove a player from the campaign
  - Calls a `DELETE` or `PATCH` route depending on backend implementation

**Future extensions**

- Role-based permissions
- Campaign archiving
- Export / import campaigns
- Audit log (activity history)

## 4. Screen Descriptions

### 4.1 Campaign List

| Element        | Description                                        |
| :------------- | :------------------------------------------------- |
| Header         | “My Campaigns” title + “Create” button             |
| Campaign cards | Grid or list of campaigns with key info            |
| Empty state    | “You have no campaigns yet” with CTA to create one |
| Navigation     | Clicking a card → `/campaigns/:id/dashboard`       |

UI Hint: Simple card layout; each card should include status color coding (green = active, grey = paused, red = ended).

### 4.2 Campaign Dashboard

| Section      | Description                                                |
| :----------- | :--------------------------------------------------------- |
| Header       | Campaign title, description, GM info, status badge         |
| Players      | List of players with avatar, name, and role                |
| Characters   | List of characters linked to this campaign                 |
| Actions      | “Go to Management” (if GM)                                 |
| Empty states | Handle gracefully when no players or characters are linked |

UI Hint:
Think of this as the “home” view of a campaign — informational, read-only, and visually inviting.

### 4.3 Campaign Management

| Section       | Description                                    |
| :------------ | :--------------------------------------------- |
| Campaign info | Form for editing name, description, and status |
| Players       | Table with player name + role                  |
| Add player    | Input or select existing user to add           |
| Remove player | Action to detach a user from the campaign      |
| Save changes  | Confirms all updates                           |

UI Hint:
Use a clean 2-column layout: form fields on the left, member management on the right.
Keep destructive actions (remove) clearly separated.

## 5. Data Flow & API Integration

| Entity     | Endpoint                     | Method  | Description                         |
| :--------- | :--------------------------- | :------ | :---------------------------------- |
| Campaigns  | `/campaigns`                 | `GET`   | Fetch all campaigns                 |
| Campaign   | `/campaigns/:id`             | `GET`   | Fetch details for one campaign      |
| Campaign   | `/campaigns`                 | `POST`  | Create new campaign                 |
| Campaign   | `/campaigns/:id`             | `PATCH` | Update campaign info                |
| Players    | `/players?campaignId=...`    | `GET`   | Get players in a campaign           |
| Characters | `/characters?campaignId=...` | `GET`   | Get characters linked to a campaign |

## 6. Success Criteria

✅ Users can:

- See all their campaigns in a clean list view
- Create and edit a campaign
- View campaign details (info, players, characters)
- Add/remove players (as GM)
- Navigate seamlessly between pages

🚫 No dependency on sessions, notes, or advanced role systems.

## 7. Technical Summary

| Layer         | Technology                                  |
| :------------ | :------------------------------------------ |
| Framework     | React + TypeScript (Next.js routing)        |
| Backend       | Existing Express + Prisma API               |
| Data Fetching | `fetch` or custom `useApi()` hook           |
| Auth          | Existing user context (assumed implemented) |
| UI            | `shadcn/ui` + Tailwind                      |
