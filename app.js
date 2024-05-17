const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const authRoutes = require('./routes/auth');

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(session({
    secret: 'secretKey',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: 'mongodb://localhost:27017/auth-db' }),
    cookie: { maxAge: 1000 * 60 * 60 * 24 } // 1 day
}));

// MongoDB Verbindung
mongoose.connect('mongodb://localhost:27017/auth-db')
    .then(() => {
        console.log('MongoDB connected');
    })
    .catch(err => {
        console.error('MongoDB connection error', err);
    });

// Routen
app.use('/api/auth', authRoutes);

// Server starten
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
