import React, { useState } from 'react';
import BugForm from './BugForm';
import './BugItem.css';

const BugItem = ({ bug, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleUpdate = async (bugData) => {
    try {
      await onUpdate(bug._id, bugData);
      setIsEditing(false);
    } catch (error) {
      // Error is handled by parent component
      console.error('Error updating bug:', error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this bug?')) {
      setIsDeleting(true);
      try {
        await onDelete(bug._id);
      } catch (error) {
        console.error('Error deleting bug:', error);
        setIsDeleting(false);
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open':
        return '#dc3545';
      case 'in-progress':
        return '#ffc107';
      case 'resolved':
        return '#28a745';
      default:
        return '#6c757d';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical':
        return '#dc3545';
      case 'high':
        return '#fd7e14';
      case 'medium':
        return '#ffc107';
      case 'low':
        return '#28a745';
      default:
        return '#6c757d';
    }
  };

  if (isEditing) {
    return (
      <div className="bug-item" data-testid="bug-item-editing">
        <BugForm
          initialData={bug}
          isEditing={true}
          onSubmit={handleUpdate}
          onCancel={() => setIsEditing(false)}
        />
      </div>
    );
  }

  return (
    <div className="bug-item" data-testid="bug-item">
      <div className="bug-item-header">
        <h4 className="bug-item-title" data-testid="bug-title">
          {bug.title}
        </h4>
        <div className="bug-item-badges">
          <span
            className="badge status-badge"
            style={{ backgroundColor: getStatusColor(bug.status) }}
            data-testid="bug-status"
          >
            {bug.status}
          </span>
          <span
            className="badge priority-badge"
            style={{ backgroundColor: getPriorityColor(bug.priority) }}
            data-testid="bug-priority"
          >
            {bug.priority}
          </span>
        </div>
      </div>

      <p className="bug-item-description" data-testid="bug-description">
        {bug.description}
      </p>

      <div className="bug-item-footer">
        <div className="bug-item-meta">
          {bug.reporter && (
            <span className="bug-item-reporter" data-testid="bug-reporter">
              Reported by: {bug.reporter}
            </span>
          )}
          <span className="bug-item-date" data-testid="bug-date">
            {new Date(bug.createdAt).toLocaleDateString()}
          </span>
        </div>
        <div className="bug-item-actions">
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setIsEditing(true)}
            data-testid="edit-button"
          >
            Edit
          </button>
          <button
            className="btn btn-danger btn-sm"
            onClick={handleDelete}
            disabled={isDeleting}
            data-testid="delete-button"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BugItem;
