import { render, screen } from "@testing-library/react";
import { toBeInTheDocument, toContain } from "@testing-library/jest-dom";
import React from "react";
import Home from "../Home/Home";

test("Sign in link exists", () => {
  render(<Home />);
  const signInLink = screen.getByTestId("homeLink");
  expect(signInLink).toBeInTheDocument();
});

test("Sign in link should change link of the page to '/signin'", () => {
  render(<Home />);
  const link = screen.getByRole("link", { name: /Sign In/i });
  expect(link.getAttribute("href")).toBe("/signin");
});
