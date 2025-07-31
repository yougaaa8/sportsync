import '@testing-library/jest-dom'

// Mock all external dependencies FIRST
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}))

jest.mock("../../../api-calls/cca/pullCCAMembersList", () => jest.fn())
jest.mock("../../../api-calls/profile/pullUserProfileFromEmail", () => jest.fn())
jest.mock("../../../api-calls/login/login.js", () => jest.fn())

// Mock CSS import
jest.mock("../../../stylesheets/login/login.css", () => ({}))

import React from "react"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { useRouter } from "next/navigation"
import Login from "../../../app/(without-navbar-footer)/login/page.jsx" // Adjust path as needed
import pullUserProfileFromEmail from "../../../api-calls/profile/pullUserProfileFromEmail"
import login from "../../../api-calls/login/login.js"

// Create mock functions
const mockPush = jest.fn()
const mockLogin = login as jest.MockedFunction<typeof login>
const mockPullUserProfile = pullUserProfileFromEmail as jest.MockedFunction<typeof pullUserProfileFromEmail>
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

describe("Login Component", () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks()
    localStorageMock.getItem.mockClear()
    localStorageMock.setItem.mockClear()
    
    // Setup router mock
    mockUseRouter.mockReturnValue({
      push: mockPush,
      route: '/login',
      pathname: '/login',
      query: {},
      asPath: '/login',
    } as any)
  })

  it("renders login form with all required elements", () => {
    render(<Login />)
    
    expect(screen.getByText("Sign into SportSync")).toBeInTheDocument()
    expect(screen.getByLabelText("Email")).toBeInTheDocument()
    expect(screen.getByLabelText("Password")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Login" })).toBeInTheDocument()
    expect(screen.getByText("Don't have an account?")).toBeInTheDocument()
    expect(screen.getByText("Register now")).toBeInTheDocument()
  })

  it("updates email and password fields when user types", () => {
    render(<Login />)
    
    const emailInput = screen.getByLabelText("Email") as HTMLInputElement
    const passwordInput = screen.getByLabelText("Password") as HTMLInputElement
    
    fireEvent.change(emailInput, { target: { value: "test@example.com" } })
    fireEvent.change(passwordInput, { target: { value: "password123" } })
    
    expect(emailInput.value).toBe("test@example.com")
    expect(passwordInput.value).toBe("password123")
  })

  it("shows loading state when form is submitted", async () => {
    mockLogin.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))
    
    render(<Login />)
    
    const emailInput = screen.getByLabelText("Email")
    const passwordInput = screen.getByLabelText("Password")
    const submitButton = screen.getByRole("button", { name: "Login" })
    
    fireEvent.change(emailInput, { target: { value: "test@example.com" } })
    fireEvent.change(passwordInput, { target: { value: "password123" } })
    fireEvent.click(submitButton)
    
    expect(screen.getByText("Logging in...")).toBeInTheDocument()
    expect(submitButton).toBeDisabled()
  })

  it("handles successful login correctly", async () => {
    const mockLoginResponse = {
      tokens: {
        access: "mock-access-token",
        refresh: "mock-refresh-token"
      },
      user: {
        email: "test@example.com",
        id: "123",
        full_name: "Test User",
        profile_picture_url: "http://example.com/pic.jpg",
        status: "student"
      }
    }

    const mockUserProfile = {
      cca_ids: [1, 2, 3]
    }

    mockLogin.mockResolvedValue(mockLoginResponse)
    mockPullUserProfile.mockResolvedValue(mockUserProfile)
    
    render(<Login />)
    
    const emailInput = screen.getByLabelText("Email")
    const passwordInput = screen.getByLabelText("Password")
    const submitButton = screen.getByRole("button", { name: "Login" })
    
    fireEvent.change(emailInput, { target: { value: "test@example.com" } })
    fireEvent.change(passwordInput, { target: { value: "password123" } })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith("test@example.com", "password123")
    })

    await waitFor(() => {
      expect(localStorageMock.setItem).toHaveBeenCalledWith("authToken", "mock-access-token")
      expect(localStorageMock.setItem).toHaveBeenCalledWith("refreshToken", "mock-refresh-token")
      expect(localStorageMock.setItem).toHaveBeenCalledWith("email", "test@example.com")
      expect(localStorageMock.setItem).toHaveBeenCalledWith("userId", "123")
      expect(localStorageMock.setItem).toHaveBeenCalledWith("fullName", "Test User")
      expect(localStorageMock.setItem).toHaveBeenCalledWith("profilePicture", "http://example.com/pic.jpg")
      expect(localStorageMock.setItem).toHaveBeenCalledWith("role", "student")
      expect(localStorageMock.setItem).toHaveBeenCalledWith("isLoggedIn", "true")
    })

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/home")
    })
  })

  it("displays error message when login fails", async () => {
    mockLogin.mockResolvedValue(null)
    
    render(<Login />)
    
    const emailInput = screen.getByLabelText("Email")
    const passwordInput = screen.getByLabelText("Password")
    const submitButton = screen.getByRole("button", { name: "Login" })
    
    fireEvent.change(emailInput, { target: { value: "test@example.com" } })
    fireEvent.change(passwordInput, { target: { value: "wrongpassword" } })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText("Login failed. Please check your credentials.")).toBeInTheDocument()
    })
    
    expect(mockPush).not.toHaveBeenCalled()
  })

  it("displays network error when API call throws", async () => {
    mockLogin.mockRejectedValue(new Error("Network error"))
    
    render(<Login />)
    
    const emailInput = screen.getByLabelText("Email")
    const passwordInput = screen.getByLabelText("Password")
    const submitButton = screen.getByRole("button", { name: "Login" })
    
    fireEvent.change(emailInput, { target: { value: "test@example.com" } })
    fireEvent.change(passwordInput, { target: { value: "password123" } })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText("Network error. Please try again.")).toBeInTheDocument()
    })
  })

  it("clears error message when new form submission starts", async () => {
    // First, cause an error
    mockLogin.mockResolvedValue(null)
    
    render(<Login />)
    
    const emailInput = screen.getByLabelText("Email")
    const passwordInput = screen.getByLabelText("Password")
    const submitButton = screen.getByRole("button", { name: "Login" })
    
    fireEvent.change(emailInput, { target: { value: "test@example.com" } })
    fireEvent.change(passwordInput, { target: { value: "wrongpassword" } })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText("Login failed. Please check your credentials.")).toBeInTheDocument()
    })
    
    // Now try again - error should clear when form is submitted again
    mockLogin.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))
    
    fireEvent.change(passwordInput, { target: { value: "newpassword" } })
    fireEvent.click(submitButton)
    
    // The error should disappear immediately when form is submitted (before API resolves)
    await waitFor(() => {
      expect(screen.queryByText("Login failed. Please check your credentials.")).not.toBeInTheDocument()
    })
  })

  it("has correct form validation attributes", () => {
    render(<Login />)
    
    const emailInput = screen.getByLabelText("Email")
    const passwordInput = screen.getByLabelText("Password")
    
    expect(emailInput).toHaveAttribute("required")
    expect(passwordInput).toHaveAttribute("required")
    expect(passwordInput).toHaveAttribute("type", "password")
  })

  it("has correct register link", () => {
    render(<Login />)
    
    const registerLink = screen.getByText("Register now")
    expect(registerLink).toHaveAttribute("href", "/register")
  })

  it("prevents form submission when fields are empty", () => {
    render(<Login />)
    
    const submitButton = screen.getByRole("button", { name: "Login" })
    fireEvent.click(submitButton)
    
    // The form should not submit due to HTML5 validation
    expect(mockLogin).not.toHaveBeenCalled()
  })

  it("stores user profile and CCA IDs after successful login", async () => {
    const mockLoginResponse = {
      tokens: { access: "token", refresh: "refresh" },
      user: { email: "test@example.com", id: "123", full_name: "Test", profile_picture_url: "", status: "student" }
    }
    
    const mockUserProfile = { cca_ids: [1, 2, 3] }
    
    mockLogin.mockResolvedValue(mockLoginResponse)
    mockPullUserProfile.mockResolvedValue(mockUserProfile)
    localStorageMock.getItem.mockReturnValue("test@example.com")
    
    render(<Login />)
    
    const emailInput = screen.getByLabelText("Email")
    const passwordInput = screen.getByLabelText("Password")
    const submitButton = screen.getByRole("button", { name: "Login" })
    
    fireEvent.change(emailInput, { target: { value: "test@example.com" } })
    fireEvent.change(passwordInput, { target: { value: "password123" } })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(mockPullUserProfile).toHaveBeenCalledWith("test@example.com")
    })
    
    await waitFor(() => {
      expect(localStorageMock.setItem).toHaveBeenCalledWith("userProfile", mockUserProfile)
      expect(localStorageMock.setItem).toHaveBeenCalledWith("ccaIds", JSON.stringify([1, 2, 3]))
    })
  })
})