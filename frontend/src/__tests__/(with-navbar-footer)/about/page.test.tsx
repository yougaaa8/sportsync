import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import About from '../../../app/(with-navbar-footer)/about/page';

// Mock Next.js Image component
jest.mock('next/image', () => {
  type MockImageProps = {
    src: string;
    alt: string;
    width?: number | string;
    height?: number | string;
    style?: React.CSSProperties;
  };
  return function MockImage({ src, alt, width, height, style }: MockImageProps) {
    return (
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        style={style}
        data-testid="mock-image"
      />
    );
  };
});

// Mock the logo import
jest.mock("../../../assets/sportsync-logo.png", () => "mocked-logo-path");

describe('About Component', () => {
  beforeEach(() => {
    render(<About />);
  });

  test('renders the main SportSync title', () => {
    const mainTitle = screen.getByRole('heading', { name: /SportSync/i, level: 3 });
    expect(mainTitle).toBeInTheDocument();
  });

  test('renders the subtitle correctly', () => {
    const subtitle = screen.getByRole('heading', { 
      name: /Revolutionizing Sports Participation at NUS/i 
    });
    expect(subtitle).toBeInTheDocument();
  });

  test('displays the SportSync logo with correct attributes', () => {
    const logo = screen.getByTestId('mock-image');
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('alt', 'SportSync Logo');
    expect(logo).toHaveAttribute('width', '80');
    expect(logo).toHaveAttribute('height', '80');
  });

  test('renders all main section headings', () => {
    const expectedSections = [
      'Our Mission',
      'The Challenge We\'re Solving', 
      'Website Features'
    ];

    expectedSections.forEach(sectionTitle => {
      const heading = screen.getByRole('heading', { name: sectionTitle });
      expect(heading).toBeInTheDocument();
    });
  });

  test('displays all four challenge points', () => {
    const challengePoints = [
      'Fragmented Communication',
      'Limited Visibility',
      'Administrative Burden',
      'Disconnected Community'
    ];

    challengePoints.forEach(point => {
      expect(screen.getByText(new RegExp(point, 'i'))).toBeInTheDocument();
    });
  });

  test('renders all six website features', () => {
    const features = [
      'User Authentication & Profile Management',
      'Open Matchmaking System',
      'CCA Dashboard',
      'Tournament Information System',
      'Event Creation & Management',
      'Merchandise Shop'
    ];

    features.forEach(feature => {
      expect(screen.getByText(feature)).toBeInTheDocument();
    });
  });

  test('displays developer information with avatars', () => {
    const developers = [
      'Made Yoga Chantiswara',
      'Alexander Gerald'
    ];

    developers.forEach(developer => {
      expect(screen.getByText(developer)).toBeInTheDocument();
    });

    // Check avatars are present
    const avatars = screen.getAllByText(/^[A-Z]{2}$/); // Matches two-letter initials
    expect(avatars).toHaveLength(2);
    expect(avatars[0]).toHaveTextContent('MY');
    expect(avatars[1]).toHaveTextContent('AG');
  });

  test('renders mission statement content', () => {
    const missionText = /increase sports participation and community engagement at NUS/i;
    expect(screen.getByText(missionText)).toBeInTheDocument();
  });

  test('contains main description paragraph', () => {
    const descriptionText = /SportSync is an innovative all-in-one platform/i;
    expect(screen.getByText(descriptionText)).toBeInTheDocument();
  });

  test('has proper container structure with correct styling classes', () => {
    // Check if the main container has the expected background color styling
    const mainBox = document.querySelector('[sx*="bgcolor"]') || 
                   document.querySelector('.MuiBox-root');
    expect(mainBox).toBeInTheDocument();
    
    // Check if cards are present (should have multiple card elements)
    const cards = document.querySelectorAll('.MuiCard-root') || 
                 screen.getAllByRole('article', { hidden: true }) ||
                 document.querySelectorAll('[elevation="0"]');
    expect(cards.length).toBeGreaterThan(0);
  });
});