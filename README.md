# Order Management Express + Nuxt Backend

This repository contains the backend API for an order management system built with Express.js and TypeScript. It powers authentication, user and role management, inventory operations, sales workflows, notifications, and file uploads for a modern e-commerce-style application.

## Overview

The backend is designed as a modular REST API with clear separation between routes, services, repositories, and models. It provides a foundation for a full-stack order management application with:

- Authentication and authorization
- Role-based access control
- User and profile management
- Product and category management
- Inventory tracking and stock adjustments
- Sales and order processing
- Notifications and payment methods
- File storage integration with MinIO
- API documentation with Swagger

## Tech Stack

- Node.js + TypeScript
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Swagger for API documentation
- MinIO for object storage
- Docker Compose for local development

## Project Structure

```text
src/
  app.ts                 # Express app setup
  server.ts              # Server bootstrap
  config/                # Swagger and app configuration
  common/                # Shared middleware, services, and utilities
  database/              # DB connection, migrations, and seeds
  minio/                 # File upload/storage controller and routes
  modules/               # Feature-based modules
    auth/                # Login, register, account management
    admin/               # Dashboard, inventory, master data, sales, system modules
  routes/                # API route aggregation
```

## Features

### Authentication and Security
- User registration and login
- JWT-based authentication
- Permission and role management
- Protected routes with middleware

### Business Modules
- Category and product management
- Inventory management with stock in/out and adjustments
- Sales and order management
- Dashboard API for summaries and reporting
- Notification and payment method configuration

### Media Handling
- Upload and manage files through MinIO
- Configurable bucket and storage settings

## Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js 18+
- npm or yarn
- Docker and Docker Compose (recommended for local development)

### Installation

1. Clone the repository
   ```bash
   git clone <repository-url>
   cd order-management-express-nuxt-backend
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Create an environment file
   ```bash
   cp .env.example .env
   ```

4. Update environment variables as needed

### Environment Variables

The application uses the following environment variables:

```env
PORT=8000
NODE_ENV=development
MONGO_URI=mongodb://admin:123456@mongodb:27017/express_learning?authSource=admin
JWT_SECRET=change-this-secret-in-production
JWT_EXPIRES_IN=1d
MINIO_ENDPOINT=minio
MINIO_PORT=9000
MINIO_USE_SSL=false
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_BUCKET=order-management
MINIO_REGION=us-east-1
```

## Running the Project

### Development mode

```bash
npm run dev
```

### Build for production

```bash
npm run build
```

### Start production build

```bash
npm start
```

## Docker Setup

The project includes Docker Compose configuration for the API, MongoDB, and MinIO.

```bash
docker compose up --build
```

This will start:
- API server on port 8000
- MongoDB on port 27017
- MinIO on port 9000 and 9001

## Database Commands

```bash
npm run migrate
npm run seed
npm run seed:fresh
npm run db:drop
```

## API Documentation

Swagger documentation is available at:

```text
http://localhost:8000/api-docs/
```

## API Base URL

All API routes are served under:

```text
http://localhost:8000/api/v1
```

## Notes

- The project uses a modular structure for easy feature expansion.
- Authentication is enforced through middleware for protected endpoints.
- Swagger documentation is helpful for exploring and testing the API during development.

## License

This project is licensed under ISC.
