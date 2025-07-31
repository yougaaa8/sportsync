import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Home from '../../../app/(with-navbar-footer)/home/page';

// Mock the imported components
jest.mock('../../../app/(with-navbar-footer)/tournament/page.tsx', () => {
  return function MockTournaments() {
    return <div data-testid="tournaments">Tournaments Component</div>;
  };
});

jest.mock('../../../app/(with-navbar-footer)/events/page.tsx', () => {
  return function MockEvents() {
    return <div data-testid="events">Events Component</div>;
  };
});

jest.mock('../../../app/(with-navbar-footer)/matchmaking/page.tsx', () => {
  return function MockMatches() {
    return <div data-testid="matches">Matches Component</div>;
  };
});

// Mock Next.js Link component
jest.mock('next/link', () => {
  return function MockLink({ children, href }: { children: React.ReactNode; href: string }) {
    return <a href={href} data-testid={`link-${href}`}>{children}</a>;
  };
});

// Create a theme for testing
const theme = createTheme();

// Wrapper component with theme provider
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ThemeProvider theme={theme}>
    {children}
  </ThemeProvider>
);

describe('Home Component', () => {
  beforeEach(() => {
    render(
      <TestWrapper>
        <Home />
      </TestWrapper>
    );
  });

  describe('Hero Section', () => {
    test('renders the main title correctly', () => {
      expect(screen.getByText('NUS SportSync')).toBeInTheDocument();
    });

    test('renders the subtitle correctly', () => {
      expect(screen.getByText('Compete, Connect, and Celebrate Excellence')).toBeInTheDocument();
    });

    test('hero section has correct styling classes', () => {
      const heroTitle = screen.getByText('NUS SportSync');
      expect(heroTitle).toHaveClass('text-white', 'mb-4', 'font-bold');
    });
  });

  describe('Dashboard Cards', () => {
    test('renders all three main sections', () => {
      expect(screen.getByText('Tournaments')).toBeInTheDocument();
      expect(screen.getByText('Events')).toBeInTheDocument();
      expect(screen.getByText('Matchmaking')).toBeInTheDocument();
    });

    test('renders imported components within cards', () => {
      expect(screen.getByTestId('tournaments')).toBeInTheDocument();
      expect(screen.getByTestId('events')).toBeInTheDocument();
      expect(screen.getByTestId('matches')).toBeInTheDocument();
    });

    test('tournament card has correct content', () => {
      const tournamentsCard = screen.getByText('Tournaments').closest('.MuiCard-root');
      expect(tournamentsCard).toBeInTheDocument();
      expect(screen.getByTestId('tournaments')).toBeInTheDocument();
    });

    test('events card has correct content', () => {
      const eventsCard = screen.getByText('Events').closest('.MuiCard-root');
      expect(eventsCard).toBeInTheDocument();
      expect(screen.getByTestId('events')).toBeInTheDocument();
    });

    test('matchmaking card has correct content', () => {
      const matchmakingCard = screen.getByText('Matchmaking').closest('.MuiCard-root');
      expect(matchmakingCard).toBeInTheDocument();
      expect(screen.getByTestId('matches')).toBeInTheDocument();
    });
  });

  describe('Quick Stats Section', () => {
    test('renders all stat cards with correct numbers', () => {
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText('10')).toBeInTheDocument();
      expect(screen.getByText('14')).toBeInTheDocument();
    });

    test('renders stat labels correctly', () => {
      expect(screen.getByText('Active Tournaments')).toBeInTheDocument();
      expect(screen.getByText('Upcoming Events')).toBeInTheDocument();
      expect(screen.getByText('Open Matches')).toBeInTheDocument();
    });

    test('stat cards are properly structured', () => {
      const activeTournaments = screen.getByText('Active Tournaments');
      const upcomingEvents = screen.getByText('Upcoming Events');
      const openMatches = screen.getByText('Open Matches');

      expect(activeTournaments.closest('.MuiPaper-root')).toBeInTheDocument();
      expect(upcomingEvents.closest('.MuiPaper-root')).toBeInTheDocument();
      expect(openMatches.closest('.MuiPaper-root')).toBeInTheDocument();
    });
  });

  describe('Call to Action Section', () => {
    test('renders CTA heading and description', () => {
      expect(screen.getByText('Ready to Join the Action?')).toBeInTheDocument();
      expect(screen.getByText('Discover tournaments, events, and matches happening at NUS')).toBeInTheDocument();
    });

    test('renders both action buttons', () => {
      expect(screen.getByText('Browse Tournaments')).toBeInTheDocument();
      expect(screen.getByText('View All Events')).toBeInTheDocument();
    });

    test('buttons have correct navigation links', () => {
      expect(screen.getByTestId('link-/tournament')).toBeInTheDocument();
      expect(screen.getByTestId('link-/events')).toBeInTheDocument();
    });

    test('buttons are clickable', () => {
      const browseTournamentsButton = screen.getByText('Browse Tournaments');
      const viewEventsButton = screen.getByText('View All Events');
      
      expect(browseTournamentsButton.closest('button')).toBeInTheDocument();
      expect(viewEventsButton.closest('button')).toBeInTheDocument();
    });
  });

  describe('Layout and Styling', () => {
    test('main container has correct background color class', () => {
      const mainBox = screen.getByText('NUS SportSync').closest('.min-h-screen');
      expect(mainBox).toHaveClass('min-h-screen');
    });

    test('renders with proper Material-UI components', () => {
      // Check for MUI Card components
      const cards = document.querySelectorAll('.MuiCard-root');
      expect(cards.length).toBeGreaterThan(0);

      // Check for MUI Button components
      const buttons = document.querySelectorAll('.MuiButton-root');
      expect(buttons.length).toBe(2); // Two CTA buttons
    });

    test('responsive design classes are applied', () => {
      const title = screen.getByText('NUS SportSync');
      expect(title).toBeInTheDocument();
      
      const ctaTitle = screen.getByText('Ready to Join the Action?');
      expect(ctaTitle).toHaveClass('font-bold', 'mb-4');
    });
  });

  describe('Accessibility', () => {
    test('has proper heading hierarchy', () => {
      // Main title should be h1
      const mainTitle = screen.getByRole('heading', { level: 1 });
      expect(mainTitle).toHaveTextContent('NUS SportSync');

      // Section titles should be h5 (variant="h5" in Typography)
      const sectionHeadings = screen.getAllByRole('heading', { level: 5 });
      expect(sectionHeadings.length).toBeGreaterThan(0);
    });

    test('buttons are accessible', () => {
      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(2);
      
      buttons.forEach(button => {
        expect(button).toBeInTheDocument();
        expect(button).toBeEnabled();
      });
    });

    test('links are accessible', () => {
      const links = screen.getAllByRole('link');
      expect(links).toHaveLength(2);
      
      links.forEach(link => {
        expect(link).toBeInTheDocument();
        expect(link).toHaveAttribute('href');
      });
    });
  });

  describe('Component Integration', () => {
    test('all imported components are rendered', () => {
      expect(screen.getByTestId('tournaments')).toBeInTheDocument();
      expect(screen.getByTestId('events')).toBeInTheDocument();
      expect(screen.getByTestId('matches')).toBeInTheDocument();
    });

    test('components are contained within their respective cards', () => {
      const tournamentsComponent = screen.getByTestId('tournaments');
      const eventsComponent = screen.getByTestId('events');
      const matchesComponent = screen.getByTestId('matches');

      // Check they're within CardContent
      expect(tournamentsComponent.closest('.MuiCardContent-root')).toBeInTheDocument();
      expect(eventsComponent.closest('.MuiCardContent-root')).toBeInTheDocument();
      expect(matchesComponent.closest('.MuiCardContent-root')).toBeInTheDocument();
    });
  });
});

describe('Home Component Snapshot', () => {
  test('matches snapshot', () => {
    const { container } = render(
      <TestWrapper>
        <Home />
      </TestWrapper>
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});