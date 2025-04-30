import { render, screen } from "@testing-library/react";
import { MemoryRouter, useRoutes } from "react-router-dom";
import routes from "../../routes/routes";
import "@testing-library/jest-dom";

function AppRoutes() {
  return useRoutes(routes);
}

describe("NotFoundPage", () => {
  it("renders when user navigates to an unknown route", () => {
    render(
      <MemoryRouter initialEntries={["/non-existent-route"]}>
        <AppRoutes />
      </MemoryRouter>
    );

    expect(screen.getByText(/404/i)).toBeInTheDocument();
    expect(screen.getByText(/doesn't exist/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /go to home/i })
    ).toBeInTheDocument();
  });
});
