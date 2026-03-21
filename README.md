# Slotify - Premium Salon Booking System

![Slotify Banner](https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=1200)

Slotify is a state-of-the-art, full-stack salon management and appointment booking platform. Designed for both salon owners and customers, it offers a seamless, premium experience for scheduling grooming sessions.

## 🚀 Features

### **For Customers**
- **Sleek Booking Flow**: Browse services and book time slots in seconds.
- **Personal Dashboard**: Track upcoming and past appointments with detailed status indicators.
- **Real-time Availability**: See exactly which slots are open with automatic expiration of past times.
- **Automated Reminders**: Receive "Hurry Up" notifications via Email before your session.
- **Dark/Light Mode**: High-end visual experience with full theme transition support.

### **For Admins**
- **Management Suite**: full control over services, pricing, and durations.
- **Booking Overview**: Real-time monitoring of all salon activities.
- **Revenue Analytics**: Automated reports on salon performance and earnings.
- **Dynamic Scheduling**: Automated background tasks for slot cleanup and reminders.

## 🛠️ Tech Stack

### **Frontend**
- **Next.js 15** (App Router)
- **React 19**
- **Tailwind CSS 4** (Latest CSS-first configuration)
- **Lucide React** (Premium Icons)
- **Context API** (State Management)

### **Backend**
- **Node.js & Express**
- **MongoDB & Mongoose**
- **JSON Web Tokens (JWT)** (Secure Auth)
- **Resend API** (Modern Email Infrastructure)
- **Node-Cron** (Scheduled Workflows)

## 📦 Project Structure

```text
salon-slot-booking/
├── client/           # Next.js Frontend
│   ├── app/          # App Router Pages
│   ├── components/   # UI Components
│   └── context/      # Theme & Auth Contexts
└── server/           # Express Backend
    ├── controllers/  # API Logic
    ├── models/       # DB Schemas
    ├── routes/       # API Endpoints
    └── services/     # Email, WhatsApp & Business Logic
```

## 🚦 Getting Started

### **Prerequisites**
- Node.js (v18+)
- MongoDB Atlas account
- Resend API Key (for email notifications)

### **Setup**

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd salon-slot-booking
   ```

2. **Server Setup**
   ```bash
   cd server
   npm install
   # Create a .env file with your credentials (PORT, MONGO_URI, JWT_SECRET, RESEND_API_KEY, ADMIN_EMAIL)
   npm run dev
   ```

3. **Client Setup**
   ```bash
   cd client
   npm install
   npm run dev
   ```

## 🎨 Aesthetic Highlights
Slotify utilizes a **Glassmorphism** design language with vibrant indigo accents and smooth micro-animations. The dark mode is implemented using a CSS-first approach in Tailwind 4, ensuring a premium feel in all environments.

---

*Built with ❤️ for the modern grooming industry.*
