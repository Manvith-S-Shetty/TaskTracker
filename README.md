# TaskFlow - Premium Task & Project Tracker

TaskFlow is a production-quality, responsive MERN stack task tracker web application. It features a modern, clean visual design with CSS-based glassmorphism, responsive grid layout, light/dark themes, and real-time frontend UI transitions. It is built as a split Client-Server architecture and connects to a MongoDB database.

---

## 🌟 Key Features
- **Full CRUD Operations**: Create, read, update, and delete tasks instantly.
- **Search & Query Filters**: Real-time filtering by status (`pending`, `in-progress`, `completed`) and instant search matches on titles (with performance debouncing).
- **Multiple Sort Options**: Order tasks by creation dates (newest/oldest first), alphabetical title lists, or upcoming due dates.
- **Vibrant Premium UI**: Built using custom vanilla CSS featuring card glassmorphism shadows, light/dark mode toggling, and interactive tactile micro-animations.
- **Form Validation**: Comprehensive validations for title constraints on both frontend form elements and backend schemas.
- **Toast Alert Manager**: Floating feedback alerts highlighting successful actions and error details dynamically.
- **Split Client-Server Architecture**: Decoupled systems communicating via secure JSON REST APIs.

---

## 📂 Project Folder Structure

```
TaskTracker/
├── server/                   # Express.js REST API Server
│   ├── config/               # Database config (db.js)
│   ├── models/               # Mongoose schema (Task.js)
│   ├── controllers/          # CRUD Business logic handlers (taskController.js)
│   ├── routes/               # Express endpoints (taskRoutes.js)
│   ├── middleware/           # Centralized exception handling (errorHandler.js)
│   ├── .env.example          # Server config blueprint
│   ├── server.js             # Server entry point
│   └── package.json          # Node dependencies list
├── client/                   # Vite + React.js Frontend
│   ├── src/                  # React source files
│   │   ├── components/       # Functional components (Form, List, Item, Toggle, Toast)
│   │   ├── context/          # Theme context provider (ThemeContext.jsx)
│   │   ├── utils/            # REST API Fetch client (api.js)
│   │   ├── App.jsx           # Dashboard root controller
│   │   └── main.jsx          # DOM entry mount script
│   ├── index.html            # SPA index template
│   ├── vite.config.js        # Vite compilation rules
│   ├── .env.example          # Client config blueprint
│   └── package.json          # Frontend packages list
└── README.md                 # System overview and start-up guide
```

---

## 🔧 Local Installation & Setup

### Prerequisites
- Node.js installed on your local computer.
- A free MongoDB Atlas Cluster (or local MongoDB database server running).

### 1. Server Configuration
Navigate to the server directory:
```bash
cd server
```

Install backend dependencies:
```bash
npm install
```

Create an active environment file:
Copy the template `.env.example` to a new file named `.env`:
```bash
cp .env.example .env
```
Open `.env` and fill out your variables:
- `PORT`: Set to `5000`
- `MONGO_URI`: Enter your MongoDB connection string (e.g. `mongodb+srv://...`)

Run the backend server in development mode:
```bash
npm run dev
```

---

### 2. Client Configuration
Open a new terminal and navigate to the client directory:
```bash
cd client
```

Install frontend dependencies:
```bash
npm install
```

Create an active environment file:
Copy `.env.example` to a new file named `.env`:
```bash
cp .env.example .env
```
Open `.env` and configure:
- `VITE_API_URL`: Set to `/api` (this matches the Vite proxy mapping)

Start the local React development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to view the app!

---

## 📝 API Documentation

All endpoints are prefixed with `/api/tasks` and return JSON payloads.

| Method | Endpoint | Description | Query Parameters |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/tasks` | Fetch list of all tasks. | `search` (text matching), `status` (pending/in-progress/completed), `sort` (-createdAt/createdAt/dueDate/title) |
| **GET** | `/api/tasks/:id` | Fetch details of a single task. | None |
| **POST** | `/api/tasks` | Create a new task. | Request Body: `{ title, description, status, dueDate }` |
| **PUT** | `/api/tasks/:id` | Update an existing task. | Request Body: `{ title, description, status, dueDate }` |
| **DELETE** | `/api/tasks/:id` | Delete a task. | None |

### Sample Success Response (GET /api/tasks)
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "_id": "60d5ec49f3e9c40015b6d5f2",
      "title": "Complete MERN Project",
      "description": "Generate folder layout and documentation",
      "status": "pending",
      "dueDate": "2026-06-30T00:00:00.000Z",
      "createdAt": "2026-06-28T12:00:00.000Z",
      "updatedAt": "2026-06-28T12:00:00.000Z"
    }
  ]
}
```

---

## 🚀 Deployment Instructions

### Backend (e.g., Render, Heroku)
1. Commit the `server` directory to your GitHub repository.
2. Create a new Web Service on your deployment host.
3. Configure settings:
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
4. Set up environment variables on the host's dashboard:
   - `MONGO_URI` = your cluster string.
   - `PORT` = `10000` (or host default).

### Frontend (e.g., Vercel, Netlify)
1. Commit the `client` directory to GitHub.
2. Link the project repository on Vercel or Netlify.
3. Configure build settings:
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Set up Environment Variable:
   - `VITE_API_URL` = your deployed backend API URL (e.g. `https://your-backend-service.onrender.com/api`).
5. Configure fallback redirects if using React Router (not needed for this single page App, but a best practice).

---

## 🖼️ Screenshots
*(Insert your screenshots of the Dashboard here)*

---

## 🔮 Future Improvements
- **User Authentication**: Secure individual profiles using JWT tokens.
- **Sub-tasks / Checklists**: Add child todo items inside a main task.
- **Calendar View**: Display a grid visualizer mapping task due dates.
- **Tags & Categories**: Add colorful custom tags to group tasks.
