import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import EventList from '../../../app/(with-navbar-footer)/events/page';
import { pullEventsData } from '../../../api-calls/events/pullEventsData';

// Cast pullEventsData to a Jest mock for type safety
const mockedPullEventsData = pullEventsData as jest.MockedFunction<typeof pullEventsData>;

// Clear module cache to ensure mocks are applied
beforeAll(() => {
  jest.clearAllMocks();
});

// Mock the API call
jest.mock('../../../api-calls/events/pullEventsData');

// Mock the EventItem component
jest.mock('../../../components/events/EventItem.jsx', () => {
  // Replace `any` with a specific type for event
  type MockEvent = {
    id: number;
    name: string;
    title?: string;
  };
  return function MockEventItem({ event }: { event: MockEvent }) {
    return (
      <div data-testid={`event-item-${event.id}`}>
        <div>{event.name}</div>
        <div>{event.title}</div>
      </div>
    );
  };
});

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

// Mock Material-UI Fab component to simulate navigation
jest.mock('@mui/material', () => ({
  ...jest.requireActual('@mui/material'),
  Fab: ({ children, href, ...props }: { children?: React.ReactNode; href?: string }) => (
    <button data-testid="add-event-fab" data-href={href} {...props}>
      {children}
    </button>
  ),
}));

const mockEventsData = [
  {
    id: 1,
    name: 'Basketball Tournament',
    cca: 1,
    contact_point: 'sports@nus.edu.sg',
    date: '2024-02-15',
    location: 'NUS Sports Hall',
    description: 'Annual basketball tournament',
    is_public: true,
    organizer: 'NUS Sports Club',
    participants_count: 50,
    poster: 'basketball_poster.jpg',
    poster_url: 'https://example.com/basketball_poster.jpg',
    registration_deadline: '2024-02-10',
    registration_fee: '10.00'
  },
  {
    id: 2,
    name: 'Soccer Match',
    cca: 2,
    contact_point: 'soccer@nus.edu.sg',
    date: '2024-02-20',
    location: 'NUS Field',
    description: 'Inter-faculty soccer match',
    is_public: true,
    organizer: 'Soccer Club',
    participants_count: 22,
    poster: 'soccer_poster.jpg',
    poster_url: 'https://example.com/soccer_poster.jpg',
    registration_deadline: '2024-02-15',
    registration_fee: '5.00'
  },
  {
    id: 3,
    name: 'Swimming Competition',
    cca: 3,
    contact_point: 'swim@nus.edu.sg',
    date: '2024-02-25',
    location: 'NUS Aquatic Centre',
    description: 'University swimming championship',
    is_public: true,
    organizer: 'Swimming Club',
    participants_count: 30,
    poster: 'swim_poster.jpg',
    poster_url: 'https://example.com/swim_poster.jpg',
    registration_deadline: '2024-02-20',
    registration_fee: '15.00'
  }
];

describe('EventList Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    mockLocalStorage.getItem.mockReturnValue('mock-auth-token');
  });

  // Test Case 1: Component renders with header and description
  test('renders header and description correctly', async () => {
    mockedPullEventsData.mockResolvedValue([]);
    
    await act(async () => {
      render(<EventList />);
    });
    
    expect(screen.getByText('Upcoming Events')).toBeInTheDocument();
    expect(screen.getByText('Discover and join exciting sports events happening at NUS')).toBeInTheDocument();
  });

  // Test Case 2: Shows empty state when no events are available
  test('displays empty state when no events exist', async () => {
    mockedPullEventsData.mockResolvedValue([]);
    
    await act(async () => {
      render(<EventList />);
    });
    
    await waitFor(() => {
      expect(screen.getByText('No events scheduled yet')).toBeInTheDocument();
      expect(screen.getByText('Be the first to create an exciting sports event for the NUS community!')).toBeInTheDocument();
      expect(screen.getByText('📅')).toBeInTheDocument();
    });
  });

  // Test Case 3: Renders events when data is available
  test('renders events when data is loaded', async () => {
    mockedPullEventsData.mockResolvedValue(mockEventsData);
    
    await act(async () => {
      render(<EventList />);
    });
    
    // Wait for the token to be set and events to be fetched
    await waitFor(() => {
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('authToken');
    });
    
    await waitFor(() => {
      expect(pullEventsData).toHaveBeenCalled();
    });
    
    await waitFor(() => {
      expect(screen.getByTestId('event-item-1')).toBeInTheDocument();
      expect(screen.getByTestId('event-item-2')).toBeInTheDocument();
      expect(screen.getByTestId('event-item-3')).toBeInTheDocument();
    }, { timeout: 5000 });
    
    expect(screen.getByText('Basketball Tournament')).toBeInTheDocument();
    expect(screen.getByText('Soccer Match')).toBeInTheDocument();
    expect(screen.getByText('Swimming Competition')).toBeInTheDocument();
  });

  // Test Case 4: Calls pullEventsData on component mount
  test('fetches events data on mount', async () => {
    mockedPullEventsData.mockResolvedValue(mockEventsData);
    
    await act(async () => {
      render(<EventList />);
    });
    
    await waitFor(() => {
      expect(pullEventsData).toHaveBeenCalled();
    });
  });

  // Test Case 5: Retrieves auth token from localStorage on mount
  test('retrieves auth token from localStorage on mount', async () => {
    mockedPullEventsData.mockResolvedValue([]);
    
    await act(async () => {
      render(<EventList />);
    });
    
    await waitFor(() => {
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('authToken');
    });
  });

  // Test Case 6: Handles null events state gracefully
  test('handles null events state without crashing', async () => {
    mockedPullEventsData.mockResolvedValue(null);
    
    await act(async () => {
      render(<EventList />);
    });
    
    await waitFor(() => {
      expect(screen.getByText('No events scheduled yet')).toBeInTheDocument();
    });
  });

  // Test Case 7: Renders floating action button with correct href
  test('renders floating action button with correct navigation link', async () => {
    mockedPullEventsData.mockResolvedValue([]);
    
    await act(async () => {
      render(<EventList />);
    });
    
    await waitFor(() => {
      const fabButton = screen.getByTestId('add-event-fab');
      expect(fabButton).toBeInTheDocument();
      expect(fabButton).toHaveAttribute('data-href', '/events/form');
    });
  });

  // Test Case 8: Verifies component structure when events are present
  test('verifies component structure when events are present', async () => {
    mockedPullEventsData.mockResolvedValue(mockEventsData);
    
    await act(async () => {
      render(<EventList />);
    });
    
    // Wait for token and API call
    await waitFor(() => {
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('authToken');
    });
    
    await waitFor(() => {
      expect(pullEventsData).toHaveBeenCalled();
    });
    
    await waitFor(() => {
      expect(screen.getByText('Upcoming Events')).toBeInTheDocument();
      expect(screen.getByTestId('event-item-1')).toBeInTheDocument();
      expect(screen.getByTestId('add-event-fab')).toBeInTheDocument();
    }, { timeout: 5000 });
  });

  // Test Case 9: Renders correct number of event items based on data
  test('renders correct number of event items based on data', async () => {
    const limitedEvents = mockEventsData.slice(0, 2);
    mockedPullEventsData.mockResolvedValue(limitedEvents);
    
    await act(async () => {
      render(<EventList />);
    });
    
    // Wait for token and API call
    await waitFor(() => {
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('authToken');
    });
    
    await waitFor(() => {
      expect(pullEventsData).toHaveBeenCalled();
    });
    
    await waitFor(() => {
      const eventItems = screen.getAllByTestId(/^event-item-/);
      expect(eventItems).toHaveLength(2);
    }, { timeout: 5000 });
    
    expect(screen.getByTestId('event-item-1')).toBeInTheDocument();
    expect(screen.getByTestId('event-item-2')).toBeInTheDocument();
    expect(screen.queryByTestId('event-item-3')).not.toBeInTheDocument();
  });
});