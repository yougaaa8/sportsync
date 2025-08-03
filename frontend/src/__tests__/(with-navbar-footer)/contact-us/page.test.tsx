import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import ContactUs from '../../../app/(with-navbar-footer)/contact-us/page';

// Mock Material-UI theme
const theme = createTheme();

// Helper function to render component with theme
const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={theme}>
      {component}
    </ThemeProvider>
  );
};

// Mock alert function
const mockAlert = jest.fn();
global.alert = mockAlert;

describe('ContactUs Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(async () => {
    await act(async () => {
      jest.runOnlyPendingTimers();
    });
    jest.useRealTimers();
  });

  describe('Initial Render', () => {
    test('renders contact form with all required elements', () => {
      renderWithTheme(<ContactUs />);
      
      // Check header
      expect(screen.getByText('Contact SportSync')).toBeInTheDocument();
      expect(screen.getByText(/Have questions or feedback/)).toBeInTheDocument();
      
      // Check contact info section
      expect(screen.getByText('Get in Touch')).toBeInTheDocument();
      expect(screen.getByText('E1398508@u.nus.edu')).toBeInTheDocument();
      expect(screen.getByText('National University of Singapore')).toBeInTheDocument();
      
      // Check form section
      expect(screen.getByText('Send us a Message')).toBeInTheDocument();
      expect(screen.getByLabelText(/Name/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Email/)).toBeInTheDocument();
      expect(screen.getByRole('combobox')).toBeInTheDocument();
      expect(screen.getByLabelText(/Message/)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Send Message/ })).toBeInTheDocument();
    });

    test('form fields are initially empty', () => {
      renderWithTheme(<ContactUs />);
      
      expect(screen.getByLabelText(/Name/)).toHaveValue('');
      expect(screen.getByLabelText(/Email/)).toHaveValue('');
      expect(screen.getByLabelText(/Message/)).toHaveValue('');
    });
  });

  describe('Form Input', () => {
    test('allows user to type in name field', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      renderWithTheme(<ContactUs />);
      
      const nameField = screen.getByLabelText(/Name/);
      await user.type(nameField, 'John Doe');
      
      expect(nameField).toHaveValue('John Doe');
    });

    test('allows user to type in email field', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      renderWithTheme(<ContactUs />);
      
      const emailField = screen.getByLabelText(/Email/);
      await user.type(emailField, 'john.doe@u.nus.edu');
      
      expect(emailField).toHaveValue('john.doe@u.nus.edu');
    });

    test('displays subject dropdown options when clicked', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      renderWithTheme(<ContactUs />);
      
      // Find the Select component by its role
      const subjectField = screen.getByRole('combobox');
      await user.click(subjectField);
      
      // Check that dropdown options are displayed
      expect(screen.getByText('Bug Report')).toBeInTheDocument();
      expect(screen.getByText('Feature Request')).toBeInTheDocument();
      expect(screen.getByText('Technical Support')).toBeInTheDocument();
    });

    test('allows user to type in message field', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      renderWithTheme(<ContactUs />);
      
      const messageField = screen.getByLabelText(/Message/);
      await user.type(messageField, 'This is a test message');
      
      expect(messageField).toHaveValue('This is a test message');
    });
  });

  describe('Form Validation', () => {
    test('shows alert when submitting empty form', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      renderWithTheme(<ContactUs />);
      
      const submitButton = screen.getByRole('button', { name: /Send Message/ });
      await user.click(submitButton);
      
      expect(mockAlert).toHaveBeenCalledWith('Please fill in all required fields');
    });

    test('shows alert when required fields are missing', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      renderWithTheme(<ContactUs />);
      
      // Fill only name field
      await user.type(screen.getByLabelText(/Name/), 'John Doe');
      
      const submitButton = screen.getByRole('button', { name: /Send Message/ });
      await user.click(submitButton);
      
      expect(mockAlert).toHaveBeenCalledWith('Please fill in all required fields');
    });
  });

  describe('Form Submission', () => {
    // Use the correct type for userEvent instance returned by userEvent.setup()
    const fillCompleteForm = async (user: ReturnType<typeof userEvent.setup>) => {
      await user.type(screen.getByLabelText(/Name/), 'John Doe');
      await user.type(screen.getByLabelText(/Email/), 'john.doe@u.nus.edu');
      const subjectField = screen.getByRole('combobox');
      await user.click(subjectField);
      await user.click(screen.getByText('Bug Report'));
      await user.type(screen.getByLabelText(/Message/), 'This is a test message for bug report');
    };

    test('shows loading state when submitting valid form', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      renderWithTheme(<ContactUs />);
      
      await fillCompleteForm(user);
      
      const submitButton = screen.getByRole('button', { name: /Send Message/ });
      await user.click(submitButton);
      
      expect(screen.getByText('Sending...')).toBeInTheDocument();
      expect(submitButton).toBeDisabled();
    });

    test('shows success message after successful submission', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      renderWithTheme(<ContactUs />);
      
      await fillCompleteForm(user);
      
      const submitButton = screen.getByRole('button', { name: /Send Message/ });
      await user.click(submitButton);
      
      // Use act to wrap timer advancement
      await act(async () => {
        jest.advanceTimersByTime(1500);
      });
      
      await waitFor(() => {
        expect(screen.getByText('Message Sent Successfully!')).toBeInTheDocument();
      });
      
      expect(screen.getByText(/Thank you for contacting SportSync/)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Send Another Message/ })).toBeInTheDocument();
    });

    test('allows returning to form from success page', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      renderWithTheme(<ContactUs />);
      
      await fillCompleteForm(user);
      
      const submitButton = screen.getByRole('button', { name: /Send Message/ });
      await user.click(submitButton);
      
      await act(async () => {
        jest.advanceTimersByTime(1500);
      });
      
      await waitFor(() => {
        expect(screen.getByText('Message Sent Successfully!')).toBeInTheDocument();
      });
      
      const sendAnotherButton = screen.getByRole('button', { name: /Send Another Message/ });
      await user.click(sendAnotherButton);
      
      // Should be back on the form page
      expect(screen.getByText('Send us a Message')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Send Message/ })).toBeInTheDocument();
      
      // Check that form fields are cleared
      expect(screen.getByLabelText(/Name/)).toHaveValue('');
      expect(screen.getByLabelText(/Email/)).toHaveValue('');
      expect(screen.getByLabelText(/Message/)).toHaveValue('');
    });
  });
});