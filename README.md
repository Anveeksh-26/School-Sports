# School Sports PURNODAYA \n
Live Scoreboard

A full-stack MERN application with real-time Socket.IO updates to manage and view live sports scores for schools. Supports dynamic scoring for:
- Cricket 🏏
- Badminton 🏸
- Kabaddi 🤼
- Kho-Kho 🏃

## Features
- **Public Viewer Dashboard:** Real-time PURNODAYA \n
Live Scoreboard.
- **Admin Panel:** Create matches and manage scores in real-time.
- **Role-based Authentication:** JWT based admin login.
- **Real-Time Data:** Socket.IO isolated match rooms for concurrent updates.
- **Responsive & Modern UI:** TailwindCSS dark mode theme with glassmorphism.

---

## 🛠 Prerequisites
- Node.js (v18+ recommended)
- MongoDB Local (or MongoDB Atlas URI)

## 🚀 Step-by-Step Setup

### 1. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set your environment variables via the `.env` file (already created).
   You can customize your port and MongoDB URI here.
4. **Seed the Database with Sample Data:**
   *(Run this once to create test admin users and sample matches)*
   ```bash
   npm run seed
   ```
5. Start the backend server:
   ```bash
   npm start
   ```
   *(Server runs on port 5000 by default)*

### 2. Frontend Setup
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite React development server:
   ```bash
   npm run dev
   ```
   *(Server runs on http://localhost:5173)*

### 3. Usage & Testing
1. Visit **`http://localhost:5173`** to see the public viewer dashboard.
2. Click **Admin Login** on the top right.
3. Log in with the sample credentials:
   - **Username:** `admin`
   - **Password:** `admin123`
4. From the Admin Panel, you can create new matches or manage existing ones.
   - For real-time testing, open the Admin Match Panel in one tab, and the Public Dashboard in another window/device.
   - Update scores as an Admin and watch them update instantly on the Dashboard!

---

## 📂 Project Structure
- **`/backend`**: Node.js + Express setup. Includes Mongoose models (`User`, `Match` with dynamic schema), JWT auth middlewares, Socket.IO instance attached to `server.js`, and seed scripts.
- **`/frontend`**: React + Vite + TailwindCSS. Uses Context API for Auth and real-time Socket connectivity (`SocketContext`). Contains multi-sport ScoreCards and dedicated Sport-specific Score Editors under `src/components/scoreEditors/`.
