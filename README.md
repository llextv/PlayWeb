# PlayWeb 🎮

PlayWeb is a gaming platform inspired by Steam. It brings different games together in one place and lets players use their account across supported games.

The project includes a backend that manages player accounts, game connections, and achievements.

## 🛠️ Technologies

- **Node.js** and **Express** for the backend API
- **TypeScript** for the server code
- **MySQL** to store data
- **Prisma** to work with the database
- **Socket.IO** for real-time communication

## ⚙️ How it works

PlayWeb connects the main platform with its games.

- **Accounts:** Players use their PlayWeb account to access supported games.
- **Authentication:** The backend uses tokens to identify players and check their access.
- **Games:** Each game can communicate with the backend to use platform features.
- **Achievements:** Games can send achievement requests to the backend, which checks the request before saving the achievement.
- **Database:** MySQL stores the data needed by the platform.

This system makes it possible to connect several games to the same platform instead of building every feature separately for each game.

## 🏗️ Architecture

```text
             Player
                |
                v
          PlayWeb Platform
                |
                v
          Backend API
          (Express + TS)
                |
          +-----+------+
          |            |
          v            v
       MySQL       Game Services
          |            |
          v            v
        Prisma    Game Servers
```

The backend is the main link between the platform, its database, and the connected games.

## 🚀 Getting Started

### Requirements

- Node.js
- npm
- MySQL

### Installation

Clone the repository:

```bash
git clone YOUR_REPOSITORY_URL
cd PlayWeb
```

Go to the backend folder and install the dependencies:

```bash
cd backend
npm install
```

### Configuration

Create a `.env` file in the backend folder and add your database connection:

```env
DATABASE_URL="your_database_connection_url"
```

Replace the example value with your own MySQL connection details. Add any other environment variables required by the project.

### Database setup

Generate the Prisma client:

```bash
npx prisma generate
```

Make sure your database is configured and your Prisma schema is ready before starting the server.

### Start the backend

Check the scripts in `backend/package.json` and run the appropriate command. For example, if the project has a `dev` script:

```bash
npm run dev
```

## 🚧 Status

PlayWeb is still in development. The platform and its connected games are updated as new features are built and tested.

## 🎯 Goal

The goal of PlayWeb is simple: bring games together, give players one account, and make achievements part of a shared gaming experience.

**One platform, many games.**
