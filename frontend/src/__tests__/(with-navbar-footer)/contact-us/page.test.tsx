import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import ContactUs from './ContactUs';

// Mock Material-UI theme for testing
const theme = createTheme();

// Wrapper component with theme provider
const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={theme}>
      {component}
    </ThemeProvider>
  );
};

// Mock window.alert
const mockAlert = jest.fn();
global.alert = mockAlert;

describe('ContactUs Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  describe('Initial Render', () => {
    it('renders the contact form with all required elements', () => {
      renderWithTheme(<ContactUs />);

      // Check main heading
      expect(screen.getByText('Contact SportSync')).toBeInTheDocument();
      expect(screen.getByText(/Have questions or feedback/)).toBeInTheDocument();

      // Check contact info section
      expect(screen.getByText('Get in Touch')).toBeInTheDocument();
      expect(screen.getByText('E1398508@u.nus.edu')).toBeInTheDocument();
      expect(screen.getByText('National University of Singapore')).toBeInTheDocument();
      expect(screen.getByText('Made Yoga Chantiswara')).toBeInTheDocument();
      expect(screen.getByText('Alexander Gerald')).toBeInTheDocument();

      // Check form section
      expect(screen.getByText('Send us a Message')).toBeInTheDocument();
      expect(screen.getByLabelText(/Name/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Email/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Subject/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Message/)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Send Message' })).toBeInTheDocument();
    });

    it('renders contact info icons correctly', () => {
      renderWithTheme(<ContactUs />);

      // Check for avatars containing icons (MUI renders icons inside avatars)
      const avatars = screen.getAllByRole('img');
      expect(avatars).toHaveLength(3); // Email, Location, Group icons
    });
  });

  describe('Form Interactions', () => {
    it('updates form fields when user types', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      renderWithTheme(<ContactUs />);

      const nameInput = screen.getByLabelText(/Name/);
      const emailInput = screen.getByLabelText(/Email/);
      const messageInput = screen.getByLabelText(/Message/);

      await user.type(nameInput, 'John Doe');
      await user.type(emailInput, 'john@example.com');
      await user.type(messageInput, 'This is a test message');

      expect(nameInput).toHaveValue('John Doe');
      expect(emailInput).toHaveValue('john@example.com');
      expect(messageInput).toHaveValue('This is a test message');
    });

    it('updates subject field when user selects an option', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      renderWithTheme(<ContactUs />);

      // Click on the subject select field
      const subjectSelect = screen.getByLabelText(/Subject/);
      await user.click(subjectSelect);

      // Select bug report option
      const bugReportOption = screen.getByText('Bug Report');
      await user.click(bugReportOption);

      expect(subjectSelect).toHaveTextContent('Bug Report');
    });

    it('renders all subject options correctly', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      renderWithTheme(<ContactUs />);

      const subjectSelect = screen.getByLabelText(/Subject/);
      await user.click(subjectSelect);

      expect(screen.getByText('Bug Report')).toBeInTheDocument();
      expect(screen.getByText('Feature Request')).toBeInTheDocument();
      expect(screen.getByText('CCA Partnership')).toBeInTheDocument();
      expect(screen.getByText('Technical Support')).toBeInTheDocument();
      expect(screen.getByText('General Inquiry')).toBeInTheDocument();
      expect(screen.getByText('Other')).toBeInTheDocument();
    });
  });

  describe('Form Validation', () => {
    it('shows alert when trying to submit with empty required fields', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      renderWithTheme(<ContactUs />);

      const submitButton = screen.getByRole('button', { name: 'Send Message' });
      await user.click(submitButton);

      expect(mockAlert).toHaveBeenCalledWith('Please fill in all required fields');
    });

    it('shows alert when name is missing', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      renderWithTheme(<ContactUs />);

      // Fill all fields except name
      await user.type(screen.getByLabelText(/Email/), 'test@example.com');
      await user.click(screen.getByLabelText(/Subject/));
      await user.click(screen.getByText('Bug Report'));
      await user.type(screen.getByLabelText(/Message/), 'Test message');

      const submitButton = screen.getByRole('button', { name: 'Send Message' });
      await user.click(submitButton);

      expect(mockAlert).toHaveBeenCalledWith('Please fill in all required fields');
    });

    it('shows alert when email is missing', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      renderWithTheme(<ContactUs />);

      // Fill all fields except email
      await user.type(screen.getByLabelText(/Name/), 'John Doe');
      await user.click(screen.getByLabelText(/Subject/));
      await user.click(screen.getByText('Bug Report'));
      await user.type(screen.getByLabelText(/Message/), 'Test message');

      const submitButton = screen.getByRole('button', { name: 'Send Message' });
      await user.click(submitButton);

      expect(mockAlert).toHaveBeenCalledWith('Please fill in all required fields');
    });

    it('shows alert when subject is missing', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      renderWithTheme(<ContactUs />);

      // Fill all fields except subject
      await user.type(screen.getByLabelText(/Name/), 'John Doe');
      await user.type(screen.getByLabelText(/Email/), 'test@example.com');
      await user.type(screen.getByLabelText(/Message/), 'Test message');

      const submitButton = screen.getByRole('button', { name: 'Send Message' });
      await user.click(submitButton);

      expect(mockAlert).toHaveBeenCalledWith('Please fill in all required fields');
    });

    it('shows alert when message is missing', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      renderWithTheme(<ContactUs />);

      // Fill all fields except message
      await user.type(screen.getByLabelText(/Name/), 'John Doe');
      await user.type(screen.getByLabelText(/Email/), 'test@example.com');
      await user.click(screen.getByLabelText(/Subject/));
      await user.click(screen.getByText('Bug Report'));

      const submitButton = screen.getByRole('button', { name: 'Send Message' });
      await user.click(submitButton);

      expect(mockAlert).toHaveBeenCalledWith('Please fill in all required fields');
    });
  });

  describe('Form Submission', () => {
    it('shows loading state during submission', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      renderWithTheme(<ContactUs />);

      // Fill all required fields
      await user.type(screen.getByLabelText(/Name/), 'John Doe');
      await user.type(screen.getByLabelText(/Email/), 'test@example.com');
      await user.click(screen.getByLabelText(/Subject/));
      await user.click(screen.getByText('Bug Report'));
      await user.type(screen.getByLabelText(/Message/), 'Test message');

      const submitButton = screen.getByRole('button', { name: 'Send Message' });
      await user.click(submitButton);

      // Check loading state
      expect(screen.getByText('Sending...')).toBeInTheDocument();
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
      expect(submitButton).toBeDisabled();
    });

    it('shows success message after successful submission', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      renderWithTheme(<ContactUs />);

      // Fill all required fields
      await user.type(screen.getByLabelText(/Name/), 'John Doe');
      await user.type(screen.getByLabelText(/Email/), 'test@example.com');
      await user.click(screen.getByLabelText(/Subject/));
      await user.click(screen.getByText('Bug Report'));
      await user.type(screen.getByLabelText(/Message/), 'Test message');

      const submitButton = screen.getByRole('button', { name: 'Send Message' });
      await user.click(submitButton);

      // Fast-forward the timer to complete the submission
      jest.advanceTimersByTime(1500);

      await waitFor(() => {
        expect(screen.getByText('Message Sent Successfully!')).toBeInTheDocument();
        expect(screen.getByText(/Thank you for contacting SportSync/)).toBeInTheDocument();
        expect(screen.getByText(/We'll get back to you within 24 hours/)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Send Another Message' })).toBeInTheDocument();
      });
    });

    it('clears form after successful submission', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      renderWithTheme(<ContactUs />);

      // Fill all required fields
      await user.type(screen.getByLabelText(/Name/), 'John Doe');
      await user.type(screen.getByLabelText(/Email/), 'test@example.com');
      await user.click(screen.getByLabelText(/Subject/));
      await user.click(screen.getByText('Bug Report'));
      await user.type(screen.getByLabelText(/Message/), 'Test message');

      const submitButton = screen.getByRole('button', { name: 'Send Message' });
      await user.click(submitButton);

      // Fast-forward the timer
      jest.advanceTimersByTime(1500);

      // Go back to form
      await waitFor(() => {
        const sendAnotherButton = screen.getByRole('button', { name: 'Send Another Message' });
        return user.click(sendAnotherButton);
      });

      // Check that form is cleared
      expect(screen.getByLabelText(/Name/)).toHaveValue('');
      expect(screen.getByLabelText(/Email/)).toHaveValue('');
      expect(screen.getByLabelText(/Message/)).toHaveValue('');
      // Subject field should be empty (no text content)
      expect(screen.getByLabelText(/Subject/)).not.toHaveTextContent('Bug Report');
    });

    it('allows sending another message after success', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      renderWithTheme(<ContactUs />);

      // Fill and submit form
      await user.type(screen.getByLabelText(/Name/), 'John Doe');
      await user.type(screen.getByLabelText(/Email/), 'test@example.com');
      await user.click(screen.getByLabelText(/Subject/));
      await user.click(screen.getByText('Bug Report'));
      await user.type(screen.getByLabelText(/Message/), 'Test message');

      await user.click(screen.getByRole('button', { name: 'Send Message' }));
      jest.advanceTimersByTime(1500);

      // Click send another message
      await waitFor(() => {
        const sendAnotherButton = screen.getByRole('button', { name: 'Send Another Message' });
        return user.click(sendAnotherButton);
      });

      // Should be back to the form
      expect(screen.getByText('Send us a Message')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Send Message' })).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper form labels and structure', () => {
      renderWithTheme(<ContactUs />);

      // Check that form inputs have proper labels
      expect(screen.getByLabelText(/Name/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Email/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Subject/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Message/)).toBeInTheDocument();

      // Check that required fields are marked
      expect(screen.getByLabelText(/Name/)).toBeRequired();
      expect(screen.getByLabelText(/Email/)).toBeRequired();
      expect(screen.getByLabelText(/Subject/)).toBeRequired();
      expect(screen.getByLabelText(/Message/)).toBeRequired();
    });

    it('has proper heading hierarchy', () => {
      renderWithTheme(<ContactUs />);

      const mainHeading = screen.getByRole('heading', { level: 1 });
      expect(mainHeading).toHaveTextContent('Contact SportSync');

      const subHeadings = screen.getAllByRole('heading', { level: 4 });
      expect(subHeadings).toHaveLength(2);
      expect(subHeadings[0]).toHaveTextContent('Get in Touch');
      expect(subHeadings[1]).toHaveTextContent('Send us a Message');
    });
  });

  describe('Email Input Type', () => {
    it('has correct input type for email field', () => {
      renderWithTheme(<ContactUs />);
      
      const emailInput = screen.getByLabelText(/Email/);
      expect(emailInput).toHaveAttribute('type', 'email');
    });
  });

  describe('Text Area Behavior', () => {
    it('renders message field as multiline textarea', () => {
      renderWithTheme(<ContactUs />);
      
      const messageField = screen.getByLabelText(/Message/);
      expect(messageField.tagName.toLowerCase()).toBe('textarea');
    });
  });
});