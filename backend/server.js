require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const connectDB = require('./config/db');

// Route imports
const authRoutes = require('./routes/authRoutes');
const matchRoutes = require('./routes/matchRoutes');

// (Connection happens below)

const app = express();
const server = http.createServer(app);

// Socket.IO setup with CORS
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  },
});

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json());

// Attach io to request so controllers can emit events
app.use((req, res, next) => {
  req.io = io;
  next();
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/matches', matchRoutes);

// Basic health check
app.get('/', (req, res) => res.json({
  message: `School Sports PURNODAYA \n
Live Scoreboard API is running` }));

// ─────────────────────────────────────────────
// Socket.IO Events
// ─────────────────────────────────────────────
io.on('connection', (socket) => {
    console.log(`⚡ Client connected: ${socket.id}`);

    /**
     * Admin/Viewer joins a match room to receive updates for that specific match.
     * Using match-based rooms prevents broadcasting to all connected users.
     */
    socket.on('join_match', (matchId) => {
      socket.join(matchId);
      console.log(`Socket ${socket.id} joined room: ${matchId}`);
    });

    socket.on('leave_match', (matchId) => {
      socket.leave(matchId);
      console.log(`Socket ${socket.id} left room: ${matchId}`);
    });

    /**
     * Admin emits score update – broadcast to all viewers in the same match room.
     * Payload: { matchId, score, status?, event? }
     */
    socket.on('score_update', (data) => {
      // Broadcast to everyone in the room except the sender
      socket.to(data.matchId).emit('score_updated', data);
      console.log(`Score update broadcast to room: ${data.matchId}`);
    });

    /**
     * Admin emits status change (live/paused/completed) – broadcast to the room
     */
    socket.on('status_update', (data) => {
      socket.to(data.matchId).emit('status_updated', data);
      console.log(`Status update broadcast to room: ${data.matchId}`);
    });

    socket.on('disconnect', () => {
      console.log(`❌ Client disconnected: ${socket.id}`);
    });
  });

  // Auto-seed for memory database support
  const User = require('./models/User');
  const Match = require('./models/Match');
  const { defaultScore } = require('./controllers/matchController');

  const seedData = async () => {
    try {
      const count = await User.countDocuments();
      if (count === 0) {
        console.log('🌱 Database is empty. Seeding initial data...');
        const admin = await User.create({ username: 'admin', password: 'purnodaya25', role: 'admin' });
        await Match.create({
          sport: 'cricket', teamA: 'Red Eagles', teamB: 'Blue Lions', status: 'live',
          score: { teamA: { runs: 145, wickets: 3, overs: '18.2' }, teamB: { runs: 0, wickets: 0, overs: '0.0' }, currentInnings: 1 },
          createdBy: admin._id,
        });
        console.log('✅ Auto-seed completed (admin / purnodaya25)');
      }
    } catch (e) { console.log('SEED ERROR:', e); }
  };

  // Connect to MongoDB and Start Server
  connectDB().then(() => {
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, async () => {
      console.log(`🚀 Server running on port ${PORT}`);
      await seedData();
    });
  });

