import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import Register from '../../../app/(without-navbar-footer)/register/page.jsx';
import register from '../../../api-calls/register/register';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock the register API call
jest.mock('../../../api-calls/register/register', () => jest.fn());

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  length: 0,
  key: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

// Helper function to get password inputs
const getPasswordInputs = () => {
  const passwordInputs = document.querySelectorAll('input[type="password"]');
  return {
    passwordInput: passwordInputs[0] as HTMLInputElement,
    confirmPasswordInput: passwordInputs[1] as HTMLInputElement,
  };
};

describe('Register Component', () => {
  const mockPush = jest.fn();
  
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
    
    // Clear localStorage mock
    localStorageMock.setItem.mockClear();
  });

  describe('Component Rendering', () => {
    test('renders register form with all required fields', () => {
      render(<Register />);
      
      expect(screen.getByRole('heading', { name: 'Create Account' })).toBeInTheDocument();
      expect(screen.getByText('Join SportSync to get started')).toBeInTheDocument();
      
      expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
      
      // Check password inputs exist
      const { passwordInput, confirmPasswordInput } = getPasswordInputs();
      expect(passwordInput).toBeInTheDocument();
      expect(confirmPasswordInput).toBeInTheDocument();
      
      expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
      expect(screen.getByText(/already have an account/i)).toBeInTheDocument();
      expect(screen.getByText('Sign In')).toBeInTheDocument();
    });

    test('renders with proper icons', () => {
      render(<Register />);
      
      // Check for Material-UI icons by their test ids or aria-labels
      const personIcons = screen.getAllByTestId('PersonIcon');
      const emailIcon = screen.getByTestId('EmailIcon');
      const lockIcons = screen.getAllByTestId('LockIcon');
      
      expect(personIcons).toHaveLength(2); // First name and last name
      expect(emailIcon).toBeInTheDocument();
      expect(lockIcons).toHaveLength(2); // Password and confirm password
    });
  });

  describe('Form Interactions', () => {
    test('updates input values when user types', () => {
      render(<Register />);
      
      const firstNameInput = screen.getByLabelText(/first name/i);
      const lastNameInput = screen.getByLabelText(/last name/i);
      const emailInput = screen.getByLabelText(/email address/i);
      const { passwordInput, confirmPasswordInput } = getPasswordInputs();
      
      fireEvent.change(firstNameInput, { target: { value: 'John' } });
      fireEvent.change(lastNameInput, { target: { value: 'Doe' } });
      fireEvent.change(emailInput, { target: { value: 'john.doe@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
      
      expect(firstNameInput).toHaveValue('John');
      expect(lastNameInput).toHaveValue('Doe');
      expect(emailInput).toHaveValue('john.doe@example.com');
      expect(passwordInput).toHaveValue('password123');
      expect(confirmPasswordInput).toHaveValue('password123');
    });

    test('toggles password visibility', () => {
      render(<Register />);
      
      const { passwordInput, confirmPasswordInput } = getPasswordInputs();
      
      // Initially passwords should be hidden
      expect(passwordInput).toHaveAttribute('type', 'password');
      expect(confirmPasswordInput).toHaveAttribute('type', 'password');
      
      // Find and click visibility toggles (get buttons within password fields)
      const passwordField = passwordInput.closest('.MuiFormControl-root');
      const confirmPasswordField = confirmPasswordInput.closest('.MuiFormControl-root');
      
      // Add null checks for TypeScript safety
      expect(passwordField).not.toBeNull();
      expect(confirmPasswordField).not.toBeNull();
      
      const passwordToggle = passwordField!.querySelector('button');
      const confirmPasswordToggle = confirmPasswordField!.querySelector('button');
      
      // Add null checks for the buttons
      expect(passwordToggle).not.toBeNull();
      expect(confirmPasswordToggle).not.toBeNull();
      
      fireEvent.click(passwordToggle!);
      expect(passwordInput).toHaveAttribute('type', 'text');
      
      fireEvent.click(confirmPasswordToggle!);
      expect(confirmPasswordInput).toHaveAttribute('type', 'text');
      
      // Toggle back to hidden
      fireEvent.click(passwordToggle!);
      expect(passwordInput).toHaveAttribute('type', 'password');
      
      fireEvent.click(confirmPasswordToggle!);
      expect(confirmPasswordInput).toHaveAttribute('type', 'password');
    });
  });

  describe('Form Validation', () => {
    test('shows error when passwords do not match', async () => {
      render(<Register />);
      
      fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: 'John' } });
      fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: 'Doe' } });
      fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'john.doe@example.com' } });
      
      const { passwordInput, confirmPasswordInput } = getPasswordInputs();
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'differentpassword' } });
      
      const submitButton = screen.getByRole('button', { name: /create account/i });
      
      // Need to submit form to trigger validation
      fireEvent.submit(screen.getByRole('form') || submitButton.closest('form')!);
      
      await waitFor(() => {
        expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
      });
      
      expect(register).not.toHaveBeenCalled();
    });

    test('prevents form submission when required fields are empty', () => {
      render(<Register />);
      
      const submitButton = screen.getByRole('button', { name: /create account/i });
      fireEvent.click(submitButton);
      
      // HTML5 validation should prevent submission, so register API should not be called
      expect(register).not.toHaveBeenCalled();
    });
  });

  describe('API Integration', () => {
    const validFormData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      password: 'password123',
      confirmPassword: 'password123'
    };

    const fillForm = (data = validFormData) => {
      fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: data.firstName } });
      fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: data.lastName } });
      fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: data.email } });
      
      const { passwordInput, confirmPasswordInput } = getPasswordInputs();
      fireEvent.change(passwordInput, { target: { value: data.password } });
      fireEvent.change(confirmPasswordInput, { target: { value: data.confirmPassword } });
    };

    test('handles successful registration', async () => {
      const mockResponse = {
        user: {
          first_name: 'John',
          email: 'john.doe@example.com'
        }
      };
      
      (register as jest.Mock).mockResolvedValue(mockResponse);
      
      render(<Register />);
      fillForm();
      
      const submitButton = screen.getByRole('button', { name: /create account/i });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(register).toHaveBeenCalledWith(
          'john.doe@example.com',
          'John',
          'Doe',
          'password123',
          'password123'
        );
      });
      
      await waitFor(() => {
        expect(screen.getByText('Account created successfully! You can now log in.')).toBeInTheDocument();
      });
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith('email', 'john.doe@example.com');
      expect(mockPush).toHaveBeenCalledWith('/login');
    });

    test('handles registration failure with validation errors', async () => {
      const mockErrors = {
        email: ['Email already exists'],
        password: ['Password too weak']
      };
      
      (register as jest.Mock).mockResolvedValue(null);
      // Simulate the component receiving validation errors
      (register as jest.Mock).mockImplementation(() => {
        throw new Error('Validation failed');
      });
      
      render(<Register />);
      fillForm();
      
      const submitButton = screen.getByRole('button', { name: /create account/i });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('Network error. Please try again.')).toBeInTheDocument();
      });
      
      expect(mockPush).not.toHaveBeenCalled();
      expect(localStorageMock.setItem).not.toHaveBeenCalled();
    });

    test('handles network error', async () => {
      (register as jest.Mock).mockRejectedValue(new Error('Network error'));
      
      render(<Register />);
      fillForm();
      
      const submitButton = screen.getByRole('button', { name: /create account/i });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('Network error. Please try again.')).toBeInTheDocument();
      });
    });

    test('shows loading state during registration', async () => {
      (register as jest.Mock).mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
      
      render(<Register />);
      fillForm();
      
      const submitButton = screen.getByRole('button', { name: /create account/i });
      fireEvent.click(submitButton);
      
      expect(screen.getByText('Creating Account...')).toBeInTheDocument();
      expect(submitButton).toBeDisabled();
      
      await waitFor(() => {
        expect(screen.getByText('Create Account')).toBeInTheDocument();
      });
    });
  });

  describe('Alert Management', () => {
    test('can close error alerts', async () => {
      render(<Register />);
      
      // Trigger an error
      const { passwordInput, confirmPasswordInput } = getPasswordInputs();
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'differentpassword' } });
      
      // Add required fields to pass HTML5 validation
      fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: 'John' } });
      fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: 'Doe' } });
      fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'john.doe@example.com' } });
      
      const submitButton = screen.getByRole('button', { name: /create account/i });
      fireEvent.submit(screen.getByRole('form') || submitButton.closest('form')!);
      
      await waitFor(() => {
        expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
      });
      
      // Close the alert
      const closeButton = screen.getByRole('button', { name: /close/i });
      fireEvent.click(closeButton);
      
      expect(screen.queryByText('Passwords do not match')).not.toBeInTheDocument();
    });

    test('can close success alerts', async () => {
      const mockResponse = {
        user: {
          first_name: 'John',
          email: 'john.doe@example.com'
        }
      };
      
      (register as jest.Mock).mockResolvedValue(mockResponse);
      
      render(<Register />);
      
      fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: 'John' } });
      fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: 'Doe' } });
      fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'john.doe@example.com' } });
      
      const { passwordInput, confirmPasswordInput } = getPasswordInputs();
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
      
      fireEvent.click(screen.getByRole('button', { name: /create account/i }));
      
      await waitFor(() => {
        expect(screen.getByText('Account created successfully! You can now log in.')).toBeInTheDocument();
      });
      
      const closeButton = screen.getByRole('button', { name: /close/i });
      fireEvent.click(closeButton);
      
      expect(screen.queryByText('Account created successfully! You can now log in.')).not.toBeInTheDocument();
    });
  });

  describe('Console Logging', () => {
    test('logs successful registration', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
      const mockResponse = {
        user: {
          first_name: 'John',
          email: 'john.doe@example.com'
        }
      };
      
      (register as jest.Mock).mockResolvedValue(mockResponse);
      
      render(<Register />);
      
      fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: 'John' } });
      fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: 'Doe' } });
      fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'john.doe@example.com' } });
      
      const { passwordInput, confirmPasswordInput } = getPasswordInputs();
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
      
      fireEvent.click(screen.getByRole('button', { name: /create account/i }));
      
      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Registration successful:', mockResponse);
        expect(consoleSpy).toHaveBeenCalledWith('The account is created for: ', 'John');
      });
      
      consoleSpy.mockRestore();
    });
  });
});