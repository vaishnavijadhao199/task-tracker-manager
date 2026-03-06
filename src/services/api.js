// Mock Database in LocalStorage
const getDB = (key) => JSON.parse(localStorage.getItem(key) || '[]');
const setDB = (key, data) => localStorage.setItem(key, JSON.stringify(data));
const getUsers = () => JSON.parse(localStorage.getItem('users') || '[]');
const setUsers = (data) => localStorage.setItem('users', JSON.stringify(data));

// Helper function to decode token (supports both mock base64 and real JWT)
const decodeToken = (token) => {
  try {
    // Try base64 decoding first (mock mode)
    return JSON.parse(atob(token));
  } catch (e) {
    // Try JWT decoding
    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch (jwtError) {
      throw new Error('Invalid token format');
    }
  }
};

// Helper to simulate network delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Configuration
const API_URL = import.meta.env.VITE_API_URL || null; 
const USE_MOCK = !API_URL; // Fallback to mock if no URL provided

// --- Auth Services ---
export const apiLogin = async (email, password) => {
    if (USE_MOCK) {
        await delay(500);
        const users = getUsers();
        const user = users.find(u => u.email === email && u.password === password);
        if (!user) throw new Error('Invalid credentials');
        
        const token = btoa(JSON.stringify({ id: user.id, email: user.email, isAdmin: user.isAdmin }));
        return { token, user: { ...user, password: undefined } };
    }
    // Real API Call
    const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Error logging in');
    return data;
};

export const apiRegister = async (name, email, password) => {
    if (USE_MOCK) {
        await delay(500);
        const users = getUsers();
        if (users.find(u => u.email === email)) throw new Error('User already exists');
        
        const newUser = {
            id: Date.now().toString(),
            name,
            email,
            password, // In real app, backend handles hashing
            isAdmin: false
        };
        users.push(newUser);
        setUsers(users);
        
        const token = btoa(JSON.stringify({ id: newUser.id, email: newUser.email }));
        return { token, user: { ...newUser, password: undefined } };
    }
    // Real API Call
    const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Error registering');
    return data;
};

// --- Task Services ---
export const apiGetTasks = async (token) => {
    if (USE_MOCK) {
        await delay(300);
        const tasks = getDB('tasks');
        const user = decodeToken(token);
        
        if (user.isAdmin) return tasks;
        return tasks.filter(t => t.userId === user.id);
    }
    // Real API Call
    const res = await fetch(`${API_URL}/tasks`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
};

export const apiCreateTask = async (task, token) => {
    if (USE_MOCK) {
        await delay(300);
        const tasks = getDB('tasks');
        const user = decodeToken(token);
        const newTask = { 
            id: Date.now().toString(), 
            ...task, 
            userId: user.id,
            createdAt: new Date().toISOString()
        };
        tasks.push(newTask);
        setDB('tasks', tasks);
        return newTask;
    }
    // Real API
    const res = await fetch(`${API_URL}/tasks`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(task)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
};

export const apiUpdateTask = async (id, updates, token) => {
    if (USE_MOCK) {
        await delay(300);
        let tasks = getDB('tasks');
        const index = tasks.findIndex(t => t.id === id);
        if (index === -1) throw new Error('Task not found');
        
        tasks[index] = { ...tasks[index], ...updates };
        setDB('tasks', tasks);
        return tasks[index];
    }
    // Real API
    const res = await fetch(`${API_URL}/tasks/${id}`, {
        method: 'PUT',
        headers: { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(updates)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
};

export const apiDeleteTask = async (id, token) => {
    if (USE_MOCK) {
        await delay(300);
        let tasks = getDB('tasks');
        tasks = tasks.filter(t => t.id !== id);
        setDB('tasks', tasks);
        return { success: true };
    }
    // Real API
    const res = await fetch(`${API_URL}/tasks/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
};

export const apiGetUsers = async (token) => {
    if (USE_MOCK) {
        await delay(300);
        const currentUser = decodeToken(token);
        if (!currentUser.isAdmin) throw new Error('Unauthorized');
        return getUsers().map(u => ({ ...u, password: undefined }));
    }
    // Real API
    const res = await fetch(`${API_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
};

export const apiAssignTask = async (taskId, userEmail, assignmentMessage, token) => {
    if (USE_MOCK) {
        await delay(300);
        const currentUser = decodeToken(token);
        if (!currentUser.isAdmin) throw new Error('Unauthorized: Only admins can assign tasks');
        
        const tasks = getDB('tasks');
        const users = getUsers();
        const taskIndex = tasks.findIndex(t => t.id === taskId);
        const user = users.find(u => u.email === userEmail);
        
        if (taskIndex === -1) throw new Error('Task not found');
        if (!user) throw new Error('User not found');
        
        tasks[taskIndex] = {
            ...tasks[taskIndex],
            userId: user.id,
            assignedBy: currentUser.email,
            assignmentMessage: assignmentMessage,
            assignedAt: new Date().toISOString()
        };
        
        setDB('tasks', tasks);
        return tasks[taskIndex];
    }
    // Real API
    const res = await fetch(`${API_URL}/tasks/${taskId}/assign`, {
        method: 'PUT',
        headers: { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ userEmail, assignmentMessage })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
};