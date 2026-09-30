# Agenticx Task 3 — Automation Script with Scheduling

A Node.js automation script that connects to MongoDB and runs a scheduled task every minute using `node-cron`. Designed to be safe to run unattended.

## Features
- ⏰ Scheduled task using `node-cron`
- 📊 Counts users in the MongoDB `users` collection every minute
- 📝 Logs all activity to `automation.log` with timestamps
- 🛡️ Robust error handling:
  - Global `uncaughtException` and `unhandledRejection` handlers
  - Automatic reconnection on MongoDB disconnect
  - Task-level try/catch so one failure doesn't crash the script
  - Graceful startup (waits for DB before scheduling)

## Setup
1. Clone the repo and run `npm install`
2. Create a `.env` file with: