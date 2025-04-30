import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { TopSecret } from "../../pages/top-secret/TopSecret";
import RequireAuth from "../../auth/RequireAuth";
import { AuthContext, AuthProvider } from "../../auth/AuthProvider";

const renderWithRole = (role: string | null) => {
  return render(
    <AuthContext.Provider
      value={{ userId: "123", isAdmin: false, loading: false, role: role }}
    >
      <MemoryRouter initialEntries={["/top-secret"]}>
        <Routes>
          <Route
            path="/top-secret"
            element={
              <RequireAuth requiredRole="ADMIN">
                <TopSecret />
              </RequireAuth>
            }
          />
          <Route path="*" element={<div>Access Denied</div>} />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>
  );
};

describe("TopSecret Page", () => {
  it("renders for ADMIN user", () => {
    renderWithRole("ADMIN");
    expect(screen.getByText(/The answer is 42/i)).toBeInTheDocument();
  });

  it("denies access for non-admin user", () => {
    renderWithRole("USER");
    expect(screen.getByText(/access denied/i)).toBeInTheDocument();
  });

  it("denies access when not authenticated", () => {
    renderWithRole(null);
    expect(screen.getByText(/access denied/i)).toBeInTheDocument();
  });
});
