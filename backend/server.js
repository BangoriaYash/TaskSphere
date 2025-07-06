const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const authRoutes = require('./routes/auth.routes');
const projectRoutes = require('./routes/project.routes');
const taskRoutes = require('./routes/task.routes');
const { updateProjectStatuses } = require('./services/projectStatusUpdater');

updateProjectStatuses();
setInterval(updateProjectStatuses, 60 * 1000); // 1 hour = 60min * 60sec * 1000ms

dotenv.config();

const app = express();

app.use(cors({
  origin: ['http://127.0.0.1:5500', 'http://localhost:5500'], // Frontend origin
  credentials: true,              // Allow cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE','PATCH'], // Allow all HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'] // Headers you're using
}));

app.use(express.json());
app.use(express.static(path.join(__dirname, '/frontend/views'))); // adjust path as needed

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
  cookie: {
    httpOnly: true,
    secure: false, // true only if you're using HTTPS
    sameSite: 'lax', // or 'none' for full cross-site cookies
    maxAge: 1000 * 60 * 60 // 1 hour
  }
}));

app.use('/api/projects', projectRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);


mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch((error) => console.log(error));
