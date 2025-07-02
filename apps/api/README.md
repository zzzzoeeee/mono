<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

<p align="center">
  <a href="https://nestjs.com/"><img alt="NestJS" src="https://img.shields.io/badge/Built_with-Nestjs-E0234E?style=flat&logo=nestjs&logoColor=white">
  </a>
  <a href="https://biomejs.dev"><img alt="Biome" src="https://img.shields.io/badge/Formated_with-Biome-60a5fa?style=flat&logo=biome"></a>
  <a href="https://prisma.io/"><img alt="Prisma" src="https://img.shields.io/badge/Powered_by_-Prisma-3982CE?style=flat&logo=prisma&logoColor=white">
  </a>
</p>

<p align="center">
  API service for the Mono project
</p>

## Description

This is the API service for the Mono project, built with NestJS. It provides the backend functionality and serves as the central API gateway for all client applications.

## Features

- RESTful API endpoints
- Authentication & Authorization
- Database integration
- Input validation
- Error handling

## Prerequisites

- Node.js (v18+)
- pnpm (v8+)
- PostgreSQL (v15+)

## Project setup

1. Copy `.env.example` to `.env` and update the values as needed
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Generate Prisma client:
   ```bash
   pnpm db:generate
   ```
4. Start the development server:
   ```bash
   pnpm dev
   ```

The API will be available at `http://localhost:3000` by default.

## License

This project is [MIT licensed](LICENSE).
