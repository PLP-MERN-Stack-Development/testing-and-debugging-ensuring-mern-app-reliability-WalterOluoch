# Quick Start Guide

## Installation

```bash
# Install all dependencies
npm run install-all
```

## Configuration

1. Create `server/.env` file:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/bug-tracker
   NODE_ENV=development
   ```

2. Start MongoDB (if running locally)

## Running the Application

```bash
# Start both server and client
npm run dev
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run only unit tests
npm run test:unit

# Run only integration tests
npm run test:integration
```

## Testing the API

### Create a Bug
```bash
curl -X POST http://localhost:5000/api/bugs \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Bug",
    "description": "This is a test bug",
    "status": "open",
    "priority": "high"
  }'
```

### Get All Bugs
```bash
curl http://localhost:5000/api/bugs
```

### Update a Bug
```bash
curl -X PUT http://localhost:5000/api/bugs/<bug-id> \
  -H "Content-Type: application/json" \
  -d '{
    "status": "resolved"
  }'
```

### Delete a Bug
```bash
curl -X DELETE http://localhost:5000/api/bugs/<bug-id>
```

## Debugging

See [DEBUGGING_GUIDE.md](./DEBUGGING_GUIDE.md) for detailed debugging instructions.

## Documentation

- [README.md](./README.md) - Full documentation
- [SETUP.md](./SETUP.md) - Detailed setup instructions
- [DEBUGGING_GUIDE.md](./DEBUGGING_GUIDE.md) - Debugging guide
