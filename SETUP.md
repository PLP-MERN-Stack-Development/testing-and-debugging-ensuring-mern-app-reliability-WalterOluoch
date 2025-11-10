# Setup Guide for Bug Tracker Application

## Quick Start

1. **Install Dependencies:**
   ```bash
   npm run install-all
   ```

2. **Set up Environment:**
   - Copy `server/.env.example` to `server/.env`
   - Update MongoDB URI if needed

3. **Start MongoDB:**
   - Make sure MongoDB is running locally or update the connection string

4. **Run the Application:**
   ```bash
   npm run dev
   ```

## Detailed Setup

### Backend Setup

1. Navigate to server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/bug-tracker
   NODE_ENV=development
   ```

4. Start the server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to client directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the client:
   ```bash
   npm start
   ```

### Testing Setup

1. **Run all tests:**
   ```bash
   npm test
   ```

2. **Run tests with coverage:**
   ```bash
   npm run test:coverage
   ```

3. **Run server tests only:**
   ```bash
   npm run test:server
   ```

4. **Run client tests only:**
   ```bash
   cd client
   npm test
   ```

## Troubleshooting

### MongoDB Connection Issues

- Ensure MongoDB is running
- Check the connection string in `.env`
- Verify MongoDB is accessible on the specified port

### Port Already in Use

- Change the PORT in `server/.env`
- Or kill the process using the port:
  ```bash
  # On macOS/Linux
  lsof -ti:5000 | xargs kill
  
  # On Windows
  netstat -ano | findstr :5000
  taskkill /PID <PID> /F
  ```

### Dependency Issues

- Delete `node_modules` and `package-lock.json`
- Run `npm install` again
- Clear npm cache: `npm cache clean --force`

### Test Issues

- Ensure all dependencies are installed
- Check that MongoDB Memory Server can start (for integration tests)
- Verify Jest configuration is correct
