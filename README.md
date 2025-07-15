# BidBlaze - Real-time Auction Monitoring App

A full-stack auction monitoring web application with real-time features.

## Project Structure

```
BidBlaze/
├── frontend/          # React + Vite frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── ...
│   └── package.json
├── backend/           # Node.js + Express backend
│   ├── models/
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   └── package.json
└── README.md
```

## Getting Started

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## Technologies Used

**Frontend:**
- React + Vite
- TypeScript
- Tailwind CSS
- shadcn/ui

**Backend:**
- Node.js + Express.js
- MongoDB Atlas + Mongoose
- JWT Authentication
- CORS enabled

## Features

- User registration and authentication
- Real-time auction monitoring
- CRUD operations for auction items
- Responsive design
- Error handling and validation