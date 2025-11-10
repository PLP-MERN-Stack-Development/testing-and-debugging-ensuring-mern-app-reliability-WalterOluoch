# Bug Tracker - MERN Application with Testing and Debugging

A comprehensive Bug Tracker application built with the MERN stack (MongoDB, Express, React, Node.js) featuring extensive testing and debugging capabilities.

## 📋 Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Testing](#testing)
- [Debugging](#debugging)
- [API Documentation](#api-documentation)
- [Error Handling](#error-handling)
- [Testing Strategy](#testing-strategy)
- [Coverage Reports](#coverage-reports)

## 🚀 Features

- **Bug Management:**
  - Create new bugs with title, description, status, priority, and reporter
  - View list of all bugs
  - Update bug statuses (open, in-progress, resolved)
  - Delete bugs
  - Filter and sort bugs

- **Testing:**
  - Unit tests for backend validation functions
  - Integration tests for API endpoints
  - Unit tests for React components
  - Integration tests for API calls and UI updates
  - Comprehensive test coverage (70%+)

- **Debugging:**
  - Console logging for request/response tracking
  - Chrome DevTools integration
  - Node.js inspector support
  - Error boundaries for React components
  - Detailed error messages and stack traces

- **Error Handling:**
  - Express error handling middleware
  - React error boundaries
  - Client-side error handling
  - Validation error messages

## 📁 Project Structure

```
mern-bug-tracker/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── BugTracker.js
│   │   │   ├── BugForm.js
│   │   │   ├── BugList.js
│   │   │   ├── BugItem.js
│   │   │   └── ErrorBoundary.js
│   │   ├── services/       # API services
│   │   │   └── bugService.js
│   │   ├── tests/          # Test files
│   │   │   ├── unit/       # Unit tests
│   │   │   └── integration/ # Integration tests
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── server/                 # Express backend
│   ├── src/
│   │   ├── models/         # Mongoose models
│   │   │   └── Bug.js
│   │   ├── controllers/    # Route controllers
│   │   │   └── bugController.js
│   │   ├── routes/         # API routes
│   │   │   └── bugRoutes.js
│   │   ├── middleware/     # Custom middleware
│   │   │   └── bugValidator.js
│   │   └── utils/          # Utility functions
│   │       └── debugUtils.js
│   ├── tests/              # Test files
│   │   ├── unit/           # Unit tests
│   │   └── integration/    # Integration tests
│   ├── server.js
│   └── package.json
├── jest.config.js          # Jest configuration
└── README.md
```

## 📦 Prerequisites

- **Node.js** (v18 or higher)
- **MongoDB** (local installation or MongoDB Atlas account)
- **npm** or **yarn**

## 🔧 Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd testing-and-debugging-ensuring-mern-app-reliability-WalterOluoch
   ```

2. **Install dependencies:**
   ```bash
   # Install all dependencies (root, server, and client)
   npm run install-all
   
   # Or install separately:
   cd server && npm install
   cd ../client && npm install
   ```

3. **Set up environment variables:**
   
   Create a `.env` file in the `server` directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/bug-tracker
   NODE_ENV=development
   ```

4. **Start MongoDB:**
   
   Make sure MongoDB is running on your system:
   ```bash
   # On macOS with Homebrew
   brew services start mongodb-community
   
   # On Linux
   sudo systemctl start mongod
   
   # On Windows
   net start MongoDB
   ```

## 🏃 Running the Application

### Development Mode

Run both server and client concurrently:

```bash
npm run dev
```

Or run them separately:

```bash
# Terminal 1 - Start server
npm run server

# Terminal 2 - Start client
npm run client
```

The application will be available at:
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run only unit tests
npm run test:unit

# Run only integration tests
npm run test:integration

# Run server tests only
npm run test:server

# Run client tests only
npm run test:client
```

### Test Coverage

The project aims for at least 70% code coverage. View coverage reports:

```bash
# Generate coverage report
npm run test:coverage

# Coverage reports are generated in:
# - server/coverage/
# - client/coverage/
```

### Test Structure

#### Backend Tests

- **Unit Tests:** `server/tests/unit/`
  - `bugValidator.test.js` - Validation function tests

- **Integration Tests:** `server/tests/integration/`
  - `bugs.test.js` - API endpoint tests

#### Frontend Tests

- **Unit Tests:** `client/src/tests/unit/`
  - `BugForm.test.js` - Form component tests
  - `BugItem.test.js` - Bug item component tests
  - `BugList.test.js` - Bug list component tests
  - `ErrorBoundary.test.js` - Error boundary tests

- **Integration Tests:** `client/src/tests/integration/`
  - `BugTracker.test.js` - Full component integration tests
  - `bugService.test.js` - API service tests

## 🐛 Debugging

### Console Logging

The application includes comprehensive console logging:

- **Backend:** Request/response logging in `server/server.js`
- **Frontend:** API call logging in `client/src/services/bugService.js`
- **Components:** State change logging in React components

### Chrome DevTools

1. Open Chrome DevTools (F12)
2. Use the **Network** tab to inspect API requests
3. Use the **Console** tab to view logs
4. Use the **Components** tab (with React DevTools) to inspect component state

### Node.js Inspector

Start the server with inspector:

```bash
node --inspect server/server.js
```

Then open Chrome and navigate to `chrome://inspect` to connect.

### VS Code Debugger

Create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Server",
      "program": "${workspaceFolder}/server/server.js"
    }
  ]
}
```

Press F5 to start debugging.

### Error Boundaries

The application includes an Error Boundary component that catches React errors and displays a user-friendly error message. See `client/src/components/ErrorBoundary.js`.

For detailed debugging instructions, see [DEBUGGING_GUIDE.md](./DEBUGGING_GUIDE.md).

## 📡 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Endpoints

#### GET /api/bugs
Get all bugs.

**Response:**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "123",
      "title": "Bug Title",
      "description": "Bug Description",
      "status": "open",
      "priority": "medium",
      "reporter": "John Doe",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### GET /api/bugs/:id
Get a single bug by ID.

#### POST /api/bugs
Create a new bug.

**Request Body:**
```json
{
  "title": "Bug Title",
  "description": "Bug Description",
  "status": "open",
  "priority": "medium",
  "reporter": "John Doe"
}
```

#### PUT /api/bugs/:id
Update a bug.

**Request Body:**
```json
{
  "status": "resolved",
  "priority": "high"
}
```

#### DELETE /api/bugs/:id
Delete a bug.

## ⚠️ Error Handling

### Backend Error Handling

- Express error handling middleware in `server/server.js`
- Validation errors return 400 status
- Not found errors return 404 status
- Server errors return 500 status

### Frontend Error Handling

- Error boundaries catch React component errors
- API errors are displayed to users
- Form validation errors are shown inline

## 📊 Testing Strategy

### Backend Testing

1. **Unit Tests:**
   - Test validation functions in isolation
   - Mock dependencies
   - Test edge cases

2. **Integration Tests:**
   - Test API endpoints with Supertest
   - Use MongoDB Memory Server for testing
   - Test database operations

### Frontend Testing

1. **Unit Tests:**
   - Test components in isolation
   - Mock API calls
   - Test user interactions

2. **Integration Tests:**
   - Test component interactions
   - Test API integration
   - Test full user flows

### Test Coverage Goals

- **Statements:** 70%+
- **Branches:** 60%+
- **Functions:** 70%+
- **Lines:** 70%+

## 📈 Coverage Reports

After running tests with coverage, view reports:

- **HTML Reports:** Open `coverage/lcov-report/index.html` in a browser
- **Terminal Reports:** Coverage summary displayed in terminal
- **LCOV Reports:** Generated in `coverage/lcov.info`

## 🛠️ Technologies Used

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **Jest** - Testing framework
- **Supertest** - API testing
- **MongoDB Memory Server** - In-memory MongoDB for testing

### Frontend
- **React** - UI library
- **Axios** - HTTP client
- **React Testing Library** - Component testing
- **Jest** - Testing framework

## 📝 License

This project is licensed under the ISC License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write tests for your changes
5. Ensure all tests pass
6. Submit a pull request

## 📞 Support

For issues and questions, please open an issue on GitHub.

## 🎯 Future Enhancements

- [ ] User authentication
- [ ] Bug assignments
- [ ] Comments on bugs
- [ ] File attachments
- [ ] Email notifications
- [ ] Advanced filtering and sorting
- [ ] Dashboard with statistics
- [ ] Export functionality