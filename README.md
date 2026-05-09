# Gema - Hotel Booking Platform

A comprehensive PEAN stack (PostgreSQL + Express + Angular + Node.js) web application for international tourists to book hotel accommodations with vehicle and travel packages.

## Overview

Gema is a hotel booking and travel package platform designed for foreign tourists. Customers can:
- Browse destinations and available places to visit
- Select accommodation packages based on budget and stay duration
- Choose or be assigned vehicles for travel
- View predefined routes with daily itineraries
- Complete bookings with integrated payment system

## Features

### For Customers
- User authentication and profile management
- Search and filter accommodation packages by budget, duration, destination
- Vehicle selection (manual choice or auto-assign based on budget)
- Route visualization with daily itineraries
- Booking management and history
- Payment integration

### For Admins
- Destination management (CRUD operations)
- Hotel/accommodation management
- Vehicle fleet management
- Route and itinerary creation
- Package creation and pricing
- Booking management and approvals
- Dashboard and analytics

### For Users (Providers)
- Manage hotels and vehicles
- Create and manage routes and itineraries

## Tech Stack

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** PostgreSQL
- **ORM:** Sequelize
- **Authentication:** JWT (JSON Web Tokens)
- **Password Hashing:** bcryptjs
- **File Upload:** Multer
- **Security:** Helmet, CORS

### Frontend
- **Framework:** Angular
- **Language:** TypeScript
- **UI Framework:** Bootstrap / Angular Material
- **Maps:** Google Maps API / Leaflet.js
- **HTTP Client:** Angular HttpClient
- **State Management:** RxJS

## Project Structure

```
Gema/
├── backend/
│   ├── config/           # Database and app configuration
│   ├── models/           # Sequelize models (Database schema)
│   ├── routes/           # API route definitions
│   ├── controllers/       # Business logic
│   ├── middleware/        # Auth, error handling, etc.
│   ├── public/uploads/    # File upload storage
│   ├── server.js          # Express app entry point
│   ├── package.json
│   └── .env              # Environment variables
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── auth/           # Login/Register components
│   │   │   ├── admin/          # Admin dashboard
│   │   │   ├── customer/       # Customer booking interface
│   │   │   ├── shared/         # Shared components
│   │   │   ├── services/       # API communication
│   │   │   ├── models/         # TypeScript interfaces
│   │   │   └── app.module.ts
│   │   ├── main.ts
│   │   └── index.html
│   ├── angular.json
│   ├── package.json
│   └── tsconfig.json
├── .gitignore
├── .editorconfig
└── README.md
```

## Prerequisites

- Node.js >= 16.x
- npm >= 8.x or yarn >= 1.22.x
- PostgreSQL >= 12
- Angular CLI >= 14

## Installation

### Backend Setup

```bash
cd backend
npm install
```

Create `.env` file in backend directory:
```
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=gema
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

### Frontend Setup

```bash
cd frontend
npm install
```

## Running the Application

### Backend
```bash
cd backend
npm start
```
The API will be available at `http://localhost:3000`

### Frontend
```bash
cd frontend
ng serve
```
The application will be available at `http://localhost:4200`

## API Documentation

API endpoints are organized by feature:
- `/api/auth` - Authentication endpoints
- `/api/destinations` - Destination management
- `/api/hotels` - Hotel management
- `/api/vehicles` - Vehicle management
- `/api/packages` - Package management
- `/api/bookings` - Booking management
- `/api/routes` - Route management
- `/api/admin` - Admin-only endpoints

## Database

PostgreSQL database setup required. Connection details in `.env` file.

Database will be initialized with migrations on first run (to be implemented).

## Development

### Code Style
- Follow ESLint configuration (to be added)
- Use Prettier for code formatting (to be added)

### Git Workflow
- Use feature branches: `feature/feature-name`
- Use bug branches: `bugfix/bug-name`

## Testing

Testing setup to be configured in Phase 6.

## Deployment

Deployment configuration and guidelines to be added in Phase 6.

## Contributing

Please follow the project structure and code style guidelines. Submit pull requests for review.

## License

Proprietary - Gema Hotel Booking Platform

## Contact & Support

For questions or issues, please create an issue in the repository.

---

**Status:** Phase 1 - Project Setup (In Progress)
