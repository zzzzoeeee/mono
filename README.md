# Mono - Monorepo Project

<p align="center">
  <a href="https://nestjs.com/" target="_blank">
    <img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" />
  </a>
  <a href="https://turbo.build/repo" target="_blank" style="margin: 0 20px">
    <img src="https://turbo.build/images/docs/repo/repo-hero-logo-dark.svg" width="120" alt="Turborepo" />
  </a>
</p>

<p align="center">
  <a href="https://nestjs.com/"><img alt="NestJS" src="https://img.shields.io/badge/Built_with-Nestjs-E0234E?style=flat&logo=nestjs&logoColor=white">
  </a>
  <a href="https://biomejs.dev"><img alt="Biome" src="https://img.shields.io/badge/Formated_with-Biome-60a5fa?style=flat&logo=biome"></a>
  <a href="https://prisma.io/"><img alt="Prisma" src="https://img.shields.io/badge/Powered_by_-Prisma-3982CE?style=flat&logo=prisma&logoColor=white">
  </a>
</p>

## Project Overview

Mono is a monorepo project demonstrating full-stack application development.

## 🚀 Completed Components

### API Service

A robust NestJS-based API service with the following features:

- RESTful API endpoints
- Authentication & Authorization
- Database integration with Prisma ORM
- Input validation
- Comprehensive error handling
- Environment-based configuration

📁 [View API Documentation](/apps/api/README.md)

## 🛠️ Development Setup

### Prerequisites

- Node.js (v18+)
- pnpm (v8+)
- PostgreSQL (v15+)

### Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Set up environment variables (copy from .env.example) and fill in the values in each service's .env file
4. Start all development applications:
   ```bash
   pnpm dev
   ```
5. Each application will run on a different port:
   - API: http://localhost:3000
   - Admin: http://localhost:3001
   - Storefront: http://localhost:3002

## 🏗️ Future Components (Planned)

- Storefront
- Admin Console

## 🛡️ License

This project is [MIT licensed](LICENSE).
