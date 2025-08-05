const express = require('express');
const cors = require('cors');
const database = require('./config/database');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174'], // Frontend URLs
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/auth', require('./routes/auth'));

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ message: 'Server is running!', timestamp: new Date() });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Start server
async function startServer() {
    try {
        // Connect to database
        await database.connect();
        
        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
            console.log(`📊 Health check: http://localhost:${PORT}/health`);
            console.log(`✅ Database connected successfully`);
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
    console.log('SIGTERM received, shutting down gracefully');
    await database.close();
    process.exit(0);
});

process.on('SIGINT', async () => {
    console.log('SIGINT received, shutting down gracefully');
    await database.close();
    process.exit(0);
});

startServer();
