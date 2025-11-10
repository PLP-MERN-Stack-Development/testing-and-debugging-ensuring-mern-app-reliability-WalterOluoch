import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import BugForm from '../../components/BugForm';

describe('BugForm Unit Tests', () => {
  const mockOnSubmit = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should render form with all fields', () => {
    render(<BugForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    expect(screen.getByTestId('bug-form')).toBeInTheDocument();
    expect(screen.getByTestId('title-input')).toBeInTheDocument();
    expect(screen.getByTestId('description-input')).toBeInTheDocument();
    expect(screen.getByTestId('status-select')).toBeInTheDocument();
    expect(screen.getByTestId('priority-select')).toBeInTheDocument();
    expect(screen.getByTestId('reporter-input')).toBeInTheDocument();
    expect(screen.getByTestId('submit-button')).toBeInTheDocument();
    expect(screen.getByTestId('cancel-button')).toBeInTheDocument();
  });

  test('should render "Report New Bug" title for new bug', () => {
    render(<BugForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    expect(screen.getByText('Report New Bug')).toBeInTheDocument();
  });

  test('should render "Edit Bug" title when editing', () => {
    const initialData = {
      title: 'Test Bug',
      description: 'Test Description',
      status: 'open',
      priority: 'medium'
    };
    render(
      <BugForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        initialData={initialData}
        isEditing={true}
      />
    );
    expect(screen.getByText('Edit Bug')).toBeInTheDocument();
  });

  test('should populate form fields with initial data', () => {
    const initialData = {
      title: 'Test Bug',
      description: 'Test Description',
      status: 'in-progress',
      priority: 'high',
      reporter: 'John Doe'
    };
    render(
      <BugForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        initialData={initialData}
        isEditing={true}
      />
    );

    expect(screen.getByTestId('title-input')).toHaveValue('Test Bug');
    expect(screen.getByTestId('description-input')).toHaveValue('Test Description');
    expect(screen.getByTestId('status-select')).toHaveValue('in-progress');
    expect(screen.getByTestId('priority-select')).toHaveValue('high');
    expect(screen.getByTestId('reporter-input')).toHaveValue('John Doe');
  });

  test('should update form fields when user types', () => {
    render(<BugForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    const titleInput = screen.getByTestId('title-input');
    fireEvent.change(titleInput, { target: { value: 'New Title' } });
    expect(titleInput).toHaveValue('New Title');

    const descriptionInput = screen.getByTestId('description-input');
    fireEvent.change(descriptionInput, { target: { value: 'New Description' } });
    expect(descriptionInput).toHaveValue('New Description');
  });

  test('should validate required fields', async () => {
    render(<BugForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    const submitButton = screen.getByTestId('submit-button');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByTestId('title-error')).toBeInTheDocument();
      expect(screen.getByTestId('description-error')).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  test('should show error for empty title', async () => {
    render(<BugForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    const titleInput = screen.getByTestId('title-input');
    fireEvent.change(titleInput, { target: { value: '   ' } });

    const submitButton = screen.getByTestId('submit-button');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByTestId('title-error')).toHaveTextContent('Title is required');
    });
  });

  test('should show error for title exceeding 200 characters', async () => {
    render(<BugForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    const titleInput = screen.getByTestId('title-input');
    fireEvent.change(titleInput, { target: { value: 'a'.repeat(201) } });

    const submitButton = screen.getByTestId('submit-button');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByTestId('title-error')).toHaveTextContent('Title cannot exceed 200 characters');
    });
  });

  test('should show error for description exceeding 2000 characters', async () => {
    render(<BugForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    const descriptionInput = screen.getByTestId('description-input');
    fireEvent.change(descriptionInput, { target: { value: 'a'.repeat(2001) } });

    const submitButton = screen.getByTestId('submit-button');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByTestId('description-error')).toHaveTextContent('Description cannot exceed 2000 characters');
    });
  });

  test('should submit form with valid data', async () => {
    mockOnSubmit.mockResolvedValue();

    render(<BugForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    fireEvent.change(screen.getByTestId('title-input'), {
      target: { value: 'Test Bug' }
    });
    fireEvent.change(screen.getByTestId('description-input'), {
      target: { value: 'Test Description' }
    });

    const submitButton = screen.getByTestId('submit-button');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        title: 'Test Bug',
        description: 'Test Description',
        status: 'open',
        priority: 'medium',
        reporter: ''
      });
    });
  });

  test('should call onCancel when cancel button is clicked', () => {
    render(<BugForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    const cancelButton = screen.getByTestId('cancel-button');
    fireEvent.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  test('should clear errors when user starts typing', async () => {
    render(<BugForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    const submitButton = screen.getByTestId('submit-button');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByTestId('title-error')).toBeInTheDocument();
    });

    const titleInput = screen.getByTestId('title-input');
    fireEvent.change(titleInput, { target: { value: 'New Title' } });

    await waitFor(() => {
      expect(screen.queryByTestId('title-error')).not.toBeInTheDocument();
    });
  });

  test('should disable submit button while submitting', async () => {
    mockOnSubmit.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

    render(<BugForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    fireEvent.change(screen.getByTestId('title-input'), {
      target: { value: 'Test Bug' }
    });
    fireEvent.change(screen.getByTestId('description-input'), {
      target: { value: 'Test Description' }
    });

    const submitButton = screen.getByTestId('submit-button');
    fireEvent.click(submitButton);

    expect(submitButton).toBeDisabled();
    expect(screen.getByText('Submitting...')).toBeInTheDocument();

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });
  });
});
