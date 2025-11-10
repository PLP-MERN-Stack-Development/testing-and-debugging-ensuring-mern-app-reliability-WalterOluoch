import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import BugList from '../../components/BugList';

describe('BugList Unit Tests', () => {
  const mockBugs = [
    {
      _id: '1',
      title: 'Bug 1',
      description: 'Description 1',
      status: 'open',
      priority: 'high'
    },
    {
      _id: '2',
      title: 'Bug 2',
      description: 'Description 2',
      status: 'in-progress',
      priority: 'medium'
    }
  ];

  const mockOnUpdate = jest.fn();
  const mockOnDelete = jest.fn();

  test('should render empty state when no bugs', () => {
    render(<BugList bugs={[]} onUpdate={mockOnUpdate} onDelete={mockOnDelete} />);

    expect(screen.getByTestId('bug-list-empty')).toBeInTheDocument();
    expect(screen.getByText(/No bugs reported yet/)).toBeInTheDocument();
  });

  test('should render list of bugs', () => {
    render(<BugList bugs={mockBugs} onUpdate={mockOnUpdate} onDelete={mockOnDelete} />);

    expect(screen.getByTestId('bug-list')).toBeInTheDocument();
    expect(screen.getByText('Bugs (2)')).toBeInTheDocument();
    expect(screen.getByTestId('bug-title')).toHaveTextContent('Bug 1');
  });

  test('should render correct number of bug items', () => {
    render(<BugList bugs={mockBugs} onUpdate={mockOnUpdate} onDelete={mockOnDelete} />);

    const bugItems = screen.getAllByTestId('bug-item');
    expect(bugItems).toHaveLength(2);
  });

  test('should display bug count in header', () => {
    const { rerender } = render(
      <BugList bugs={mockBugs} onUpdate={mockOnUpdate} onDelete={mockOnDelete} />
    );

    expect(screen.getByText('Bugs (2)')).toBeInTheDocument();

    const moreBugs = [...mockBugs, { _id: '3', title: 'Bug 3', description: 'Desc 3', status: 'open' }];
    rerender(<BugList bugs={moreBugs} onUpdate={mockOnUpdate} onDelete={mockOnDelete} />);

    expect(screen.getByText('Bugs (3)')).toBeInTheDocument();
  });
});
