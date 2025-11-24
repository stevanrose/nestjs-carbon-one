# 🚀 NestJS Starter Template

**A production-ready NestJS starter with Prisma 7, PostgreSQL, Docker,
strict ESLint, Prettier, and full testing setup.**

This template provides a clean, opinionated foundation for building
robust backend services with NestJS.\
It includes all the tooling, configuration, and best practices you need
--- without any domain-specific code.

## 📦 Features

### 🧱 Core Stack

-   NestJS 10+
-   Prisma 7 (with modern prisma.config.ts)
-   PostgreSQL (Dockerised)
-   ESLint (Flat config)
-   Prettier
-   Jest + Supertest
-   @nestjs/config
-   Global validation (class-validator)
-   Global exception filter

### 🛠 Developer Experience

-   docker-compose for DB
-   Prisma Studio support
-   NPM scripts for lint/format/tests/migrations
-   Opinionated folder structure

## 📁 Project Structure

    .
    ├── prisma/
    │   ├── schema.prisma
    │   ├── prisma.config.ts
    │   └── migrations/
    ├── src/
    │   ├── common/
    │   ├── config/
    │   ├── prisma/
    │   ├── app.module.ts
    │   └── main.ts
    ├── test/
    │   └── app.e2e-spec.ts
    ├── docker-compose.yml
    ├── eslint.config.mjs
    ├── jest.config.ts
    ├── .env.example
    ├── .prettierrc
    ├── .editorconfig
    └── README.md

## 🚀 Getting Started

### 1️⃣ Install dependencies

    npm install

### 2️⃣ Start database

    npm run db:up

### 3️⃣ Environment variables

    cp .env.example .env

### 4️⃣ Generate Prisma client

    npx prisma generate

### 5️⃣ Start app

    npm run start:dev

## 🧪 Testing

    npm test
    npm run test:watch
    npm run test:cov
    npm run test:e2e

## 🐘 Database

    npm run db:up
    npm run db:down
    npm run db:logs

## 🔧 Prisma

    npx prisma generate
    npx prisma migrate dev --name init
    npx prisma studio

## 📐 Code Style

    npm run lint
    npm run lint:fix
    npm run format

## 📄 License

MIT
