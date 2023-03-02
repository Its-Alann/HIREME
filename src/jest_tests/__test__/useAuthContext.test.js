import React, { useContext } from "react";
import { render } from "@testing-library/react";
import useAuthContext from "../../context/useAuthContext";

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useContext: jest.fn(),
}));

describe("useAuthContext", () => {
  it("throws error when used outside of AuthContext provider", () => {
    useContext.mockReturnValueOnce(null);

    const Component = () => {
      useAuthContext();
      return null;
    };

    expect(() => render(<Component />)).toThrow(
      "useAuthContext outside of its provider"
    );
  });
});
