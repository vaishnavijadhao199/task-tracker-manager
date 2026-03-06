import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export default function TaskModal({ isOpen, onClose, onSave, task }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('pending');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setStatus(task.status || 'pending');
      setErrors({});
    } else {
      resetForm();
    }
  }, [task, isOpen]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setStatus('pending');
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};

    if (!title.trim()) {
      newErrors.title = 'Task title is required';
    } else if (title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    } else if (title.length > 100) {
      newErrors.title = 'Title must not exceed 100 characters';
    }

    if (description.length > 500) {
      newErrors.description = 'Description must not exceed 500 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors');
      return;
    }

    setIsSubmitting(true);
    try {
      onSave({ title: title.trim(), description: description.trim(), status });
      resetForm();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-4 border-b flex justify-between items-center">
          <h3 className="text-lg font-bold text-white">
            {task ? '✏️ Edit Task' : '➕ Create New Task'}
          </h3>
          <button 
            onClick={onClose} 
            className="text-indigo-200 hover:text-white text-2xl transition"
            disabled={isSubmitting}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Title Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Task Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) setErrors({...errors, title: ''});
              }}
              maxLength="100"
              className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none transition ${
                errors.title 
                  ? 'border-red-500 focus:ring-red-500 bg-red-50' 
                  : 'border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200'
              }`}
              placeholder="Enter task title"
              disabled={isSubmitting}
            />
            {errors.title && (
              <p className="text-red-500 text-xs mt-1">⚠️ {errors.title}</p>
            )}
            <p className="text-gray-500 text-xs mt-1">{title.length}/100</p>
          </div>

          {/* Description Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description <span className="text-gray-400">(Optional)</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (errors.description) setErrors({...errors, description: ''});
              }}
              maxLength="500"
              rows="4"
              className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none transition resize-none ${
                errors.description
                  ? 'border-red-500 focus:ring-red-500 bg-red-50'
                  : 'border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200'
              }`}
              placeholder="Add a detailed description of your task"
              disabled={isSubmitting}
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">⚠️ {errors.description}</p>
            )}
            <p className="text-gray-500 text-xs mt-1">{description.length}/500</p>
          </div>

          {/* Status Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Status <span className="text-red-500">*</span>
            </label>
            <select 
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 bg-white transition"
              disabled={isSubmitting}
            >
              <option value="pending">⏳ Pending</option>
              <option value="completed">✓ Completed</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium disabled:opacity-50"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : task ? 'Update Task' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}