import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import BugTracker from '../../components/BugTracker';
import * as bugService from '../../services/bugService';

// Mock the bug service
jest.mock('../../services/bugService');

describe('BugTracker Integration Tests', () => {
  const mockBugs = [
    {
      _id: '1',
      title: 'Test Bug 1',
      description: 'Description 1',
      status: 'open',
      priority: 'medium',
      createdAt: new Date().toISOString()
    },
    {
      _id: '2',
      title: 'Test Bug 2',
      description: 'Description 2',
      status: 'in-progress',
      priority: 'high',
      createdAt: new Date().toISOString()
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    bugService.getBugs.mockResolvedValue({ data: mockBugs });
  });

  test('should fetch and display bugs on mount', async () => {
    render(<BugTracker />);

    expect(bugService.getBugs).toHaveBeenCalledTimes(1);

    await waitFor(() => {
      expect(screen.getByTestId('bug-list')).toBeInTheDocument();
      expect(screen.getByText('Test Bug 1')).toBeInTheDocument();
      expect(screen.getByText('Test Bug 2')).toBeInTheDocument();
    });
  });

  test('should show loading state while fetching bugs', () => {
    bugService.getBugs.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

    render(<BugTracker />);

    expect(screen.getByTestId('loading')).toBeInTheDocument();
    expect(screen.getByText('Loading bugs...')).toBeInTheDocument();
  });

  test('should show error message when fetching fails', async () => {
    const errorMessage = 'Failed to fetch bugs';
    bugService.getBugs.mockRejectedValue({
      response: {
        data: {
          error: {
            message: errorMessage
          }
        }
      }
    });

    render(<BugTracker />);

    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toBeInTheDocument();
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  test('should show form when "Report New Bug" button is clicked', () => {
    render(<BugTracker />);

    const reportButton = screen.getByTestId('toggle-form-button');
    fireEvent.click(reportButton);

    expect(screen.getByTestId('bug-form')).toBeInTheDocument();
    expect(screen.getByText('Report New Bug')).toBeInTheDocument();
  });

  test('should create new bug and add it to the list', async () => {
    const newBug = {
      _id: '3',
      title: 'New Bug',
      description: 'New Description',
      status: 'open',
      priority: 'medium',
      createdAt: new Date().toISOString()
    };

    bugService.createBug.mockResolvedValue({ data: newBug });

    render(<BugTracker />);

    await waitFor(() => {
      expect(screen.getByTestId('bug-list')).toBeInTheDocument();
    });

    // Open form
    const reportButton = screen.getByTestId('toggle-form-button');
    fireEvent.click(reportButton);

    // Fill form
    fireEvent.change(screen.getByTestId('title-input'), {
      target: { value: 'New Bug' }
    });
    fireEvent.change(screen.getByTestId('description-input'), {
      target: { value: 'New Description' }
    });

    // Submit form
    const submitButton = screen.getByTestId('submit-button');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(bugService.createBug).toHaveBeenCalledWith({
        title: 'New Bug',
        description: 'New Description',
        status: 'open',
        priority: 'medium',
        reporter: ''
      });
      expect(screen.getByText('New Bug')).toBeInTheDocument();
    });
  });

  test('should update bug status', async () => {
    const updatedBug = {
      ...mockBugs[0],
      status: 'resolved'
    };

    bugService.updateBug.mockResolvedValue({ data: updatedBug });

    render(<BugTracker />);

    await waitFor(() => {
      expect(screen.getByTestId('bug-list')).toBeInTheDocument();
    });

    // Click edit button on first bug
    const editButtons = screen.getAllByTestId('edit-button');
    fireEvent.click(editButtons[0]);

    // Change status
    const statusSelect = screen.getByTestId('status-select');
    fireEvent.change(statusSelect, { target: { value: 'resolved' } });

    // Submit
    const submitButton = screen.getByTestId('submit-button');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(bugService.updateBug).toHaveBeenCalledWith('1', expect.objectContaining({
        status: 'resolved'
      }));
    });
  });

  test('should delete bug and remove it from the list', async () => {
    global.confirm = jest.fn(() => true);
    bugService.deleteBug.mockResolvedValue({});

    render(<BugTracker />);

    await waitFor(() => {
      expect(screen.getByTestId('bug-list')).toBeInTheDocument();
    });

    // Click delete button on first bug
    const deleteButtons = screen.getAllByTestId('delete-button');
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(bugService.deleteBug).toHaveBeenCalledWith('1');
      expect(screen.queryByText('Test Bug 1')).not.toBeInTheDocument();
      expect(screen.getByText('Test Bug 2')).toBeInTheDocument();
    });
  });

  test('should display empty state when no bugs', async () => {
    bugService.getBugs.mockResolvedValue({ data: [] });

    render(<BugTracker />);

    await waitFor(() => {
      expect(screen.getByTestId('bug-list-empty')).toBeInTheDocument();
      expect(screen.getByText(/No bugs reported yet/)).toBeInTheDocument();
    });
  });

  test('should handle API errors gracefully', async () => {
    const errorMessage = 'Network error';
    bugService.getBugs.mockRejectedValue({
      message: errorMessage
    });

    render(<BugTracker />);

    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toBeInTheDocument();
      expect(screen.getByText('Failed to fetch bugs')).toBeInTheDocument();
    });
  });

  test('should close form after successful bug creation', async () => {
    const newBug = {
      _id: '3',
      title: 'New Bug',
      description: 'New Description',
      status: 'open',
      priority: 'medium'
    };

    bugService.createBug.mockResolvedValue({ data: newBug });

    render(<BugTracker />);

    await waitFor(() => {
      expect(screen.getByTestId('bug-list')).toBeInTheDocument();
    });

    // Open form
    const reportButton = screen.getByTestId('toggle-form-button');
    fireEvent.click(reportButton);

    expect(screen.getByTestId('bug-form')).toBeInTheDocument();

    // Fill and submit form
    fireEvent.change(screen.getByTestId('title-input'), {
      target: { value: 'New Bug' }
    });
    fireEvent.change(screen.getByTestId('description-input'), {
      target: { value: 'New Description' }
    });

    const submitButton = screen.getByTestId('submit-button');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.queryByTestId('bug-form')).not.toBeInTheDocument();
    });
  });
});
