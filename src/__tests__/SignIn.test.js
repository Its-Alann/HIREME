import { render, screen } from "@testing-library/react";
import { toBeInTheDocument, toContain } from "@testing-library/jest-dom";
import React from "react";
import SignIn from "../SignIn/SignIn";

test("Sign in link exists", () => {
  render(<SignIn />);

});
