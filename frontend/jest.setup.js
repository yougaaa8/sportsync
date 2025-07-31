import "@testing-library/jest-dom";

// Mock Next.js router functionality
jest.mock("next/router", () => ({
  useRouter() {
    return {
      route: "/",
      pathname: "/",
      query: {},
      asPath: "/",
      push: jest.fn(),
      pop: jest.fn(),
      reload: jest.fn(),
      back: jest.fn(),
      prefetch: jest.fn().mockResolvedValue(undefined),
      beforePopState: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
      },
    };
  },
}));

// Mock Next.js Link component to render as regular anchor
jest.mock("next/link", () => {
  return ({ children, href }) => {
    return <a href={href}>{children}</a>;
  };
});
