import { useState, useEffect } from 'react';
import * as api from '../services/api';
import toast from 'react-hot-toast';

export default function AdminTaskModal({ isOpen, onClose, users, onTaskAssigned }) {
  const [selectedTaskId, setSelectedTaskId] = useState('');
  const [selectedUserEmail, setSelectedUserEmail] = useState('');
  const [assignmentMessage, setAssignmentMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    if (isOpen) {
      loadUnassignedTasks();
    }
  }, [isOpen]);

  const loadUnassignedTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      const allTasks = await api.apiGetTasks(token);
      // Get tasks that are not assigned to any user (userId is null/undefined)
      const unassignedTasks = allTasks.filter(task => !task.userId);
      setTasks(unassignedTasks);
    } catch (err) {
      toast.error('Failed to load tasks');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTaskId || !selectedUserEmail || !assignmentMessage.trim()) {
      toast.error('Please fill all fields');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await api.apiAssignTask(selectedTaskId, selectedUserEmail, assignmentMessage, token);
      toast.success('Task assigned successfully!');
      onTaskAssigned();
      onClose();
      setSelectedTaskId('');
      setSelectedUserEmail('');
      setAssignmentMessage('');
    } catch (err) {
      toast.error(err.message || 'Failed to assign task');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4">
          <h2 className="text-xl font-bold text-white">👑 Assign Task to User</h2>
          <p className="text-purple-100 text-sm mt-1">Assign unassigned tasks to team members</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Task Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Select Task <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedTaskId}
              onChange={(e) => setSelectedTaskId(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
              disabled={loading}
            >
              <option value="">Choose a task...</option>
              {tasks.map(task => (
                <option key={task.id} value={task.id}>
                  {task.title} - {task.status}
                </option>
              ))}
            </select>
          </div>

          {/* User Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Assign to User <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedUserEmail}
              onChange={(e) => setSelectedUserEmail(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
              disabled={loading}
            >
              <option value="">Choose a user...</option>
              {users.filter(user => !user.isAdmin).map(user => (
                <option key={user.id} value={user.email}>
                  {user.name} ({user.email})
                </option>
              ))}
            </select>
          </div>

          {/* Assignment Message */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Assignment Message <span className="text-red-500">*</span>
            </label>
            <textarea
              value={assignmentMessage}
              onChange={(e) => setAssignmentMessage(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 resize-none"
              rows="3"
              placeholder="Enter a message for the user (e.g., 'Please complete this task by Friday')"
              disabled={loading}
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition font-medium"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Assigning...
                </div>
              ) : (
                'Assign Task'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}