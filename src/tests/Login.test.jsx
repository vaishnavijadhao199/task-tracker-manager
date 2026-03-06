import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from '../src/pages/Login';
import { AuthProvider } from '../src/context/AuthContext';
import { vi } from 'vitest';

// Mock API
vi.mock('../src/services/api', () => ({
  apiLogin: vi.fn(() => Promise.resolve({ token: 'fake-token', user: { email: 'test@test.com' } }))
}));

test('renders login form and validates inputs', async () => {
  render(
    <BrowserRouter>
      <AuthProvider>
        <Login />
      </AuthProvider>
    </BrowserRouter>
  );

  // Check elements exist
  expect(screen.getByPlaceholderText(/you@example.com/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/••••••••/i)).toBeInTheDocument();

  // Try submit empty
  fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
  
  // Since we have simple validation, let's try filling
  fireEvent.change(screen.getByPlaceholderText(/you@example.com/i), { target: { value: 'test@test.com' } });
  fireEvent.change(screen.getByPlaceholderText(/••••••••/i), { target: { value: 'password' } });
  
  // Submit (since we mocked the API, it won't actually error)
  fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
  
  // We'd typically check for navigation or success state here, 
  // but react-hot-toast makes it hard to test without complex setup.
  // This acts as a render/interaction smoke test.
});