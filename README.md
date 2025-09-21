# Real-Time-Employee-Task-Management-Tool

>  A real-time chat application between owners and employees built with Express.js, React.js, Firebase, SMS integration via TextLink, and email notifications via Nodemailer.

##  Tech Stack

| **Frontend** | **Backend** | **Services** |
|--------------|-------------|--------------|
| React.js | Express.js | TextLink SMS |
| Tailwind CSS | Socket.io | Nodemailer |
| Ant Design | Firebase | Firebase |

## Project Structure

```
real-time-employee-task-management-tool/
├──  frontend/src/
│   ├──  components/    # UI components
│   ├──  pages/         # Page components  
│   ├──  apis/          # API services
│   └──  utils/         # Utilities
├──  backend/src/
│   ├──  controllers/   # Route controllers
│   ├──  services/      # Business logic
│   ├──  routes/        # API routes
│   └──  config/        # Configuration
├──  screenshots/       # Application screenshots
└──  .env               # Environment variables
```

##  Installation & Setup

### 1. Clone and install dependencies
```bash
git clone <repository-url>
cd real-time-employee-task-management-tool
npm install
cd backend npm i
cd ..
cd frontend npm i
```

### 2. Setup environment variables
Download `.env` file here

### 3. Run the application
```bash
npm start  # Runs both frontend and backend
```

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm start` | Run both frontend and backend |
| `npm run client` | Run frontend only |
| `npm run server` | Run backend only |

## Features

- Real-time chat between owner and employees
- SMS notifications via TextLink
- Email notifications via Nodemailer
- User role management (Owner/Employee)
- Access code authentication

## Screenshots

### Login Page
![Login Page](screenshots/login.png)

### Chat Interface  
![Chat Interface](screenshots/chat.png)

### Dashboard
![Dashboard](screenshots/dashboard.png)

---
