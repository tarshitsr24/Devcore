const path = require('path');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static directory for uploaded resumes & files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const skillRoutes = require('./routes/skills');
const internshipRoutes = require('./routes/internships');
const applicationRoutes = require('./routes/applications');
const journeyRoutes = require('./routes/journey');
const recommendationRoutes = require('./routes/recommendations');
const adminRoutes = require('./routes/admin');

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/internships', internshipRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/journey', journeyRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/admin', adminRoutes);

app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    platform: 'DevCore Backend API',
    database: 'supabase',
    timestamp: new Date().toISOString()
  });
});

// Serve frontend static assets from frontend/dist
app.use(express.static(path.join(__dirname, '../../frontend/dist')));

// Catch-all route to serve index.html for React client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/dist/index.html'));
});

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_URL.includes('your-project')) {
  throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be configured in backend/.env');
}

async function startServer() {
  try {
    const { seedDatabase } = require('./utils/seed');
    await seedDatabase();
  } catch (err) {
    console.error('[Database] Supabase connection or seed failed:', err.message);
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`[DevCore Backend] Server running on http://127.0.0.1:${PORT}`);
  });
}

startServer();