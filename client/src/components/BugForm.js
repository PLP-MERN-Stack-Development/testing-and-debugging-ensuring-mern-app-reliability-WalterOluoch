import React, { useState } from 'react';
import './BugForm.css';

const BugForm = ({ onSubmit, onCancel, initialData = null, isEditing = false }) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    status: initialData?.status || 'open',
    priority: initialData?.priority || 'medium',
    reporter: initialData?.reporter || ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.trim().length > 200) {
      newErrors.title = 'Title cannot exceed 200 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.trim().length > 2000) {
      newErrors.description = 'Description cannot exceed 2000 characters';
    }

    if (formData.reporter && formData.reporter.length > 100) {
      newErrors.reporter = 'Reporter name cannot exceed 100 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted with data:', formData);

    if (!validateForm()) {
      console.log('Validation failed:', errors);
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      // Reset form if not editing
      if (!isEditing) {
        setFormData({
          title: '',
          description: '',
          status: 'open',
          priority: 'medium',
          reporter: ''
        });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      // Error is handled by parent component
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form 
      className="bug-form" 
      onSubmit={handleSubmit}
      data-testid="bug-form"
    >
      <h3>{isEditing ? 'Edit Bug' : 'Report New Bug'}</h3>

      <div className="form-group">
        <label htmlFor="title">
          Title <span className="required">*</span>
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className={errors.title ? 'error' : ''}
          data-testid="title-input"
          maxLength={200}
        />
        {errors.title && (
          <span className="error-message" data-testid="title-error">
            {errors.title}
          </span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="description">
          Description <span className="required">*</span>
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          className={errors.description ? 'error' : ''}
          data-testid="description-input"
          rows="4"
          maxLength={2000}
        />
        {errors.description && (
          <span className="error-message" data-testid="description-error">
            {errors.description}
          </span>
        )}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            data-testid="status-select"
          >
            <option value="open">Open</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="priority">Priority</label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            data-testid="priority-select"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="reporter">Reporter (Optional)</label>
        <input
          type="text"
          id="reporter"
          name="reporter"
          value={formData.reporter}
          onChange={handleChange}
          className={errors.reporter ? 'error' : ''}
          data-testid="reporter-input"
          maxLength={100}
        />
        {errors.reporter && (
          <span className="error-message" data-testid="reporter-error">
            {errors.reporter}
          </span>
        )}
      </div>

      <div className="form-actions">
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSubmitting}
          data-testid="submit-button"
        >
          {isSubmitting ? 'Submitting...' : (isEditing ? 'Update Bug' : 'Create Bug')}
        </button>
        {onCancel && (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
            data-testid="cancel-button"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default BugForm;
