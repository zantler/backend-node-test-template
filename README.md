# Rick & Morty Character API

This project implements a Node.js REST API using TypeScript that allows users to query characters from the Rick & Morty universe, with filters, caching, and local database persistence.

## Features

- Search for characters by `name` (required), and optionally by `species` and/or `gender`.
- Caches the last query in memory for faster repeated requests.
- Persists fetched data to a local SQLite database.
- Logs details of each request using a custom middleware.
- Falls back to the Rick & Morty public API if not found locally.

## Prerequisites

- Node.js >= 18
- npm

## Setup Instructions

1. **Install dependencies**

```bash
npm install
```

2. **Create `.env` file**

```bash
cp .env.example .env
```

3. **Run the application**

- For development (with hot reload):

```bash
npm run dev
```

- For production:

```bash
npm start
```

> The server will start on port `3000` by default (or as specified in `.env`).

---

## API Usage

### GET `/characters`

**Required query parameters:**

- `name` — the name (or part of the name) of the character to search

**Optional query parameters:**

- `species` — filter by species (e.g., "Human")
- `gender` — filter by gender (e.g., "Male")

**Example:**

```http
GET /characters?name=rick&species=Human&gender=Male
```

**Response:**

```json
[
  {
    "id": 1,
    "name": "Rick Sanchez",
    "species": "Human",
    "gender": "Male",
    ...
  }
]
```

---

## Running Tests

To run the unit tests:

```bash
npm test
```

The tests will validate:

- Controller behavior
- Caching mechanism
- Error handling
- Middleware functionality

---

## Notes

- The database is stored as a local SQLite file.
- The project uses Sequelize ORM for DB operations.
- Cache is in-memory and resets when the server restarts.

---
