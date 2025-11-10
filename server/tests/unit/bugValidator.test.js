const {
  validateTitle,
  validateDescription,
  validateStatus,
  validatePriority,
  validateBug
} = require('../../src/middleware/bugValidator');

describe('Bug Validator Unit Tests', () => {
  describe('validateTitle', () => {
    test('should return valid for a valid title', () => {
      const result = validateTitle('Test Bug Title');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeNull();
    });

    test('should return invalid for empty title', () => {
      const result = validateTitle('');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Title cannot be empty');
    });

    test('should return invalid for null title', () => {
      const result = validateTitle(null);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Title is required and must be a string');
    });

    test('should return invalid for undefined title', () => {
      const result = validateTitle(undefined);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Title is required and must be a string');
    });

    test('should return invalid for title with only whitespace', () => {
      const result = validateTitle('   ');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Title cannot be empty');
    });

    test('should return invalid for title exceeding 200 characters', () => {
      const longTitle = 'a'.repeat(201);
      const result = validateTitle(longTitle);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Title cannot exceed 200 characters');
    });

    test('should return valid for title with exactly 200 characters', () => {
      const title = 'a'.repeat(200);
      const result = validateTitle(title);
      expect(result.isValid).toBe(true);
      expect(result.error).toBeNull();
    });

    test('should return invalid for non-string title', () => {
      const result = validateTitle(123);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Title is required and must be a string');
    });
  });

  describe('validateDescription', () => {
    test('should return valid for a valid description', () => {
      const result = validateDescription('This is a test bug description');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeNull();
    });

    test('should return invalid for empty description', () => {
      const result = validateDescription('');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Description cannot be empty');
    });

    test('should return invalid for null description', () => {
      const result = validateDescription(null);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Description is required and must be a string');
    });

    test('should return invalid for description exceeding 2000 characters', () => {
      const longDescription = 'a'.repeat(2001);
      const result = validateDescription(longDescription);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Description cannot exceed 2000 characters');
    });

    test('should return valid for description with exactly 2000 characters', () => {
      const description = 'a'.repeat(2000);
      const result = validateDescription(description);
      expect(result.isValid).toBe(true);
      expect(result.error).toBeNull();
    });
  });

  describe('validateStatus', () => {
    test('should return valid for "open" status', () => {
      const result = validateStatus('open');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeNull();
    });

    test('should return valid for "in-progress" status', () => {
      const result = validateStatus('in-progress');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeNull();
    });

    test('should return valid for "resolved" status', () => {
      const result = validateStatus('resolved');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeNull();
    });

    test('should return invalid for null status', () => {
      const result = validateStatus(null);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Status is required');
    });

    test('should return invalid for invalid status', () => {
      const result = validateStatus('invalid-status');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('Status must be one of:');
    });
  });

  describe('validatePriority', () => {
    test('should return valid for "low" priority', () => {
      const result = validatePriority('low');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeNull();
    });

    test('should return valid for "medium" priority', () => {
      const result = validatePriority('medium');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeNull();
    });

    test('should return valid for "high" priority', () => {
      const result = validatePriority('high');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeNull();
    });

    test('should return valid for "critical" priority', () => {
      const result = validatePriority('critical');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeNull();
    });

    test('should return valid for null/undefined priority (optional)', () => {
      const result = validatePriority(null);
      expect(result.isValid).toBe(true);
      expect(result.error).toBeNull();
    });

    test('should return invalid for invalid priority', () => {
      const result = validatePriority('invalid-priority');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('Priority must be one of:');
    });
  });

  describe('validateBug', () => {
    test('should return valid for a complete valid bug', () => {
      const bug = {
        title: 'Test Bug',
        description: 'Test Description',
        status: 'open',
        priority: 'high'
      };
      const result = validateBug(bug);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('should return invalid for bug with missing title', () => {
      const bug = {
        description: 'Test Description',
        status: 'open'
      };
      const result = validateBug(bug);
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors.some(e => e.field === 'title')).toBe(true);
    });

    test('should return invalid for bug with missing description', () => {
      const bug = {
        title: 'Test Bug',
        status: 'open'
      };
      const result = validateBug(bug);
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors.some(e => e.field === 'description')).toBe(true);
    });

    test('should return invalid for bug with invalid status', () => {
      const bug = {
        title: 'Test Bug',
        description: 'Test Description',
        status: 'invalid-status'
      };
      const result = validateBug(bug);
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors.some(e => e.field === 'status')).toBe(true);
    });

    test('should return invalid for bug with invalid priority', () => {
      const bug = {
        title: 'Test Bug',
        description: 'Test Description',
        status: 'open',
        priority: 'invalid-priority'
      };
      const result = validateBug(bug);
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors.some(e => e.field === 'priority')).toBe(true);
    });

    test('should return invalid for bug with multiple validation errors', () => {
      const bug = {
        title: '',
        description: '',
        status: 'invalid-status'
      };
      const result = validateBug(bug);
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(1);
    });
  });
});
