import React, { useState, useEffect } from 'react';
import BugForm from './BugForm';
import BugList from './BugList';
import { getBugs, createBug, updateBug, deleteBug } from '../services/bugService';
import './BugTracker.css';

const BugTracker = () => {
  const [bugs, setBugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchBugs();
  }, []);

  const fetchBugs = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching bugs...');
      const response = await getBugs();
      console.log('Bugs fetched:', response.data);
      setBugs(response.data || []);
    } catch (err) {
      console.error('Error fetching bugs:', err);
      setError(err.response?.data?.error?.message || 'Failed to fetch bugs');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBug = async (bugData) => {
    try {
      setError(null);
      console.log('Creating bug:', bugData);
      const response = await createBug(bugData);
      console.log('Bug created:', response.data);
      setBugs([response.data, ...bugs]);
      setShowForm(false);
    } catch (err) {
      console.error('Error creating bug:', err);
      setError(err.response?.data?.error?.message || 'Failed to create bug');
      throw err; // Re-throw to let form handle it
    }
  };

  const handleUpdateBug = async (id, bugData) => {
    try {
      setError(null);
      console.log(`Updating bug ${id}:`, bugData);
      const response = await updateBug(id, bugData);
      console.log('Bug updated:', response.data);
      setBugs(bugs.map(bug => bug._id === id ? response.data : bug));
    } catch (err) {
      console.error('Error updating bug:', err);
      setError(err.response?.data?.error?.message || 'Failed to update bug');
      throw err; // Re-throw to let component handle it
    }
  };

  const handleDeleteBug = async (id) => {
    try {
      setError(null);
      console.log(`Deleting bug ${id}`);
      await deleteBug(id);
      console.log('Bug deleted successfully');
      setBugs(bugs.filter(bug => bug._id !== id));
    } catch (err) {
      console.error('Error deleting bug:', err);
      setError(err.response?.data?.error?.message || 'Failed to delete bug');
    }
  };

  return (
    <div className="bug-tracker" data-testid="bug-tracker">
      <div className="bug-tracker-header">
        <h2>Bug List</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn btn-primary"
          data-testid="toggle-form-button"
        >
          {showForm ? 'Cancel' : 'Report New Bug'}
        </button>
      </div>

      {error && (
        <div className="error-message" data-testid="error-message">
          {error}
        </div>
      )}

      {showForm && (
        <BugForm
          onSubmit={handleCreateBug}
          onCancel={() => setShowForm(false)}
        />
      )}

      {loading ? (
        <div className="loading" data-testid="loading">Loading bugs...</div>
      ) : (
        <BugList
          bugs={bugs}
          onUpdate={handleUpdateBug}
          onDelete={handleDeleteBug}
        />
      )}
    </div>
  );
};

export default BugTracker;
