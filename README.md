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
Real-Time-Employee-Task-Management-Tool/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controller/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── services/
│   │   └── utils/
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── apis/           # API services
│   │   ├── assets/         # Static assets (images, fonts, etc.)
│   │   ├── components/     # UI components
│   │   ├── layouts/        # Layout components
│   │   ├── pages/          # Page components
│   │   ├── routes/         # Routing configuration
│   │   ├── service/        # Business logic services
│   │   ├── utils/          # Utilities and helpers
│   │   ├── App.jsx         # Root component
│   │   ├── index.css       # Global styles
│   │   └── main.jsx        # App entry point (React mount)
│   └── index.html
├── screenShort/
├── .env
└── README.md
```

## Installation & Setup

### 1. Clone and install dependencies

```bash
git clone <repository-url>
cd Real-Time-Employee-Task-Management-Tool
npm i
cd backend npm i
cd ..
cd frontend npm i
cd ..
```

### 2. Setup environment variables

- Download `.env` file (https://drive.google.com/file/d/1RotF_cNCzozVHAWzwLhtGFMmXiC3HWyQ/view?usp=drive_link)
- Replace values in firebase to use your firebase database (note: you should use your own firebase and set up an owner account following the instructions to be able to log into the system, as the current owner's phoneNumber is still mine)

### 3. Setup owner account for login on your firebase to login with phone number

Create a collection users with the following document:
```bash
"name": "owner name",
"phoneNumber": "your phone number example: +84334237435",
"role": "owner",
```

### 4. Run the application

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
- Task management
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
