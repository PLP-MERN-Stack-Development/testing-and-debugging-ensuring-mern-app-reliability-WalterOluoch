import axios from 'axios';
import * as bugService from '../../services/bugService';

jest.mock('axios');
const mockedAxios = axios;

describe('Bug Service Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedAxios.create.mockReturnValue(mockedAxios);
  });

  describe('getBugs', () => {
    test('should fetch all bugs successfully', async () => {
      const mockBugs = [
        { _id: '1', title: 'Bug 1', description: 'Desc 1', status: 'open' },
        { _id: '2', title: 'Bug 2', description: 'Desc 2', status: 'in-progress' }
      ];

      mockedAxios.get.mockResolvedValue({
        data: {
          success: true,
          data: mockBugs
        }
      });

      const result = await bugService.getBugs();

      expect(mockedAxios.get).toHaveBeenCalledWith('/bugs');
      expect(result.data).toEqual(mockBugs);
    });

    test('should handle errors when fetching bugs', async () => {
      const error = new Error('Network error');
      mockedAxios.get.mockRejectedValue(error);

      await expect(bugService.getBugs()).rejects.toThrow('Network error');
    });
  });

  describe('createBug', () => {
    test('should create a new bug successfully', async () => {
      const newBug = {
        title: 'New Bug',
        description: 'New Description',
        status: 'open',
        priority: 'high'
      };

      const createdBug = { _id: '3', ...newBug };

      mockedAxios.post.mockResolvedValue({
        data: {
          success: true,
          data: createdBug
        }
      });

      const result = await bugService.createBug(newBug);

      expect(mockedAxios.post).toHaveBeenCalledWith('/bugs', newBug);
      expect(result.data).toEqual(createdBug);
    });

    test('should handle validation errors', async () => {
      const invalidBug = { title: '', description: '' };

      mockedAxios.post.mockRejectedValue({
        response: {
          data: {
            error: {
              message: 'Validation failed',
              status: 400
            }
          }
        }
      });

      await expect(bugService.createBug(invalidBug)).rejects.toMatchObject({
        response: {
          data: {
            error: {
              message: 'Validation failed'
            }
          }
        }
      });
    });
  });

  describe('updateBug', () => {
    test('should update a bug successfully', async () => {
      const bugId = '1';
      const updateData = { status: 'resolved' };
      const updatedBug = {
        _id: bugId,
        title: 'Bug 1',
        description: 'Desc 1',
        status: 'resolved'
      };

      mockedAxios.put.mockResolvedValue({
        data: {
          success: true,
          data: updatedBug
        }
      });

      const result = await bugService.updateBug(bugId, updateData);

      expect(mockedAxios.put).toHaveBeenCalledWith(`/bugs/${bugId}`, updateData);
      expect(result.data).toEqual(updatedBug);
    });

    test('should handle 404 error when bug not found', async () => {
      const bugId = 'nonexistent';
      const updateData = { status: 'resolved' };

      mockedAxios.put.mockRejectedValue({
        response: {
          data: {
            error: {
              message: 'Bug not found',
              status: 404
            }
          }
        }
      });

      await expect(bugService.updateBug(bugId, updateData)).rejects.toMatchObject({
        response: {
          data: {
            error: {
              message: 'Bug not found'
            }
          }
        }
      });
    });
  });

  describe('deleteBug', () => {
    test('should delete a bug successfully', async () => {
      const bugId = '1';

      mockedAxios.delete.mockResolvedValue({
        data: {
          success: true,
          data: {}
        }
      });

      const result = await bugService.deleteBug(bugId);

      expect(mockedAxios.delete).toHaveBeenCalledWith(`/bugs/${bugId}`);
      expect(result.data).toEqual({});
    });

    test('should handle 404 error when bug not found', async () => {
      const bugId = 'nonexistent';

      mockedAxios.delete.mockRejectedValue({
        response: {
          data: {
            error: {
              message: 'Bug not found',
              status: 404
            }
          }
        }
      });

      await expect(bugService.deleteBug(bugId)).rejects.toMatchObject({
        response: {
          data: {
            error: {
              message: 'Bug not found'
            }
          }
        }
      });
    });
  });
});
