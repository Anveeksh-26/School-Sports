# API Documentation

The backend exposes RESTful endpoints and real-time WebSockets events.
Base URL: `http://localhost:5000/api`

## REST API Endpoints

### 🟢 Auth
- **POST `/auth/login`**
  - **Body:** `{ "username": "admin", "password": "password" }`
  - **Returns:** JWT Token and user profile details.
- **GET `/auth/me`** *(Private)*
  - **Headers:** `Authorization: Bearer <token>`
  - **Returns:** Current logged-in user profile.

### 🟡 Matches
- **GET `/matches`**
  - **Query Params:** `?status=live&sport=cricket` (Optional)
  - **Returns:** List of matches sorted by latest.
- **GET `/matches/:id`**
  - **Returns:** Details of a specific match.
- **POST `/matches`** *(Private)*
  - **Body:** `{ "sport": "cricket", "teamA": "Team 1", "teamB": "Team 2" }`
  - **Returns:** Newly created match with default zeroed sport-specific score.
- **PATCH `/matches/:id/status`** *(Private)*
  - **Body:** `{ "status": "live|paused|completed", "winner": "Team A" }`
  - **Returns:** Updated match object.
- **PATCH `/matches/:id/score`** *(Private)*
  - **Body:** `{ "score": { ... }, "event": "Wicket!" }`
  - **Returns:** Updated match object containing the new full score object.
- **DELETE `/matches/:id`** *(Private)*
  - **Returns:** Success message upon deletion.

---

## 🔌 Socket.IO Events
The server uses **Match-based Rooms** to isolate real-time updates and handle concurrent admins.
Socket Server URL: `http://localhost:5000`

### Client -> Server (Emits)
- **`join_match` (matchId):** Subscribes client (admin or viewer) to a specific match's room.
- **`leave_match` (matchId):** Unsubscribes from the match.
- **`score_update` ({ matchId, score, event }):** Emitted by Admin to update scores. Server broadcasts to all viewers in the room.
- **`status_update` ({ matchId, status, winner }):** Emitted by Admin to change match lifecycle status.

### Server -> Client (Listeners)
- **`score_updated` ({ matchId, score, event }):** Viewers listen to this to re-render score cards instantly.
- **`status_updated` ({ matchId, status, winner }):** Viewers listen to this to reflect live/paused/completed pill badges.

> *Note: For the best viewer experience, the frontend context maps these incoming web socket events to the current React component state.*
