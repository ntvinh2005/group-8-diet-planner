# BudgetBits - Smart Diet Planner

A full-stack web application for intelligent meal planning and budget management. BudgetBits helps users plan their meals while tracking nutrition and staying within their weekly budget.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Technical Details](#technical-details)
- [Installation Instructions](#installation-instructions)
- [Login & Access Credentials](#login--access-credentials)
- [API Keys & Environment Variables](#api-keys--environment-variables)
- [Project Structure](#project-structure)
- [Features](#features)
- [API Endpoints](#api-endpoints)
- [Development](#development)

---

## Project Overview

BudgetBits is a diet planning application built with modern web technologies. It allows users to:
- Create and manage recipes
- Build ingredient databases with nutritional information
- Maintain a personal pantry with inventory tracking
- Plan meals while tracking calories and allergens
- Manage weekly food budgets
- Upgrade to Creator role to share recipes with the community

### User Roles

1. **Follower** (Default) - Can view recipes, manage personal pantry, and plan meals
2. **Creator** - Can create and share recipes with the community
3. **Admin** - Full system access for user and content management

---

## Technical Details

### Technology Stack

#### Backend
- **Runtime**: Node.js with ES Modules
- **Framework**: Express.js 5.1.0
- **Database**: MongoDB 8.18.1 with Mongoose ODM
- **Authentication**: JWT (jsonwebtoken 9.0.2)
- **Security**: bcryptjs for password hashing
- **Development**: Nodemon for hot-reload
- **Server**: Node with Express server listening on port 5000

#### Frontend
- **Framework**: React 19.1.1 with TypeScript
- **Build Tool**: Vite 7.1.2
- **Routing**: React Router v7.9.4
- **State Management**: Zustand 5.0.8
- **Data Fetching**: React Query (@tanstack/react-query) 5.90.5
- **HTTP Client**: Axios 1.12.2
- **Styling**: Tailwind CSS v4.1.15 with PostCSS
- **UI Components**: Radix UI, shadcn/ui, Lucide Icons, Ant Design
- **Server**: Vite dev server on port 5174

### Architecture Overview

```
BudgetBits (Full Stack)
├── Backend (Node.js + Express + MongoDB)
│   ├── Models: User, Recipe, Ingredient
│   ├── Controllers: User, Recipe, Ingredient operations
│   ├── Middleware: Authentication, Authorization
│   └── Routes: REST API endpoints
│
└── Frontend (React + TypeScript + Vite)
    ├── Pages: Dashboard, Recipes, Ingredients, Pantry, Profile, Admin
    ├── Components: Reusable UI components
    ├── Hooks: Custom React Query hooks
    ├── Store: Zustand authentication store
    └── Services: Axios API client with JWT interceptor
```

### Database Schema

#### User Model
```
{
  userId: UUID (v4) - Unique identifier
  email: String - Unique, required
  username: String - Unique, required, 3-32 chars
  password: String - Hashed with bcryptjs
  accountType: Enum ["Follower", "Creator", "Admin"]
  healthConditions: Map of condition types
  weeklyBudgetCents: Number - Budget in cents
  pantry: Array of PantryItems
  createdAt: Timestamp
  updatedAt: Timestamp
}

PantryItem {
  sourceId: ObjectId (ref: Ingredient)
  name: String
  calories: Number
  allergenType: Array of allergens
  sourceVersion: Number
  count: Number - Quantity in pantry
}
```

#### Recipe Model
```
{
  name: String - Required
  shortDesciption: String - Optional
  longDesciption: String - Optional
  numberOfStars: Number (0-5) - Rating
  image: String - Optional
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

#### Ingredient Model
```
{
  name: String - Required
  calories: Number - Required, min 0
  allergenType: Array of ["Milk", "Eggs", "Nuts", "Sesame", "Wheat", "Soy"]
}
```

---

## Installation Instructions

### Prerequisites

- **Node.js**: v16 or higher
- **npm**: v7 or higher
- **MongoDB**: Cluster with connection URI (MongoDB Atlas recommended)
- **Git**: For version control

### Step 1: Clone the Repository

```bash
git clone https://github.com/ntvinh2005/group-8-diet-planner.git
cd group-8-diet-planner
```

### Step 2: Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create `.env` file** in the backend root directory
   ```bash
   cp .env.example .env  # if available, or create manually
   ```

4. **Configure environment variables** (see [API Keys & Environment Variables](#api-keys--environment-variables) section)

5. **Start the backend server**
   ```bash
   npm run dev
   ```
   - Server will start on `http://localhost:5000`
   - You should see: `"Listening On Port http://localhost:5000"`
   - MongoDB connection will be established: `"MongoDB Connected"`

### Step 3: Frontend Setup

1. **Open a new terminal and navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the frontend development server**
   ```bash
   npm run dev
   ```
   - Vite server will start on `http://localhost:5174`
   - The app will automatically proxy API calls to the backend

4. **Open in browser**
   - Navigate to `http://localhost:5174`

### Step 4: Verify Installation

1. Check backend terminal for:
   - ✅ `MongoDB Connected`
   - ✅ `Listening On Port http://localhost:5000`

2. Check frontend terminal for:
   - ✅ `VITE v7.1.11 ready in X ms`
   - ✅ Port 5174 availability

3. Test the app:
   - Go to `http://localhost:5174`
   - You should see the login page
   - Try creating a new account

---

## Login & Access Credentials

### Creating Your First Account

1. Navigate to `http://localhost:5174`
2. Click "Sign Up" or "Register"
3. Fill in the registration form:
   - **Email**: Any valid email format
   - **Username**: 3-32 characters (alphanumeric)
   - **Password**: Any password (will be hashed with bcryptjs)
   - **Account Type**: Defaults to "Follower"

4. Click "Register" to create account
5. You'll receive a JWT token valid for 7 days
6. The token is automatically stored in browser localStorage

### Demo Account (if created by admin)

For development/testing, you may create test accounts with specific roles:

**Test Follower Account:**
- Email: `follower@test.com`
- Username: `testfollower`
- Password: `password123`
- Role: Follower

**Test Creator Account:**
- Email: `creator@test.com`
- Username: `testcreator`
- Password: `password123`
- Role: Creator (can create recipes)

**Test Admin Account:**
- Email: `admin@test.com`
- Username: `testadmin`
- Password: `password123`
- Role: Admin (can access admin panel)

### Account Types & Permissions

| Feature | Follower | Creator | Admin |
|---------|----------|---------|-------|
| View Recipes | ✅ | ✅ | ✅ |
| Create Recipes | ❌ | ✅ | ✅ |
| Edit Own Recipes | ❌ | ✅ | ✅ |
| Delete Own Recipes | ❌ | ✅ | ✅ |
| Manage Pantry | ✅ | ✅ | ✅ |
| Manage Ingredients | ✅ | ✅ | ✅ |
| Upgrade to Creator | ✅ | ❌ | ❌ |
| Admin Panel | ❌ | ❌ | ✅ |

### Session Management

- **Token Expiration**: 7 days from creation
- **Token Storage**: Browser localStorage (key: `authState`)
- **Auto-logout**: Upon token expiration
- **Manual Logout**: Available in dashboard navigation

---

## API Keys & Environment Variables

### Backend Environment Variables

Create a `.env` file in the backend root directory with the following variables:

```env
# Server Configuration
PORT=5000

# MongoDB Connection
MONGODB_URI=mongodb+srv://<USERNAME>:<PASSWORD>@<CLUSTER>.mongodb.net/?retryWrites=true&w=majority&appName=<APP_NAME>

# JWT Secret Key (keep this secure!)
JWT_SECRET_TOKEN=<YOUR_64_CHARACTER_HEX_STRING>

# CORS Configuration (Optional)
FRONTEND_ORIGINS=http://localhost:5173,http://localhost:5174,http://localhost:5175,http://localhost:5176
```

### MongoDB Connection Setup

1. **Create MongoDB Atlas Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up for free account
   - Create a new project

2. **Create a Cluster**
   - Select "Build a Cluster"
   - Choose free tier (M0)
   - Select region closest to you
   - Create cluster

3. **Generate Connection String**
   - Go to "Connect" button on cluster
   - Choose "Connect Your Application"
   - Select Node.js driver
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `<cluster>` with your actual cluster name

**Example MONGODB_URI:**
```
mongodb+srv://admin:MySecurePassword123@mybudgetbitsdb.abcdef.mongodb.net/?retryWrites=true&w=majority&appName=BudgetBits
```

### JWT Secret Token

The JWT_SECRET_TOKEN is a cryptographic key used for signing authentication tokens.

**Generating a New Secret (if needed):**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Current Secret (Development Only):**
```
da8ea3e04582ab3a4eefecfe45d6786d3db310cf6bba05f1e3270e79ee3369c14c16442dbcc72e2597855ed27cdf99c9c14920f82ffa8193cdb13e462a328727
```

**WARNING**: Never commit `.env` files to version control. The `.env` file is listed in `.gitignore`.

### CORS Configuration

The backend accepts requests from specific origins to prevent unauthorized access:

**Default Allowed Origins (Development):**
- `http://localhost:5173`
- `http://localhost:5174`
- `http://localhost:5175`
- `http://localhost:5176`

**To Add Production Domain:**
Update `.env`:
```env
FRONTEND_ORIGINS=https://yourdomain.com,https://www.yourdomain.com,http://localhost:5174
```

### Frontend Environment Variables

The frontend does **NOT** require a `.env` file. API calls are configured in:
- `frontend/vite.config.ts` - Proxy to backend
- `frontend/src/lib/axios.ts` - Axios instance with JWT interceptor

The frontend automatically:
- Connects to `http://localhost:5000` (backend)
- Retrieves JWT from `authState` in localStorage
- Attaches JWT to all API requests via Bearer token

---

## Project Structure

```
group-8-diet-planner/
├── backend/
│   ├── src/
│   │   ├── server.js                 # Express server setup
│   │   ├── controllers/
│   │   │   ├── user.controller.js    # Auth, profile, account management
│   │   │   ├── recipe.controller.js  # Recipe CRUD operations
│   │   │   └── ingredient.controller.js # Ingredient management
│   │   ├── models/
│   │   │   ├── user.model.js         # User schema
│   │   │   ├── recipe.model.js       # Recipe schema
│   │   │   └── ingredient.model.js   # Ingredient schema
│   │   ├── middleware/
│   │   │   ├── auth.middleware.js    # JWT verification
│   │   │   └── authRecipePerms.middleware.js # Recipe authorization
│   │   ├── routes/
│   │   │   ├── user.route.js         # User endpoints
│   │   │   ├── recipe.route.js       # Recipe endpoints
│   │   │   └── ingredient.route.js   # Ingredient endpoints
│   │   └── utils/
│   │       ├── dbConnect.js          # MongoDB connection
│   │       └── healthConditions.js   # Health condition constants
│   ├── .env                          # Environment variables (not in git)
│   ├── .gitignore
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── main.tsx                  # React entry point
│   │   ├── App.tsx                   # Main app component
│   │   ├── index.css                 # Global styles
│   │   ├── pages/
│   │   │   ├── LoginPage.tsx         # Authentication
│   │   │   ├── RegisterPage.tsx      # Account creation
│   │   │   ├── DashboardPage.tsx     # Main dashboard
│   │   │   ├── RecipesPage.tsx       # Recipe browsing/management
│   │   │   ├── IngredientsPage.tsx   # Ingredient management
│   │   │   ├── PantryPage.tsx        # Pantry inventory
│   │   │   ├── ProfilePage.tsx       # User profile
│   │   │   ├── AdminPage.tsx         # Admin controls
│   │   │   └── LogoutPage.tsx        # Session termination
│   │   ├── components/
│   │   │   ├── Logo.tsx              # App logo component
│   │   │   ├── RecipeCard.tsx        # Recipe display
│   │   │   ├── IngredientCard.tsx    # Ingredient display
│   │   │   ├── PantryCard.tsx        # Pantry item display
│   │   │   └── ui/                   # Shadcn UI components
│   │   ├── hooks/
│   │   │   └── useAPI.ts             # React Query hooks
│   │   ├── context/
│   │   │   └── AuthContext.tsx       # Auth provider
│   │   ├── lib/
│   │   │   ├── api.ts                # API interface definitions
│   │   │   ├── axios.ts              # Axios configuration
│   │   │   └── queryClient.ts        # React Query client
│   │   ├── store/
│   │   │   └── authStore.ts          # Zustand auth store
│   │   └── routes/
│   │       └── Router.tsx            # Route definitions
│   ├── public/
│   │   └── budgetbits.svg            # App logo
│   ├── vite.config.ts                # Vite configuration
│   ├── tailwind.config.js            # Tailwind CSS config
│   ├── tsconfig.json                 # TypeScript config
│   ├── eslint.config.js              # ESLint rules
│   └── package.json
│
├── .gitignore                        # Git ignore rules
└── README.md                         # This file
```

---

## Features

### User Management
- ✅ User registration and login
- ✅ Email and username validation
- ✅ Password hashing with bcryptjs
- ✅ JWT-based authentication (7-day expiration)
- ✅ Role-based access control (Follower/Creator/Admin)
- ✅ Account upgrade from Follower to Creator
- ✅ User profile management

### Recipe Management (Creator+)
- ✅ Create recipes with name, descriptions, images, ratings
- ✅ Search recipes by name or description
- ✅ View recipe details
- ✅ Rate recipes (0-5 stars)
- ✅ Edit own recipes
- ✅ Delete own recipes

### Ingredient Management
- ✅ Create custom ingredients with calorie data
- ✅ Allergen type tracking (Milk, Eggs, Nuts, Sesame, Wheat, Soy)
- ✅ Search ingredients
- ✅ Update ingredient details
- ✅ Delete ingredients

### Pantry Management
- ✅ Add ingredients to personal pantry
- ✅ Track inventory count for each ingredient
- ✅ Calculate total calories
- ✅ View allergen information
- ✅ Update item quantities
- ✅ Remove items from pantry
- ✅ Search pantry items

### Health & Budget Tracking
- ✅ Track health conditions (Diabetes, Hypertension, Celiac, Vegetarian, Vegan)
- ✅ Set weekly food budget
- ✅ Display budget spending

### Admin Features
- ✅ Admin dashboard
- ✅ User management
- ✅ Content moderation

---

## API Endpoints

### Authentication Routes
```
POST /api/users/register        - Create new account
POST /api/users/login           - Login with email/password
POST /api/users/logout          - Logout (clears token)
```

### User Routes (Protected)
```
GET  /api/users/profile/:username        - Get user profile
PUT  /api/users/:userId                  - Update user profile
PATCH /api/users/upgrade-to-creator      - Upgrade to Creator role
PATCH /api/users/downgrade-to-follower   - Downgrade to Follower
DELETE /api/users/delete                 - Delete account

POST /api/users/:userId/pantry                      - Add item to pantry
PUT  /api/users/:userId/pantry/:ingredientId       - Update pantry item
PATCH /api/users/:userId/pantry/:ingredientId      - Modify pantry item
DELETE /api/users/:userId/pantry/:ingredientId     - Remove from pantry
```

### Recipe Routes
```
GET  /api/recipes                - List all recipes
GET  /api/recipes/search/query   - Search recipes (query parameter: q)
GET  /api/recipes/:recipeId      - Get recipe details
POST /api/recipes/create         - Create recipe (Creator+)
PUT  /api/recipes/:recipeId      - Update recipe (Creator+)
DELETE /api/recipes/:recipeId    - Delete recipe (Creator+)
PATCH /api/recipes/:recipeId/numStars - Rate recipe
```

### Ingredient Routes
```
GET  /api/ingredients                 - List all ingredients
GET  /api/ingredients/search/query    - Search ingredients (query parameter: q)
GET  /api/ingredients/:ingredientId   - Get ingredient details
POST /api/ingredients/create          - Create ingredient
PUT  /api/ingredients/:ingredientId   - Update ingredient
DELETE /api/ingredients/:ingredientId - Delete ingredient
```

### Response Format
All endpoints return JSON. Protected endpoints require JWT Bearer token in Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## Development

### Running Both Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
# Starts on http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
# Starts on http://localhost:5174
```

### Building for Production

**Frontend:**
```bash
cd frontend
npm run build
# Outputs to dist/ directory
npm run preview
# Preview production build
```

**Backend:**
- Update `.env` with production MongoDB URI
- Update CORS origins for production domain
- Deploy to hosting service (Heroku, Render, AWS, etc.)

### Debugging

**Backend Debug Logs:**
- Check terminal output for error messages
- MongoDB connection issues appear on startup
- API errors logged to console

**Frontend Debug:**
- Open browser DevTools (F12)
- Check Console tab for errors
- Check Network tab for API calls
- React DevTools extension recommended

### Common Issues

**MongoDB Connection Error**
- Verify `MONGODB_URI` in `.env`
- Check MongoDB Atlas whitelist IP address
- Ensure database user has correct permissions

**CORS Error**
- Verify frontend origin in backend `FRONTEND_ORIGINS`
- Restart backend server after changing `.env`

**JWT Token Issues**
- Clear browser localStorage: `localStorage.clear()`
- Login again to get new token
- Check token expiration (7 days)

**Port Already in Use**
- Change PORT in `.env` (backend) or `vite.config.ts` (frontend)
- Or kill process using the port

---

## Contributing

1. Create a feature branch: `git checkout -b feature/amazing-feature`
2. Commit changes: `git commit -m 'Add amazing feature'`
3. Push to branch: `git push origin feature/amazing-feature`
4. Open a Pull Request

---

## Contact & Support

- **Repository**: [group-8-diet-planner](https://github.com/ntvinh2005/group-8-diet-planner)
- **University**: University of Florida - CEN3013

---

**Last Updated**: December 2, 2025
**Version**: 1.0.0
