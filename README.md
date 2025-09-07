# 🏆 SportSync

A centralized digital sports platform for NUS
---

## 🎯 The Problem We're Solving

Ever tried managing training and attendance for hundreds of students? Wanted to support your hall in IHG but had no idea when matches were happening? Struggled to find that cool NUS Badminton jersey you saw once?

**SportSync** tackles the fragmented NUS sports ecosystem by bringing everything under one roof.

## ✨ What Makes SportSync Special

### 🎮 **Open Matchmaking System**
- Create or join sports lobbies instantly
- Real-time capacity management with waitlists
- Password-protected private sessions
- Automated reminders 2 hours before games

### 🏫 **CCA Dashboard**
- Centralized hub for all NUS sports CCAs
- Training session management with attendance tracking
- Member recruitment and engagement tools
- Automated notifications for events and announcements

### 🏅 **Tournament Information System**
- Live updates for IHG, IFG, and other major tournaments
- Complete match schedules and results
- Team rosters with player profiles
- Never miss your hall's big win again!

### 🎉 **Event Management**
- Discover campus-wide sports events and charity runs
- One-click registration with waitlist support
- Event organizers can broadcast updates instantly
- Perfect for both CCA events and open community activities

### 🛒 **Merchandise Marketplace**
- Browse and shop official CCA merchandise
- Wishlist your favorite items
- Direct purchase links integrated
- Get notified when your wishlist items are updated

### 🔔 **Smart Notification System**
- Real-time WebSocket notifications
- Email notifications for important updates
- Customizable notification preferences
- Never miss training, matches, or announcements

---

## 🛠️ Tech Stack

### Frontend
- **React**
- **Next.js**
- **Material-UI**
- **Tailwind CSS**

### Backend
- **Django REST Framework**
- **PostgreSQL**
- **Redis**
- **Celery**
- **JWT Authentication**

### Infrastructure
- **Docker**
- **Vercel**
- **Render**
- **Cloudinary**

---

## 🏗️ Architecture Highlights

### SOLID Principles in Action
- **Single Responsibility**: Each Django model and React component has one clear purpose
- **Open/Closed**: Permission system and notification types are easily extensible
- **Interface Segregation**: Role-based API access ensures users only see what they need

### CI/CD Pipeline
- **Automated Testing**: Frontend (Jest) and Backend (Django TestCase) on every PR
- **Multi-environment**: Tests across Node.js 18.x, 20.x, 22.x versions
- **Auto Deployment**: Seamless deployment to production after successful tests

### Security First
- JWT-based authentication with refresh tokens
- Role-based access control (Student/Staff/Committee)
- Secure file uploads with validation
- CORS and CSRF protection

## 🤝 The Team

- **Made Yoga Chantiswara** (Electrical Engineering)
- **Alexander Gerald** (Computer Science)

NUS Orbital 2025 - Apollo 11
---
