# Contract Management Dashboard

A production-grade full-stack **Contract Management Dashboard** built with modern web technologies. The application allows users to create, manage, track, and search contracts with full lifecycle management, version history, and role-based access control.

![Node.js](https://img.shields.io/badge/Node.js-v18+-339933?logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/React-v18-61DAFB?logo=react&logoColor=black)
![MongoDB](https://img.shields.io/badge/MongoDB-v7+-47A248?logo=mongodb&logoColor=white)
![Redux](https://img.shields.io/badge/Redux_Toolkit-v2-764ABC?logo=redux&logoColor=white)

---

## 🎯 Features

### Authentication & Authorization
- JWT-based user signup/login
- Role-based access control (Admin / User)
- Persistent sessions with localStorage
- Protected routes with role verification

### Contract Management
- **Create** contracts with title, description, parties, dates, and status
- **Update** contracts with status transition validation (Draft → Active → Executed → Expired)
- **Soft delete** contracts (recoverable)
- **Version history** — automatic snapshots on every update
- **Activity logs** — audit trail for all contract actions

### Contract Listing
- **Search** by title or party name
- **Filter** by status and date range
- **Sort** by created date, updated date, title, start/end date
- **Pagination** with configurable page size

### Dashboard
- Overview stats (total, active, draft, expired contracts)
- Status distribution visualization
- Recent contracts quick access

### Admin Panel
- User management (view all users)
- Role assignment (promote/demote users)

---

## 🏗 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React.js (JavaScript), Redux Toolkit, React Router v6, Vite |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB with Mongoose ODM |
| **Authentication** | JWT (JSON Web Tokens), bcryptjs |
| **Styling** | Vanilla CSS (Dark theme, Glassmorphism) |
| **HTTP Client** | Axios |

---

## 📁 Project Structure

```
contract-management-dashboard/
├── backend/
│   ├── .env                    # Environment variables
│   ├── package.json
│   └── src/
│       ├── index.js            # Express server entry point
│       ├── config/
│       │   └── db.js           # MongoDB connection
│       ├── models/
│       │   ├── User.js         # User schema (bcrypt, roles)
│       │   └── Contract.js     # Contract schema (versions, audit)
│       ├── middleware/
│       │   ├── auth.js         # JWT auth + role authorization
│       │   ├── validate.js     # Express-validator rules
│       │   └── errorHandler.js # Global error handler
│       ├── controllers/
│       │   ├── authController.js
│       │   ├── contractController.js
│       │   └── userController.js
│       ├── routes/
│       │   ├── authRoutes.js
│       │   ├── contractRoutes.js
│       │   └── userRoutes.js
│       └── utils/
│           ├── apiResponse.js  # Standardized API responses
│           └── seed.js         # Database seeder
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js          # Vite config with API proxy
│   └── src/
│       ├── main.jsx            # React entry point
│       ├── App.jsx             # Router configuration
│       ├── index.css           # Global design system
│       ├── api/                # Axios API layer
│       ├── store/              # Redux Toolkit (auth + contracts)
│       ├── components/         # 14 reusable components
│       └── pages/              # 9 application pages
└── db_dump/                    # MongoDB database dump
```

---

## 🗄 Database Design

### Why MongoDB?
- Contracts have **variable-length fields** (parties, versions) — fits the document model naturally
- Version history stored as **embedded sub-documents** — no JOINs needed
- Activity logs are append-only — easy to embed
- Schema flexibility for future contract extensions

### Collections

#### Users
| Field | Type | Description |
|-------|------|-------------|
| name | String | User's full name |
| email | String | Unique, indexed email |
| password | String | bcrypt hashed (select: false) |
| role | String | `admin` or `user` |

#### Contracts
| Field | Type | Description |
|-------|------|-------------|
| title | String | Contract title (text indexed) |
| description | String | Contract description |
| parties | [String] | Parties involved (text indexed) |
| startDate | Date | Contract start date |
| endDate | Date | Contract end date |
| status | String | Draft / Active / Executed / Expired |
| createdBy | ObjectId | Reference to User |
| isDeleted | Boolean | Soft delete flag |
| versions | [Object] | Embedded version snapshots |
| activityLog | [Object] | Embedded audit trail |

### Status Transition Rules
```
Draft → Active
Active → Executed, Expired
Executed → Expired
Expired → (none)
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v18 or higher
- **MongoDB** v7+ running locally (default port 27017)
- **npm** package manager

### 1. Clone the Repository
```bash
git clone https://github.com/tarunupadhayay/contract-management-dashboard.git
cd contract-management-dashboard
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file (or use the existing one):
```env
PORT=5001
MONGODB_URI=mongodb://127.0.0.1:27017/contract_management
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRY=7d
NODE_ENV=development
```

### 3. Seed the Database
```bash
npm run seed
```
This creates:
- **Admin user**: `admin@example.com` / `admin123`
- **Regular user**: `john@example.com` / `user123`
- **8 sample contracts** with different statuses

### 4. Start the Backend
```bash
npm run dev
```
Backend runs on **http://localhost:5001**

### 5. Frontend Setup (in a new terminal)
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on **http://localhost:5173**

### 6. Restore DB Dump (Alternative to Seeding)
```bash
mongorestore --db contract_management ./db_dump/contract_management
```

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/signup` | Public | Register new user |
| POST | `/api/auth/login` | Public | Login, returns JWT |
| GET | `/api/auth/me` | Auth | Get current user profile |

### Contracts
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/contracts` | Auth | List contracts (paginated, filtered) |
| GET | `/api/contracts/:id` | Auth | Get contract detail with versions |
| POST | `/api/contracts` | Auth | Create new contract |
| PUT | `/api/contracts/:id` | Auth | Update contract (creates version) |
| DELETE | `/api/contracts/:id` | Auth | Soft delete contract |
| GET | `/api/contracts/:id/versions` | Auth | Get version history |
| GET | `/api/contracts/:id/versions/:vId` | Auth | Get specific version |

### Users (Admin Only)
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/users` | Admin | List all users |
| PATCH | `/api/users/:id/role` | Admin | Update user role |

### Query Parameters (GET /api/contracts)
| Param | Type | Description |
|-------|------|-------------|
| `page` | Number | Page number (default: 1) |
| `limit` | Number | Items per page (default: 10, max: 100) |
| `search` | String | Search by title or party name |
| `status` | String | Filter: Draft, Active, Executed, Expired |
| `startDateFrom` | Date | Filter contracts starting after this date |
| `startDateTo` | Date | Filter contracts starting before this date |
| `sortBy` | String | createdAt, updatedAt, title, startDate, endDate |
| `sortOrder` | String | asc or desc |

---

## 🎨 Frontend Pages

| Page | Route | Description |
|------|-------|-------------|
| Login | `/login` | JWT login with animated glassmorphism UI |
| Signup | `/signup` | Registration with role selection |
| Dashboard | `/dashboard` | Stats cards, status distribution, recent contracts |
| Contract List | `/contracts` | Searchable, filterable, sortable table with pagination |
| Contract Detail | `/contracts/:id` | Tabbed view: Details, Activity Log, Version History |
| Create Contract | `/contracts/new` | Form with dynamic party fields |
| Edit Contract | `/contracts/:id/edit` | Form with status transition validation |
| Admin Users | `/admin/users` | Admin-only user/role management |
| 404 | `*` | Not found page |

---

## 🛡 Security & Error Handling

- **Helmet.js** for HTTP security headers
- **bcryptjs** (salt rounds: 12) for password hashing
- **JWT** with configurable expiry
- **Input validation** via express-validator on all endpoints
- **Global error handler** covering Mongoose, JWT, and generic errors
- **CORS** configured for frontend origins
- **Soft delete** — contracts are never permanently removed

---

## 👥 Default Users (After Seeding)

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@example.com | admin123 |
| User | john@example.com | user123 |

---

## 📝 License

This project is for assessment purposes.
