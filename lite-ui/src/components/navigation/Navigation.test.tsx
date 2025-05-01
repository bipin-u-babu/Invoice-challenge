import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { Navigation } from "./Navigation";
import { AuthContext } from "../../auth/AuthProvider";

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

describe("Navigation warning dialog", () => {
  it("should shows the confirmation dialog when navigation is blocked", async () => {
    const userId = "12345";
    localStorage.setItem("invoiceForm", "{}");
    render(
      <AuthContext.Provider
        value={{ userId: userId, isAdmin: false, loading: false, role: null }}
      >
        <MemoryRouter initialEntries={["/edit-invoice/"]}>
          <Navigation opened={true} />
        </MemoryRouter>
      </AuthContext.Provider>
    );

    // Find the Home link in the navigation
    const homeLink = screen.getByText("Home");
    fireEvent.click(homeLink);

    // Check if the confirmation modal is shown
    await waitFor(() => {
      expect(screen.getByText(/Leave Page/i)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText(/Leave Page/i));

    expect(window.location.pathname).toBe(`/`);
  });

  it("should not shows the confirmation dialog when navigation is not blocked", async () => {
    const userId = "12345";
    render(
      <AuthContext.Provider
        value={{ userId: userId, isAdmin: false, loading: false, role: null }}
      >
        <MemoryRouter initialEntries={["/edit-invoice/"]}>
          <Navigation opened={true} />
        </MemoryRouter>
      </AuthContext.Provider>
    );

    // Find the Home link in the navigation
    const homeLink = screen.getByText("Home");

    // Simulate clicking the home link
    fireEvent.click(homeLink);

    // Expect navigation to happen and URL to update
    expect(window.location.pathname).toBe(`/`);
  });
});
