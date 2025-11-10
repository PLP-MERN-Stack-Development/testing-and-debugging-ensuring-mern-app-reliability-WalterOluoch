# Debugging Guide for Bug Tracker Application

This guide covers debugging techniques and tools used in the Bug Tracker application.

## Table of Contents
1. [Console Logging](#console-logging)
2. [Chrome DevTools](#chrome-devtools)
3. [Node.js Inspector](#nodejs-inspector)
4. [Error Boundaries](#error-boundaries)
5. [Network Request Debugging](#network-request-debugging)
6. [Common Debugging Scenarios](#common-debugging-scenarios)

## Console Logging

### Backend Console Logging

The server includes comprehensive logging for debugging:

```javascript
// Request logging middleware in server.js
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  console.log('Request body:', req.body);
  next();
});
```

**Locations:**
- `server/server.js` - Request/response logging
- `server/src/controllers/bugController.js` - Controller action logging
- Error handling middleware logs errors with stack traces

### Frontend Console Logging

The frontend uses console logs for debugging:

```javascript
// In BugTracker.js
console.log('Fetching bugs...');
console.log('Bugs fetched:', response.data);
```

**Locations:**
- `client/src/components/BugTracker.js` - Component state logging
- `client/src/services/bugService.js` - API request/response logging
- Axios interceptors log all API calls

## Chrome DevTools

### Inspecting Network Requests

1. Open Chrome DevTools (F12 or Right-click → Inspect)
2. Go to the **Network** tab
3. Filter by XHR/Fetch to see API calls
4. Click on a request to see:
   - Request headers and body
   - Response headers and body
   - Timing information

### Debugging React Components

1. Install React DevTools browser extension
2. Open DevTools and go to the **Components** tab
3. Select a component to inspect:
   - Props
   - State
   - Hooks

### Using Breakpoints

1. Open DevTools → **Sources** tab
2. Navigate to your source files
3. Click on line numbers to set breakpoints
4. Interact with the app to trigger breakpoints
5. Use the debugger controls:
   - Step over (F10)
   - Step into (F11)
   - Step out (Shift+F11)
   - Resume (F8)

### Example: Debugging Form Submission

```javascript
// Set breakpoint in BugForm.js handleSubmit
const handleSubmit = async (e) => {
  e.preventDefault();
  debugger; // Breakpoint here
  if (!validateForm()) {
    return;
  }
  // ...
};
```

## Node.js Inspector

### Starting Server with Inspector

```bash
# Start server with inspector
node --inspect server/server.js

# Or with nodemon
nodemon --inspect server/server.js
```

### Connecting to Inspector

1. Open Chrome and navigate to `chrome://inspect`
2. Click "Open dedicated DevTools for Node"
3. Set breakpoints in your server code
4. Make API requests to trigger breakpoints

### Using VS Code Debugger

Create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Server",
      "program": "${workspaceFolder}/server/server.js",
      "env": {
        "NODE_ENV": "development"
      },
      "console": "integratedTerminal"
    }
  ]
}
```

Press F5 to start debugging.

## Error Boundaries

The application includes an Error Boundary component that catches React errors:

**Location:** `client/src/components/ErrorBoundary.js`

### How it Works

```javascript
componentDidCatch(error, errorInfo) {
  console.error('ErrorBoundary caught an error:', error);
  console.error('Error info:', errorInfo);
  this.setState({
    error: error,
    errorInfo: errorInfo
  });
}
```

### Testing Error Boundaries

Create a component that throws an error:

```javascript
const ThrowError = () => {
  throw new Error('Test error');
  return <div>This won't render</div>;
};
```

Wrap it in ErrorBoundary to see the error UI.

## Network Request Debugging

### Axios Interceptors

The bug service uses interceptors to log all requests and responses:

```javascript
// Request interceptor
api.interceptors.request.use((config) => {
  console.log(`[API Request] ${config.method.toUpperCase()} ${config.url}`);
  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`[API Response] ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('[API Response Error]', error);
    return Promise.reject(error);
  }
);
```

### Using Chrome DevTools Network Tab

1. Filter by method (GET, POST, PUT, DELETE)
2. Check request payload
3. Inspect response data
4. Check status codes
5. Look for CORS errors

## Common Debugging Scenarios

### Scenario 1: Bug Not Creating

**Symptoms:** Form submission doesn't create a bug

**Debugging Steps:**
1. Check browser console for errors
2. Check Network tab for API request
3. Verify request payload in Network tab
4. Check server logs for errors
5. Verify database connection

**Common Issues:**
- Validation errors (check response status 400)
- Database connection issues
- Missing required fields

### Scenario 2: Bugs Not Loading

**Symptoms:** Bug list is empty or shows error

**Debugging Steps:**
1. Check browser console
2. Verify API endpoint is correct
3. Check server is running
4. Verify MongoDB connection
5. Check CORS settings

### Scenario 3: Update Not Working

**Symptoms:** Bug status doesn't update

**Debugging Steps:**
1. Check Network tab for PUT request
2. Verify request includes correct ID
3. Check server logs
4. Verify database update

### Scenario 4: Delete Confirmation Not Working

**Symptoms:** Delete doesn't work or no confirmation

**Debugging Steps:**
1. Check browser console
2. Verify window.confirm is called
3. Check delete API request
4. Verify server delete endpoint

## Intentional Bugs for Practice

The codebase includes some intentional bugs for debugging practice:

1. **Validation Bug:** Check form validation edge cases
2. **API Error Handling:** Test error responses
3. **State Management:** Test component state updates

## Best Practices

1. **Use Console Logs Sparingly:** Remove debug logs in production
2. **Use Environment Variables:** Different log levels for dev/prod
3. **Error Logging:** Log errors to a service in production
4. **Breakpoints:** Use breakpoints instead of console.log when possible
5. **Network Tab:** Always check Network tab for API issues
6. **React DevTools:** Use for component state debugging
7. **Error Boundaries:** Always wrap components in error boundaries

## Tools and Extensions

- **React DevTools:** Browser extension for React debugging
- **Redux DevTools:** If using Redux (not used in this app)
- **Postman/Insomnia:** For API testing
- **MongoDB Compass:** For database inspection
- **VS Code Debugger:** For server-side debugging

## Additional Resources

- [Chrome DevTools Documentation](https://developer.chrome.com/docs/devtools/)
- [React Debugging Guide](https://react.dev/learn/react-developer-tools)
- [Node.js Debugging Guide](https://nodejs.org/en/docs/guides/debugging-getting-started/)
- [Axios Documentation](https://axios-http.com/docs/intro)
