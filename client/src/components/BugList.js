import React from 'react';
import BugItem from './BugItem';
import './BugList.css';

const BugList = ({ bugs, onUpdate, onDelete }) => {
  if (bugs.length === 0) {
    return (
      <div className="bug-list-empty" data-testid="bug-list-empty">
        <p>No bugs reported yet. Click "Report New Bug" to get started!</p>
      </div>
    );
  }

  return (
    <div className="bug-list" data-testid="bug-list">
      <h3>Bugs ({bugs.length})</h3>
      <div className="bug-list-items">
        {bugs.map(bug => (
          <BugItem
            key={bug._id}
            bug={bug}
            onUpdate={onUpdate}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default BugList;
