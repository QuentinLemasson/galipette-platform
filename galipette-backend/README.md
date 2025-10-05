# Galipette Cendrée Backend API

Express server providing the API for the Galipette Cendrée TTRPG Campaign Management Platform.

## Features

- **Users Management**: Create and manage player accounts
- **Campaigns**: Create and manage campaigns, with player roles (GM/Player)
- **Characters**: Create and manage characters with stats, races, and afflictions
- **Races**: Manage character races
- **Afflictions**: Apply and track character afflictions with severity
- **Rules**: Store and retrieve game rules as JSON

## Technologies

- **Language**: TypeScript
- **Runtime**: Node.js
- **Framework**: Express
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Code Quality**: ESLint & Prettier

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm
- PostgreSQL database

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `sample.env`:

   ```bash
   cp sample.env .env
   ```

   Edit the `.env` file with your database configuration.

4. Generate Prisma client:

   ```bash
   npx prisma generate
   ```

5. Create the database and run migrations:

   ```bash
   npx prisma migrate dev --name init
   ```

6. Run the development server:
   ```bash
   npm run dev
   ```

### Scripts

- `npm run dev` - Start development server with hot-reload
- `npm run build` - Build for production
- `npm start` - Run production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## API Endpoints

### Health Check

- `GET /api/health` - Check API status

### Players (Users)

- `GET /api/users` - List all players
- `GET /api/users/:id` - Get details of a player
- `POST /api/users` - Create a new player
- `PATCH /api/users/:id` - Update player information
- `DELETE /api/users/:id` - Delete a player

### Campaigns

- `GET /api/campaigns` - List all campaigns
- `GET /api/campaigns/:id` - Get campaign details
- `POST /api/campaigns` - Create a new campaign
- `PATCH /api/campaigns/:id` - Update a campaign
- `DELETE /api/campaigns/:id` - Delete a campaign
- `POST /api/campaigns/:id/players` - Add a player to a campaign
- `DELETE /api/campaigns/:id/players/:playerId` - Remove a player from a campaign

### Characters

- `GET /api/characters` - List all characters
- `GET /api/characters/:id` - Get character details
- `POST /api/characters` - Create a new character
- `PATCH /api/characters/:id` - Update character
- `DELETE /api/characters/:id` - Delete a character
- `PATCH /api/characters/:id/attributes` - Bulk update attributes
- `PATCH /api/characters/:id/attributes/:attrType` - Update a specific attribute

### Races

- `GET /api/races` - List all races
- `GET /api/races/:id` - Get race details
- `POST /api/races` - Create a new race
- `PATCH /api/races/:id` - Update a race
- `DELETE /api/races/:id` - Delete a race

### Afflictions

- `GET /api/afflictions` - List all afflictions
- `GET /api/afflictions/:id` - Get affliction details
- `POST /api/afflictions` - Create a new affliction
- `PATCH /api/afflictions/:id` - Update an affliction
- `DELETE /api/afflictions/:id` - Delete an affliction
- `GET /api/tags` - List all tags
- `POST /api/tags` - Create a new tag
- `GET /api/tags/:id` - Get tag details
- `DELETE /api/tags/:id` - Delete a tag
- `GET /api/characters/:id/afflictions` - Get character's afflictions
- `POST /api/characters/:id/afflictions` - Apply an affliction to a character
- `PATCH /api/characters/:id/afflictions/:afflictionId` - Update severity of a character's affliction
- `DELETE /api/characters/:id/afflictions/:afflictionId` - Remove an affliction from a character

### Rules

- `GET /api/rules` - List all rules
- `GET /api/rules/:key` - Get rule details
- `POST /api/rules` - Create a new rule
- `PATCH /api/rules/:key` - Update a rule
- `DELETE /api/rules/:key` - Delete a rule

### Query Parameters

- `?fields=id,name,email` - Select only specific fields
- `?ids=1,2,3` - Bulk retrieval by IDs
- `?playerId=xxx` - Filter by player (for characters/campaigns)
- `?campaignId=xxx` - Filter by campaign (for characters)
- `?page=1&limit=10` - Pagination
