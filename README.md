# Scalable Microservice Chat System

A real-time, event-driven chat application built with a microservice architecture, WebSockets, RabbitMQ message broker, Redis caching, and Next.js 15.

---

## 🏗️ System Architecture

```
                       ┌─────────────────────────┐
                       │  Next.js 15 Client      │
                       │     (Port 3000)         │
                       └───────────┬─────────────┘
                                   │
         ┌─────────────────────────┼─────────────────────────┐
         │ HTTP                    │ HTTP / WebSockets       │ HTTP
         ▼                         ▼                         ▼
┌─────────────────┐       ┌──────────────────┐      ┌────────────────────┐
│  Auth Service   │       │ Realtime Service │      │  Dispatch Service  │
│   (Port 8000)   │       │   (Port 8002)    │      │    (Port 8001)     │
└────────┬────────┘       └────────┬─────────┘      └────────────────────┘
         │                         │                          ▲
   ┌─────┴─────┐             ┌─────┴─────┐                    │ RabbitMQ
   ▼           ▼             ▼           ▼                    │ Consumer
MongoDB      Redis        MongoDB    Cloudinary               │
(Users)     (OTP/Rate)    (Chats)     (Images) ───────────────┘
```

---

## 🚀 Microservices Breakdown

| Service | Directory | Port | Primary Responsibilities | Tech Stack |
|---|---|---|---|---|
| **Auth Service** | `server/auth-service` | `8000` | User auth, OTP generation, JWT signing, profile management | Express, MongoDB, Redis, RabbitMQ |
| **Dispatch Service** | `server/dispatch-service` | `8001` | Asynchronous OTP email dispatch | Express, RabbitMQ Consumer, Nodemailer |
| **Realtime Service** | `server/realtime-service` | `8002` | Real-time messaging, Socket.IO rooms, media uploads | Express, Socket.IO, MongoDB, Cloudinary |
| **Client** | `client` | `3000` | User dashboard, active chats, real-time message sync | Next.js 15, React 19, Tailwind CSS v4 |

---

## 🛠️ Quick Start

### 1. Start Infrastructure (RabbitMQ & Redis)
```bash
docker-compose up -d
```

### 2. Start Microservices & Client
```bash
# Terminal 1: Auth Service
cd server/auth-service && npm run dev

# Terminal 2: Dispatch Service
cd server/dispatch-service && npm run dev

# Terminal 3: Realtime Service
cd server/realtime-service && npm run dev

# Terminal 4: Next.js Client
cd client && npm run dev
```

---

## 🔐 Environment Setup

Copy `.env.example` to `.env` in each service directory and fill in your credentials.
