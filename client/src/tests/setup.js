import '@testing-library/jest-dom';

// Mock window.confirm
global.confirm = jest.fn(() => true);
