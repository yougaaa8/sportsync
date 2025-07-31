import { redirect } from "next/navigation"
import Root from "../app/page"

// Mock the Next.js navigation redirect function
jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
}))

describe("Home Component (Redirect)", () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks()
  })

  it("calls redirect to /home when component is rendered", () => {
    // Call the component function
    Root()
    
    // Verify that redirect was called with the correct path
    expect(redirect).toHaveBeenCalledWith("/home")
    expect(redirect).toHaveBeenCalledTimes(1)
  })

  it("redirect function is called with correct parameters", () => {
    const mockRedirect = redirect as jest.MockedFunction<typeof redirect>
    
    // Execute the component
    Root()
    
    // Check the redirect was called with exactly "/home"
    expect(mockRedirect).toHaveBeenCalledWith("/home")
  })
})