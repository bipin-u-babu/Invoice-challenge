import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi, Mock } from "vitest";
import RequireAuth from "./RequireAuth";
import { useAuth } from "./AuthProvider";

vi.mock("./AuthProvider", () => ({
  useAuth: vi.fn(),
}));

describe("RequireAuth", () => {
  it("renders loading state when loading is true", () => {
    (useAuth as Mock).mockReturnValue({ loading: true });

    render(
      <MemoryRouter>
        <RequireAuth>
          <div>Protected Content</div>
        </RequireAuth>
      </MemoryRouter>
    );

    expect(screen.getByText("Loading user info...")).toBeInTheDocument();
  });

  it("renders access denied message when role does not match requiredRole", () => {
    (useAuth as Mock).mockReturnValue({
      loading: false,
      userId: "123",
      role: "user",
    });

    render(
      <MemoryRouter>
        <RequireAuth requiredRole="admin">
          <div>Protected Content</div>
        </RequireAuth>
      </MemoryRouter>
    );

    expect(
      screen.getByText(
        "Access Denied — You don't have permission to view this page."
      )
    ).toBeInTheDocument();
  });

  it("renders children when user is authenticated and role matches requiredRole", () => {
    (useAuth as Mock).mockReturnValue({
      loading: false,
      userId: "123",
      role: "ADMIN",
    });

    render(
      <MemoryRouter>
        <RequireAuth requiredRole="ADMIN">
          <div>Protected Content</div>
        </RequireAuth>
      </MemoryRouter>
    );

    expect(screen.getByText("Protected Content")).toBeInTheDocument();
  });
});
