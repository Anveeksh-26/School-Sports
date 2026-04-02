/**
 * Seed Script – creates a default admin user and sample matches for testing.
 * Run once with: node seed.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Match = require('./models/Match');
const { defaultScore } = require('./controllers/matchController');
const connectDB = require('./config/db');

const seed = async () => {
  await connectDB();
  try {
    // Clear existing data
    await User.deleteMany();
    await Match.deleteMany();

    // Create admin users
    console.log('Creating admin user...');
    let admin, admin2;
    try {
      admin = await User.create({ username: 'admin', password: 'purnodaya25', role: 'admin' });
      console.log('Creating teacher user...');
      admin2 = await User.create({ username: 'teacher', password: 'teacher123', role: 'admin' });
      console.log('✅ Admin users created');
    } catch (createErr) {
      console.error('❌ User.create FAILED:', createErr.message);
      if (createErr.errors) console.error('Validation Errors:', createErr.errors);
      throw createErr;
    }

    // Create sample matches
    const matches = await Match.insertMany([
      {
        sport: 'cricket',
        teamA: 'Red Eagles',
        teamB: 'Blue Lions',
        status: 'live',
        score: {
          teamA: { runs: 145, wickets: 3, overs: '18.2' },
          teamB: { runs: 0, wickets: 0, overs: '0.0' },
          currentInnings: 1,
        },
        createdBy: admin._id,
      },
      {
        sport: 'badminton',
        teamA: 'Class 10A',
        teamB: 'Class 10B',
        status: 'live',
        score: {
          teamA: { points: 15, sets: 1, setHistory: [21] },
          teamB: { points: 18, sets: 0, setHistory: [15] },
          currentSet: 2,
        },
        createdBy: admin2._id,
      },
      {
        sport: 'kabaddi',
        teamA: 'Warriors',
        teamB: 'Titans',
        status: 'upcoming',
        score: defaultScore('kabaddi'),
        createdBy: admin._id,
      },
      {
        sport: 'kho-kho',
        teamA: 'Green Team',
        teamB: 'Yellow Team',
        status: 'completed',
        score: {
          teamA: { points: 8, chasersTime: 400 },
          teamB: { points: 6, chasersTime: 380 },
        },
        winner: 'Green Team',
        createdBy: admin._id,
      },
    ]);

    console.log(`✅ ${matches.length} sample matches created`);
    console.log('\n🎉 Seed complete! You can now start the server.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

seed();
