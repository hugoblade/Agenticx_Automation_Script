require('dotenv').config();
const cron = require('node-cron');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const connectDB = require('./config/db');

// Helper function to log to both console and a file
const logMessage = (message) => {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] ${message}\n`;

  // Print to console
  console.log(logEntry.trim());

  // Append to a file (for unattended runs)
  try {
    fs.appendFileSync(path.join(__dirname, 'automation.log'), logEntry);
  } catch (err) {
    console.error('Failed to write to log file:', err.message);
  }
};

// The actual task we want to automate
const runAutomatedTask = async () => {
  logMessage('🤖 Starting automated task...');

  try {
    // Check if DB is connected before running
    if (mongoose.connection.readyState !== 1) {
      throw new Error('Database not connected. Skipping task.');
    }

    // Example Task: Count users in the database
    const userCount = await mongoose.connection.db
      .collection('users')
      .countDocuments();

    logMessage(`📊 Task Complete: There are currently ${userCount} users in the database.`);
  } catch (error) {
    logMessage(`❌ Task Failed: ${error.message}`);
  }
};

// Main startup function
const start = async () => {
  logMessage('🚀 Automation script starting...');

  // 1. WAIT for DB to connect before scheduling
  await connectDB();

  // 2. Only start the cron job AFTER a successful connection
  cron.schedule('* * * * *', () => {
    runAutomatedTask();
  });

  logMessage('⏰ Scheduler started. Waiting for scheduled tasks...');
};

// Global Error Handlers (Crucial for unattended scripts)
process.on('uncaughtException', (error) => {
  logMessage(`🚨 UNCAUGHT EXCEPTION: ${error.message}`);
});

process.on('unhandledRejection', (reason) => {
  logMessage(`🚨 UNHANDLED REJECTION: ${reason}`);
});

// Run it
start();