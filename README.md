# My Group React Project

A modern React frontend with Node.js backend implementation of the original My Group CodeIgniter application.

## Project Structure

```
my_group_react_project/
├── backend/                 # Node.js Express API
│   ├── config/             # Database configuration
│   ├── models/             # Sequelize models
│   ├── routes/             # API routes
│   ├── middleware/         # Authentication & other middleware
│   ├── controllers/        # Route controllers
│   ├── utils/              # Utility functions
│   └── uploads/            # File uploads directory
├── frontend/               # React TypeScript application
│   ├── src/
│   │   ├── components/     # Reusable React components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API service layer
│   │   ├── contexts/       # React contexts
│   │   ├── hooks/          # Custom React hooks
│   │   ├── types/          # TypeScript type definitions
│   │   └── utils/          # Utility functions
│   └── public/             # Static assets
└── docs/                   # Documentation
    └── database_schema.md  # Database schema documentation
```

## Technology Stack

### Backend
- **Node.js** with **Express.js** - Web framework
- **MySQL** - Database (same as original)
- **Sequelize** - ORM for database operations
- **JWT** - Authentication (replacing Ion Auth)
- **bcryptjs** - Password hashing
- **multer** - File upload handling
- **helmet** - Security middleware
- **cors** - Cross-origin resource sharing

### Frontend
- **React 19** with **TypeScript** - UI framework
- **Material-UI (MUI)** - Component library
- **React Router** - Client-side routing
- **React Query (TanStack Query)** - Data fetching and caching
- **React Hook Form** - Form handling
- **Yup** - Form validation
- **Axios** - HTTP client

## Database

The application uses the existing MySQL database `my_group` with the same schema as the original CodeIgniter application. See `docs/database_schema.md` for detailed schema documentation.

### Key Tables
- `users` - User authentication and basic info
- `user_registration_form` - Extended user profile data
- `group_create` - Group management
- `country_tbl`, `state_tbl`, `district_tbl` - Geographic data
- `labor_profile` - Labor management
- `needy_client_services_details` - Needy services

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MySQL database
- Existing `my_group` database with data

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   ```bash
   cp .env.example .env
   ```
   Update the `.env` file with your database credentials:
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=admin
   DB_NAME=my_group
   JWT_SECRET=your_jwt_secret_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

The backend API will be available at `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```

3. Configure environment variables:
   ```bash
   cp .env.example .env
   ```
   Update the `.env` file:
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   ```

4. Start the development server:
   ```bash
   npm start
   ```

The frontend application will be available at `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `PUT /api/users/change-password` - Change password
- `GET /api/users` - Get all users (Admin)

### Geographic Data
- `GET /api/geographic/continents` - Get continents
- `GET /api/geographic/countries` - Get countries
- `GET /api/geographic/states` - Get states by country
- `GET /api/geographic/districts` - Get districts by state

### Groups
- `GET /api/groups` - Get all groups
- `GET /api/groups/:id` - Get group by ID
- `POST /api/groups` - Create new group (Admin)

## Features Implemented

### ✅ Completed
- [x] Project structure setup
- [x] Database schema analysis and documentation
- [x] Node.js backend with Express.js
- [x] MySQL database connection with Sequelize
- [x] JWT-based authentication system
- [x] React frontend with TypeScript
- [x] Material-UI component library
- [x] Basic routing and navigation
- [x] Authentication context and protected routes
- [x] API service layer
- [x] Basic dashboard layout

### 🚧 In Progress
- [ ] Complete authentication system implementation
- [ ] User registration form
- [ ] User profile management
- [ ] Group management interface
- [ ] Labor profile management
- [ ] Needy services management
- [ ] File upload functionality
- [ ] Admin dashboard

### 📋 Planned
- [ ] Media management (MyTV)
- [ ] Union management
- [ ] Advertising system
- [ ] Feedback system
- [ ] Advanced search and filtering
- [ ] Data export functionality
- [ ] Email notifications
- [ ] Mobile responsiveness optimization

## Development Guidelines

### Code Style
- Use TypeScript for type safety
- Follow React functional components with hooks
- Use Material-UI components consistently
- Implement proper error handling
- Add loading states for async operations

### Security
- JWT tokens for authentication
- Input validation on both frontend and backend
- SQL injection prevention with Sequelize
- XSS protection with helmet
- CORS configuration

### Testing
- Unit tests for utility functions
- Integration tests for API endpoints
- Component tests for React components
- End-to-end tests for critical user flows

## Contributing

1. Create a feature branch from main
2. Implement your changes
3. Add tests for new functionality
4. Update documentation as needed
5. Submit a pull request

## License

This project is licensed under the ISC License.
# My Group Project

This repository contains both the original CodeIgniter application and the new React/Node.js implementation.

## Project Structure

- **Original CodeIgniter Application**: Root directory (legacy)
- **New React/Node.js Application**: `MyGroupReact/` directory

## Getting Started with MyGroupReact

The modern React frontend with Node.js backend is located in the `MyGroupReact` folder.

### Quick Start

1. Click the **Run** button to install dependencies for both backend and frontend
2. Use the "Start Full Stack" workflow to run both backend and frontend simultaneously
3. Or run them separately:
   - Use "Start Backend" workflow for the API server (port 5000)
   - Use "Start Frontend" workflow for the React app (port 3000)

### Project Details

See `MyGroupReact/README.md` for detailed documentation about the React/Node.js implementation.

### Technology Stack

- **Backend**: Node.js, Express.js, MySQL, Sequelize ORM, JWT Authentication
- **Frontend**: React 19, TypeScript, Material-UI, React Router, React Query

### Database

Uses the existing MySQL `my_group` database with the same schema as the original CodeIgniter application.
