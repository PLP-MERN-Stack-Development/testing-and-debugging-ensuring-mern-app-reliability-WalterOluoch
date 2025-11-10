import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import BugItem from '../../components/BugItem';

describe('BugItem Unit Tests', () => {
  const mockBug = {
    _id: '123',
    title: 'Test Bug',
    description: 'Test Description',
    status: 'open',
    priority: 'medium',
    reporter: 'John Doe',
    createdAt: new Date().toISOString()
  };

  const mockOnUpdate = jest.fn();
  const mockOnDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    global.confirm = jest.fn(() => true);
  });

  test('should render bug item with all details', () => {
    render(<BugItem bug={mockBug} onUpdate={mockOnUpdate} onDelete={mockOnDelete} />);

    expect(screen.getByTestId('bug-item')).toBeInTheDocument();
    expect(screen.getByTestId('bug-title')).toHaveTextContent('Test Bug');
    expect(screen.getByTestId('bug-description')).toHaveTextContent('Test Description');
    expect(screen.getByTestId('bug-status')).toHaveTextContent('open');
    expect(screen.getByTestId('bug-priority')).toHaveTextContent('medium');
    expect(screen.getByTestId('bug-reporter')).toHaveTextContent('Reported by: John Doe');
  });

  test('should render bug item without reporter if not provided', () => {
    const bugWithoutReporter = { ...mockBug, reporter: '' };
    render(<BugItem bug={bugWithoutReporter} onUpdate={mockOnUpdate} onDelete={mockOnDelete} />);

    expect(screen.queryByTestId('bug-reporter')).not.toBeInTheDocument();
  });

  test('should show edit form when edit button is clicked', () => {
    render(<BugItem bug={mockBug} onUpdate={mockOnUpdate} onDelete={mockOnDelete} />);

    const editButton = screen.getByTestId('edit-button');
    fireEvent.click(editButton);

    expect(screen.getByTestId('bug-item-editing')).toBeInTheDocument();
    expect(screen.getByTestId('bug-form')).toBeInTheDocument();
  });

  test('should call onUpdate when bug is updated', async () => {
    mockOnUpdate.mockResolvedValue();

    render(<BugItem bug={mockBug} onUpdate={mockOnUpdate} onDelete={mockOnDelete} />);

    const editButton = screen.getByTestId('edit-button');
    fireEvent.click(editButton);

    const titleInput = screen.getByTestId('title-input');
    fireEvent.change(titleInput, { target: { value: 'Updated Title' } });

    const submitButton = screen.getByTestId('submit-button');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnUpdate).toHaveBeenCalled();
    });
  });

  test('should call onDelete when delete button is clicked and confirmed', async () => {
    mockOnDelete.mockResolvedValue();

    render(<BugItem bug={mockBug} onUpdate={mockOnUpdate} onDelete={mockOnDelete} />);

    const deleteButton = screen.getByTestId('delete-button');
    fireEvent.click(deleteButton);

    expect(global.confirm).toHaveBeenCalled();
    await waitFor(() => {
      expect(mockOnDelete).toHaveBeenCalledWith(mockBug._id);
    });
  });

  test('should not call onDelete when delete is cancelled', () => {
    global.confirm.mockReturnValue(false);

    render(<BugItem bug={mockBug} onUpdate={mockOnUpdate} onDelete={mockOnDelete} />);

    const deleteButton = screen.getByTestId('delete-button');
    fireEvent.click(deleteButton);

    expect(global.confirm).toHaveBeenCalled();
    expect(mockOnDelete).not.toHaveBeenCalled();
  });

  test('should display correct status badge color', () => {
    const { rerender } = render(
      <BugItem bug={{ ...mockBug, status: 'open' }} onUpdate={mockOnUpdate} onDelete={mockOnDelete} />
    );
    let statusBadge = screen.getByTestId('bug-status');
    expect(statusBadge).toHaveStyle({ backgroundColor: '#dc3545' });

    rerender(<BugItem bug={{ ...mockBug, status: 'in-progress' }} onUpdate={mockOnUpdate} onDelete={mockOnDelete} />);
    statusBadge = screen.getByTestId('bug-status');
    expect(statusBadge).toHaveStyle({ backgroundColor: '#ffc107' });

    rerender(<BugItem bug={{ ...mockBug, status: 'resolved' }} onUpdate={mockOnUpdate} onDelete={mockOnDelete} />);
    statusBadge = screen.getByTestId('bug-status');
    expect(statusBadge).toHaveStyle({ backgroundColor: '#28a745' });
  });

  test('should display correct priority badge color', () => {
    const { rerender } = render(
      <BugItem bug={{ ...mockBug, priority: 'critical' }} onUpdate={mockOnUpdate} onDelete={mockOnDelete} />
    );
    let priorityBadge = screen.getByTestId('bug-priority');
    expect(priorityBadge).toHaveStyle({ backgroundColor: '#dc3545' });

    rerender(<BugItem bug={{ ...mockBug, priority: 'high' }} onUpdate={mockOnUpdate} onDelete={mockOnDelete} />);
    priorityBadge = screen.getByTestId('bug-priority');
    expect(priorityBadge).toHaveStyle({ backgroundColor: '#fd7e14' });

    rerender(<BugItem bug={{ ...mockBug, priority: 'low' }} onUpdate={mockOnUpdate} onDelete={mockOnDelete} />);
    priorityBadge = screen.getByTestId('bug-priority');
    expect(priorityBadge).toHaveStyle({ backgroundColor: '#28a745' });
  });

  test('should exit edit mode when form is cancelled', () => {
    render(<BugItem bug={mockBug} onUpdate={mockOnUpdate} onDelete={mockOnDelete} />);

    const editButton = screen.getByTestId('edit-button');
    fireEvent.click(editButton);

    expect(screen.getByTestId('bug-form')).toBeInTheDocument();

    const cancelButton = screen.getByTestId('cancel-button');
    fireEvent.click(cancelButton);

    expect(screen.queryByTestId('bug-form')).not.toBeInTheDocument();
    expect(screen.getByTestId('bug-item')).toBeInTheDocument();
  });
});
