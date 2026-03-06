import { useState, useEffect } from 'react';
import TaskModal from '../components/TaskModal';
import AdminTaskModal from '../components/AdminTaskModal';
import { useAuth } from '../context/AuthContext';
import * as api from '../services/api';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const { user, token } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const taskData = await api.apiGetTasks(token);
      setTasks(taskData);
      
      if (user?.isAdmin) {
        const userData = await api.apiGetUsers(token);
        setUsers(userData);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [token, user]);

  const handleSaveTask = async (taskData) => {
    try {
      if (editingTask) {
        await api.apiUpdateTask(editingTask.id, taskData, token);
        toast.success('Task updated successfully!');
      } else {
        await api.apiCreateTask(taskData, token);
        toast.success('Task created successfully!');
      }
      setIsModalOpen(false);
      setEditingTask(null);
      loadData();
    } catch (err) {
      toast.error(err.message || 'Failed to save task');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await api.apiDeleteTask(id, token);
      toast.success('Task deleted successfully!');
      loadData();
    } catch (err) {
      toast.error(err.message || 'Failed to delete task');
    }
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const openCreateModal = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  // Filter and search tasks
  let filteredTasks = tasks;
  if (filterStatus !== 'all') {
    filteredTasks = filteredTasks.filter(t => t.status === filterStatus);
  }
  if (searchTerm) {
    filteredTasks = filteredTasks.filter(t => 
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.description && t.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }

  const completedCount = tasks.filter(t => t.status === 'completed').length;
  const pendingCount = tasks.filter(t => t.status === 'pending').length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header Card with User Info */}
        <div className="mb-8 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white p-8 rounded-xl shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">Welcome, {user?.name || user?.email}!</h1>
              <p className="text-indigo-100 mt-2">Manage and track your tasks efficiently</p>
            </div>
            <div className="flex items-center gap-3 bg-white bg-opacity-20 px-4 py-2 rounded-lg w-fit">
              <span className="text-sm font-semibold">Role:</span>
              <span className="px-3 py-1 bg-white text-indigo-600 rounded-full text-sm font-bold">
                {user?.isAdmin ? '👑 Admin' : '👤 User'}
              </span>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition">
            <div className="text-indigo-600 text-3xl font-bold">{tasks.length}</div>
            <div className="text-gray-600 text-sm mt-1">Total Tasks</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition">
            <div className="text-green-600 text-3xl font-bold">{completedCount}</div>
            <div className="text-gray-600 text-sm mt-1">Completed</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition">
            <div className="text-yellow-600 text-3xl font-bold">{pendingCount}</div>
            <div className="text-gray-600 text-sm mt-1">Pending</div>
          </div>
          {user?.isAdmin && (
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition">
              <div className="text-purple-600 text-3xl font-bold">{users.length}</div>
              <div className="text-gray-600 text-sm mt-1">Total Users</div>
            </div>
          )}
        </div>

        {/* Admin Section: Users List */}
        {user?.isAdmin && (
          <div className="mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              👥 All Users <span className="text-sm bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full">{users.length}</span>
            </h2>
            {users.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No users found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left font-semibold text-gray-700">Name</th>
                      <th className="px-6 py-3 text-left font-semibold text-gray-700">Email</th>
                      <th className="px-6 py-3 text-left font-semibold text-gray-700">Role</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {users.map(u => (
                      <tr key={u.id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-3 font-medium text-gray-900">{u.name || 'N/A'}</td>
                        <td className="px-6 py-3 text-gray-600">{u.email}</td>
                        <td className="px-6 py-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            u.isAdmin 
                              ? 'bg-purple-100 text-purple-700' 
                              : 'bg-blue-100 text-blue-700'
                          }`}>
                            {u.isAdmin ? 'Admin' : 'User'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Admin Section: Task Assignment */}
        {user?.isAdmin && (
          <div className="mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                👑 Task Assignment Center
                <span className="text-sm bg-purple-100 text-purple-700 px-3 py-1 rounded-full">Admin Only</span>
              </h2>
              <button 
                onClick={() => setIsAdminModalOpen(true)}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium flex items-center gap-2 justify-center sm:justify-start w-full sm:w-auto"
              >
                <span>📋</span> Assign Task
              </button>
            </div>
            
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-4 rounded-lg border border-purple-200">
              <p className="text-purple-800 text-sm">
                <strong>Admin Feature:</strong> Assign unassigned tasks to team members. Only tasks without an assigned user will appear in the assignment modal.
              </p>
            </div>
          </div>
        )}

        {/* Tasks Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              📋 {user?.isAdmin ? 'All Tasks' : 'My Tasks'} 
              <span className="text-sm bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full">{filteredTasks.length}</span>
            </h2>
            <button 
              onClick={openCreateModal}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium flex items-center gap-2 justify-center sm:justify-start w-full sm:w-auto"
            >
              <span>+</span> Add Task
            </button>
          </div>

          {/* Search and Filter */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <input 
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* Tasks List */}
          {filteredTasks.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
              <p className="text-gray-500 text-lg">
                {searchTerm || filterStatus !== 'all' ? '📭 No tasks match your criteria' : '📭 No tasks yet. Create one to get started!'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTasks.map(task => (
                <div 
                  key={task.id} 
                  className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition bg-gradient-to-r from-white to-gray-50"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`px-3 py-1 text-xs rounded-full font-bold ${
                          task.status === 'completed' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {task.status === 'completed' ? '✓ Completed' : '⏳ Pending'}
                        </span>
                        <h3 className="font-bold text-gray-800 text-lg">{task.title}</h3>
                      </div>
                      <p className="text-gray-600 text-sm">{task.description || 'No description provided'}</p>
                      {user?.isAdmin && task.assignedBy && (
                        <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-xs">
                          <p className="text-blue-800">
                            <strong>Assigned by:</strong> {task.assignedBy}
                            {task.assignedAt && ` on ${new Date(task.assignedAt).toLocaleDateString()}`}
                          </p>
                          {task.assignmentMessage && (
                            <p className="text-blue-700 mt-1 italic">"{task.assignmentMessage}"</p>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 sm:flex-shrink-0">
                      <button 
                        onClick={() => openEditModal(task)}
                        className="px-4 py-2 text-sm font-medium text-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-50 transition"
                      >
                        ✏️ Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(task.id)}
                        className="px-4 py-2 text-sm font-medium text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Task Modal */}
      <TaskModal 
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTask(null);
        }}
        onSave={handleSaveTask}
        task={editingTask}
      />

      {/* Admin Task Assignment Modal */}
      <AdminTaskModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        users={users}
        onTaskAssigned={loadData}
      />
    </div>
  );
}