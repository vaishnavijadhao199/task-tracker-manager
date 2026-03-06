// Initialize demo data in localStorage for first-time users
export const initializeDemoData = () => {
  // Check if data already exists
  if (localStorage.getItem('users')) {
    return; // Data already initialized
  }

  // Demo users
  const demoUsers = [
    {
      id: '1',
      name: 'John Doe',
      email: 'user@example.com',
      password: 'password123',
      isAdmin: false
    },
    {
      id: '2',
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'password123',
      isAdmin: true
    },
    {
      id: '3',
      name: 'Jane Smith',
      email: 'jane@example.com',
      password: 'password123',
      isAdmin: false
    }
  ];

  // Demo tasks
  const demoTasks = [
    {
      id: '101',
      userId: '1',
      title: 'Complete Project Documentation',
      description: 'Write comprehensive documentation for the task manager project including API endpoints and usage examples',
      status: 'pending',
      createdAt: new Date().toISOString()
    },
    {
      id: '102',
      userId: '1',
      title: 'Review Code Changes',
      description: 'Review recent pull requests and provide feedback',
      status: 'completed',
      createdAt: new Date().toISOString()
    },
    {
      id: '103',
      userId: '2',
      title: 'Deploy to Production',
      description: 'Deploy the latest version to the production server',
      status: 'pending',
      createdAt: new Date().toISOString()
    },
    {
      id: '104',
      userId: '3',
      title: 'Test New Features',
      description: 'Perform QA testing on new features',
      status: 'completed',
      createdAt: new Date().toISOString()
    },
    {
      id: '105',
      userId: '1',
      title: 'Update Dependencies',
      description: 'Update npm packages to latest versions',
      status: 'pending',
      createdAt: new Date().toISOString()
    },
    // Unassigned tasks for admin assignment testing
    {
      id: '106',
      title: 'Design New Logo',
      description: 'Create a modern logo for the task management application using design tools like Figma or Adobe Illustrator. The logo should reflect productivity and organization.',
      status: 'pending',
      createdAt: new Date().toISOString()
    },
    {
      id: '107',
      title: 'Write Unit Tests',
      description: 'Implement comprehensive unit tests for the authentication and task management features using Jest and React Testing Library.',
      status: 'pending',
      createdAt: new Date().toISOString()
    },
    {
      id: '108',
      title: 'Database Optimization',
      description: 'Optimize database queries and add proper indexing to improve application performance. Focus on frequently accessed data.',
      status: 'pending',
      createdAt: new Date().toISOString()
    }
  ];

  // Store in localStorage
  localStorage.setItem('users', JSON.stringify(demoUsers));
  localStorage.setItem('tasks', JSON.stringify(demoTasks));

  console.log('✅ Demo data initialized successfully!');
};
