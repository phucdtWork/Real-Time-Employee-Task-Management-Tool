# Real-Time-Employee-Task-Management-Tool

> A real-time chat application between owners and employees built with Express.js, React.js, Firebase, SMS integration via TextLink, and email notifications via Nodemailer.

## Tech Stack

| **Frontend** | **Backend** | **Services** |
| ------------ | ----------- | ------------ |
| React.js     | Express.js  | TextLink SMS |
| Tailwind CSS | Socket.io   | Nodemailer   |
| Ant Design   | Firebase    | Firebase     |

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

## Installation & Setup

### 1. Clone and install dependencies

```bash
git clone <repository-url>
cd real-time-employee-task-management-tool
npm install
cd backend npm i
cd ..
cd frontend npm i
cd ..
```

### 2. Setup environment variables

- Download `.env` file (https://drive.google.com/file/d/1RotF_cNCzozVHAWzwLhtGFMmXiC3HWyQ/view?usp=drive_link)
- Replace values ​​in firebase to use your firebase database

### 4. Setup owner account for login on your firebase to login with phone number

Create a collection users with the following document:
```bash
"name": "owner name",
"phoneNumber": "your phone number example: +84334237435",
"role": "owner",
```

### 3. Run the application

```bash
npm start  # Runs both frontend and backend
```


## Available Scripts

| Script           | Description                   |
| ---------------- | ----------------------------- |
| `npm start`      | Run both frontend and backend |
| `npm run client` | Run frontend only             |
| `npm run server` | Run backend only              |

## Features

- Real-time chat between owner and employees
- SMS notifications via TextLink
- Email notifications via Nodemailer
- Employee management
- Access code authentication

## Screenshots

### Authentication

![Login with Phone number for Owner ](/screenShort/Login-with-phone-number.png)

![Login with User and Password for Employee ](/screenShort/login-with-username.png)

![Login with Email for Employee ](/screenShort/login-with-email.png)

![verification code screen ](/screenShort/verification-code-screen.png)

### Manage Employee

![List of employee ](/screenShort/manage-employee-screen.png)

![Crete employee ](/screenShort/create-employee.png)

![Register user name and password for Employee with setup lin ](/screenShort/reigester-screen-in-settup-link.png)

![Update employee ](/screenShort/update-employee.png)

![Delete employee ](/screenShort/delete-employee.png)

### Manage task

![Manage task screen for Owner ](/screenShort/manage-task.png)

![Manage task screen for Employee ](/screenShort/manage-task-for-employee.png)

![Create task screen ](/screenShort/create-task-screen.png)

![Update task screen ](/screenShort/update-task-screen.png)

![Delete task screen ](/screenShort/delete-task-screen.png)

### Message page

![Message screen for Employee ](/screenShort/chat-message-screen-employee.png)

![Message screen for Owner ](/screenShort/chat-message-screen-employee.png)

---
