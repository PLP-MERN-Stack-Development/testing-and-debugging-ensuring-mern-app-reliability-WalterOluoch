const request = require('supertest');
const app = require('../../server');
const Bug = require('../../src/models/Bug');

describe('Bug API Integration Tests', () => {
  describe('GET /api/bugs', () => {
    test('should get all bugs', async () => {
      // Create test bugs
      await Bug.create({
        title: 'Test Bug 1',
        description: 'Description 1',
        status: 'open'
      });
      await Bug.create({
        title: 'Test Bug 2',
        description: 'Description 2',
        status: 'in-progress'
      });

      const response = await request(app)
        .get('/api/bugs')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.count).toBe(2);
      expect(response.body.data).toHaveLength(2);
    });

    test('should return empty array when no bugs exist', async () => {
      const response = await request(app)
        .get('/api/bugs')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.count).toBe(0);
      expect(response.body.data).toHaveLength(0);
    });
  });

  describe('GET /api/bugs/:id', () => {
    test('should get a single bug by ID', async () => {
      const bug = await Bug.create({
        title: 'Test Bug',
        description: 'Test Description',
        status: 'open'
      });

      const response = await request(app)
        .get(`/api/bugs/${bug._id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe('Test Bug');
      expect(response.body.data.description).toBe('Test Description');
      expect(response.body.data.status).toBe('open');
    });

    test('should return 404 for non-existent bug', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const response = await request(app)
        .get(`/api/bugs/${fakeId}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toBe('Bug not found');
    });

    test('should return 400 for invalid ID format', async () => {
      const response = await request(app)
        .get('/api/bugs/invalid-id')
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toBe('Invalid bug ID format');
    });
  });

  describe('POST /api/bugs', () => {
    test('should create a new bug', async () => {
      const newBug = {
        title: 'New Bug',
        description: 'New Bug Description',
        status: 'open',
        priority: 'high',
        reporter: 'John Doe'
      };

      const response = await request(app)
        .post('/api/bugs')
        .send(newBug)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe('New Bug');
      expect(response.body.data.description).toBe('New Bug Description');
      expect(response.body.data.status).toBe('open');
      expect(response.body.data.priority).toBe('high');
      expect(response.body.data.reporter).toBe('John Doe');
    });

    test('should create bug with default status if not provided', async () => {
      const newBug = {
        title: 'New Bug',
        description: 'New Bug Description'
      };

      const response = await request(app)
        .post('/api/bugs')
        .send(newBug)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe('open');
    });

    test('should return 400 for missing title', async () => {
      const newBug = {
        description: 'New Bug Description',
        status: 'open'
      };

      const response = await request(app)
        .post('/api/bugs')
        .send(newBug)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toBe('Validation failed');
    });

    test('should return 400 for missing description', async () => {
      const newBug = {
        title: 'New Bug',
        status: 'open'
      };

      const response = await request(app)
        .post('/api/bugs')
        .send(newBug)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toBe('Validation failed');
    });

    test('should return 400 for invalid status', async () => {
      const newBug = {
        title: 'New Bug',
        description: 'New Bug Description',
        status: 'invalid-status'
      };

      const response = await request(app)
        .post('/api/bugs')
        .send(newBug)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toBe('Validation failed');
    });

    test('should return 400 for title exceeding 200 characters', async () => {
      const newBug = {
        title: 'a'.repeat(201),
        description: 'New Bug Description',
        status: 'open'
      };

      const response = await request(app)
        .post('/api/bugs')
        .send(newBug)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toBe('Validation failed');
    });

    test('should return 400 for description exceeding 2000 characters', async () => {
      const newBug = {
        title: 'New Bug',
        description: 'a'.repeat(2001),
        status: 'open'
      };

      const response = await request(app)
        .post('/api/bugs')
        .send(newBug)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toBe('Validation failed');
    });
  });

  describe('PUT /api/bugs/:id', () => {
    test('should update an existing bug', async () => {
      const bug = await Bug.create({
        title: 'Original Bug',
        description: 'Original Description',
        status: 'open'
      });

      const updateData = {
        title: 'Updated Bug',
        description: 'Updated Description',
        status: 'in-progress',
        priority: 'high'
      };

      const response = await request(app)
        .put(`/api/bugs/${bug._id}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe('Updated Bug');
      expect(response.body.data.description).toBe('Updated Description');
      expect(response.body.data.status).toBe('in-progress');
      expect(response.body.data.priority).toBe('high');
    });

    test('should update only provided fields', async () => {
      const bug = await Bug.create({
        title: 'Original Bug',
        description: 'Original Description',
        status: 'open'
      });

      const updateData = {
        status: 'resolved'
      };

      const response = await request(app)
        .put(`/api/bugs/${bug._id}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe('Original Bug');
      expect(response.body.data.status).toBe('resolved');
    });

    test('should return 404 for non-existent bug', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const updateData = {
        status: 'resolved'
      };

      const response = await request(app)
        .put(`/api/bugs/${fakeId}`)
        .send(updateData)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toBe('Bug not found');
    });

    test('should return 400 for invalid status in update', async () => {
      const bug = await Bug.create({
        title: 'Test Bug',
        description: 'Test Description',
        status: 'open'
      });

      const updateData = {
        status: 'invalid-status'
      };

      const response = await request(app)
        .put(`/api/bugs/${bug._id}`)
        .send(updateData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toBe('Validation failed');
    });
  });

  describe('DELETE /api/bugs/:id', () => {
    test('should delete an existing bug', async () => {
      const bug = await Bug.create({
        title: 'Test Bug',
        description: 'Test Description',
        status: 'open'
      });

      const response = await request(app)
        .delete(`/api/bugs/${bug._id}`)
        .expect(200);

      expect(response.body.success).toBe(true);

      // Verify bug is deleted
      const deletedBug = await Bug.findById(bug._id);
      expect(deletedBug).toBeNull();
    });

    test('should return 404 for non-existent bug', async () => {
      const fakeId = '507f1f77bcf86cd799439011';

      const response = await request(app)
        .delete(`/api/bugs/${fakeId}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toBe('Bug not found');
    });

    test('should return 400 for invalid ID format', async () => {
      const response = await request(app)
        .delete('/api/bugs/invalid-id')
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toBe('Invalid bug ID format');
    });
  });

  describe('Error Handling', () => {
    test('should handle database connection errors gracefully', async () => {
      // This test would require mocking mongoose connection errors
      // For now, we test that the server responds correctly to valid requests
      const response = await request(app)
        .get('/api/bugs')
        .expect(200);

      expect(response.body).toHaveProperty('success');
    });
  });
});
