// Custom validation helper functions for unit testing

/**
 * Validates bug title
 * @param {string} title - The bug title to validate
 * @returns {object} - Validation result with isValid and error message
 */
const validateTitle = (title) => {
  if (!title || typeof title !== 'string') {
    return {
      isValid: false,
      error: 'Title is required and must be a string'
    };
  }
  
  const trimmedTitle = title.trim();
  if (trimmedTitle.length === 0) {
    return {
      isValid: false,
      error: 'Title cannot be empty'
    };
  }
  
  if (trimmedTitle.length > 200) {
    return {
      isValid: false,
      error: 'Title cannot exceed 200 characters'
    };
  }
  
  return {
    isValid: true,
    error: null
  };
};

/**
 * Validates bug description
 * @param {string} description - The bug description to validate
 * @returns {object} - Validation result with isValid and error message
 */
const validateDescription = (description) => {
  if (!description || typeof description !== 'string') {
    return {
      isValid: false,
      error: 'Description is required and must be a string'
    };
  }
  
  const trimmedDescription = description.trim();
  if (trimmedDescription.length === 0) {
    return {
      isValid: false,
      error: 'Description cannot be empty'
    };
  }
  
  if (trimmedDescription.length > 2000) {
    return {
      isValid: false,
      error: 'Description cannot exceed 2000 characters'
    };
  }
  
  return {
    isValid: true,
    error: null
  };
};

/**
 * Validates bug status
 * @param {string} status - The bug status to validate
 * @returns {object} - Validation result with isValid and error message
 */
const validateStatus = (status) => {
  const validStatuses = ['open', 'in-progress', 'resolved'];
  
  if (!status) {
    return {
      isValid: false,
      error: 'Status is required'
    };
  }
  
  if (!validStatuses.includes(status)) {
    return {
      isValid: false,
      error: `Status must be one of: ${validStatuses.join(', ')}`
    };
  }
  
  return {
    isValid: true,
    error: null
  };
};

/**
 * Validates bug priority
 * @param {string} priority - The bug priority to validate
 * @returns {object} - Validation result with isValid and error message
 */
const validatePriority = (priority) => {
  const validPriorities = ['low', 'medium', 'high', 'critical'];
  
  if (priority && !validPriorities.includes(priority)) {
    return {
      isValid: false,
      error: `Priority must be one of: ${validPriorities.join(', ')}`
    };
  }
  
  return {
    isValid: true,
    error: null
  };
};

/**
 * Validates entire bug object
 * @param {object} bug - The bug object to validate
 * @returns {object} - Validation result with isValid and errors array
 */
const validateBug = (bug) => {
  const errors = [];
  
  const titleValidation = validateTitle(bug.title);
  if (!titleValidation.isValid) {
    errors.push({ field: 'title', message: titleValidation.error });
  }
  
  const descriptionValidation = validateDescription(bug.description);
  if (!descriptionValidation.isValid) {
    errors.push({ field: 'description', message: descriptionValidation.error });
  }
  
  const statusValidation = validateStatus(bug.status);
  if (!statusValidation.isValid) {
    errors.push({ field: 'status', message: statusValidation.error });
  }
  
  if (bug.priority) {
    const priorityValidation = validatePriority(bug.priority);
    if (!priorityValidation.isValid) {
      errors.push({ field: 'priority', message: priorityValidation.error });
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

module.exports = {
  validateTitle,
  validateDescription,
  validateStatus,
  validatePriority,
  validateBug
};
