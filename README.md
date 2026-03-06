<img width="827" height="834" alt="Screenshot 4png" src="https://github.com/user-attachments/assets/82150784-403e-458b-a861-573d885153bb" /># 📋 Task Manager - Complete Full-Stack Application

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

🚀 How to Run the Project
Follow these steps exactly to get the application running on your local machine.

1. Prerequisites
Make sure you have the following installed:

Node.js (Version 16.0 or higher) - Download Node.js
Git (Optional, for cloning)
2. Installation
Step A: Clone the repositoryOpen your terminal (Command Prompt or Bash) and run:

git clone https://github.com/YOUR_USERNAME/task-tracker.gitcd task-tracker
Step B: Install Dependencies
This command downloads all required libraries (React, Tailwind, etc.).

bash

npm install
3. Configuration (Important)
Create a file named .env in the root folder of the project.

Option 1: Run with Mock Backend (Default)
If you do not have a backend server, simply leave the value empty. The app will use your browser's LocalStorage as a database.

env

VITE_API_URL=
Option 2: Run with Real Backend
If you have a backend API running, paste the URL here:

env

VITE_API_URL=http://localhost:5000/api
4. Start the Application
Run the development server:

bash

npm run dev
You will see output similar to this:

text

  VITE v5.1.0  ready in 300 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
Open your browser and navigate to: http://localhost:5173

🧪 How to Run Tests
The project includes unit and integration tests.

Run tests:

bash

npm test
Run tests with visual UI:

bash

npm run test:ui
💡 How to Use the App
Since the default mode is Mock Backend, no real server is required. Here is how to test the features:

Login / Register
Go to the Register page.
Fill in the form.
You will be automatically logged in.
Accessing Admin Features
To test the Admin Dashboard:

Go to the Register page.
Enter admin as the Name (this acts as a secret key).
Complete registration.
You will see the "Admin Dashboard" with access to all users and tasks.
📦 Build for Production
To create a production-ready build:

bash

npm run build
The static files will be generated in the dist/ folder.

🛠 Tech Stack
Frontend: React 18 + Vite
Styling: Tailwind CSS
Routing: React Router v6
Testing: Vitest + React Testing Library
📁 Project Structure
text

src/
├── components/    # Reusable UI (Navbar, Modal)
├── context/       # Authentication State (AuthContext)
├── pages/         # Page Components (Login, Dashboard)
├── services/      # API Layer (Mock & Real logic)
└── App.jsx        # Main Routes
