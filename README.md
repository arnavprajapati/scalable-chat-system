# Scalable Microservice Chat System

A real-time, event-driven chat application built with a microservice architecture, WebSockets, RabbitMQ message broker, Redis caching, and Next.js 15.

---

## 🏗️ System Architecture

```
                       ┌─────────────────────────┐
                       │   Next.js 15 Frontend   │
                       │     (Port 3000)         │
                       └───────────┬─────────────┘
                                   │
         ┌─────────────────────────┼─────────────────────────┐
         │ HTTP                    │ HTTP / WebSockets       │ HTTP
         ▼                         ▼                         ▼
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│  User Service   │       │  Chat Service   │       │  Mail Service   │
│   (Port 8000)   │       │   (Port 8002)   │       │   (Port 8001)   │
└────────┬────────┘       └────────┬────────┘       └─────────────────┘
         │                         │                         ▲
   ┌─────┴─────┐             ┌─────┴─────┐                   │ RabbitMQ
   ▼           ▼             ▼           ▼                   │ Consumer
MongoDB      Redis        MongoDB    Cloudinary              │
(Users)     (OTP/Rate)    (Chats)     (Images) ──────────────┘
```

---

## 🚀 Microservices Breakdown

| Service | Port | Primary Responsibilities | Tech Stack |
|---|---|---|---|
| **User Service** | `8000` | User auth, OTP generation, JWT signing, profile management | Express, MongoDB, Redis, RabbitMQ |
| **Mail Service** | `8001` | Asynchronous OTP email dispatch | Express, RabbitMQ Consumer, Nodemailer |
| **Chat Service** | `8002` | Real-time messaging, Socket.IO rooms, media uploads | Express, Socket.IO, MongoDB, Cloudinary |
| **Frontend** | `3000` | User dashboard, active chats, real-time message sync | Next.js 15, React 19, Tailwind CSS v4 |

---

## 🛠️ Quick Start

### 1. Start Infrastructure (RabbitMQ & Redis)
```bash
docker-compose up -d
```

### 2. Start Microservices & Frontend
```bash
# Terminal 1: User Service
cd backend/user && npm run dev

# Terminal 2: Mail Service
cd backend/mail && npm run dev

# Terminal 3: Chat Service
cd backend/chat && npm run dev

# Terminal 4: Next.js Frontend
cd frontend && npm run dev
```

---

## 🔐 Environment Setup

Copy `.env.example` to `.env` in each service directory and fill in your credentials.
