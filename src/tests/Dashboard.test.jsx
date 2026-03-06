import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from '../src/pages/Dashboard';
import { AuthContext } from '../src/context/AuthContext';
import * as api from '../src/services/api';
import { vi } from 'vitest';

vi.mock('../src/services/api');

test('Dashboard renders tasks for normal user', async () => {
  const mockUser = { id: '1', email: 'user@test.com', isAdmin: false };
  const mockTasks = [
    { id: 't1', title: 'Test Task 1', description: 'Desc', status: 'pending', userId: '1' }
  ];

  api.apiGetTasks.mockResolvedValue(mockTasks);
  api.apiGetUsers.mockResolvedValue([]); // Should not be called but safe to mock

  render(
    <BrowserRouter>
      <AuthContext.Provider value={{ user: mockUser, token: 'fake-token', loading: false }}>
        <Dashboard />
      </AuthContext.Provider>
    </BrowserRouter>
  );

  // Wait for loading to finish and data to appear
  await waitFor(() => {
    expect(screen.getByText('Test Task 1')).toBeInTheDocument();
  });
  
  // Admin section should not exist
  expect(screen.queryByText('All Users')).not.toBeInTheDocument();
});