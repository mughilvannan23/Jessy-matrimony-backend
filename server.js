const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = require('./config/db');
const TN_DISTRICTS = require('./utils/tnDistricts');

// Routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const searchRoutes = require('./routes/searchRoutes');
const interestRoutes = require('./routes/interestRoutes');
const membershipRoutes = require('./routes/membershipRoutes');
const adminRoutes = require('./routes/adminRoutes');
const successStoryRoutes = require('./routes/successStoryRoutes');

const app = express();

// Database Connection
connectDB();

// Security Middlewares
app.use(helmet({
  crossOriginResourcePolicy: false, // allow images to be fetched cross-origin
}));

const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:5174',
  'http://localhost:3000',
  'https://gilded-horse-630211.netlify.app',
  process.env.CLIENT_URL
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.netlify.app') || origin.endsWith('.vercel.app')) {
      callback(null, true);
    } else {
      callback(null, true);
    }
  },
  credentials: true
}));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 300, // limit each IP to 300 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api', limiter);

// Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/interests', interestRoutes);
app.use('/api/memberships', membershipRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/success-stories', successStoryRoutes);

// District list route
app.get('/api/districts', (req, res) => {
  res.json({ success: true, count: TN_DISTRICTS.length, districts: TN_DISTRICTS });
});

// Root & Health Check
app.get('/', (req, res) => {
  res.json({
    name: 'Jessy Matrimony API Server',
    status: 'Active',
    version: '1.0.0',
    region: 'Tamil Nadu Only Matrimony Services',
    totalDistricts: 38
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Express Error]', err.stack);
  res.status(500).json({ success: false, message: err.message || 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`=================================================`);
  console.log(`  Jessy Matrimony API Server running on port ${PORT}`);
  console.log(`  Tamil Nadu Matrimony Engine active (38 Districts)`);
  console.log(`=================================================`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`=================================================`);
    console.log(`  [INFO] Port ${PORT} is ALREADY IN USE by a running server.`);
    console.log(`  [INFO] Jessy Matrimony API Server is ALREADY ACTIVE on http://localhost:${PORT}`);
    console.log(`=================================================`);
  } else {
    console.error('[Server Error]', err);
  }
});
