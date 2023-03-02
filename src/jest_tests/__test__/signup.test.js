import React from "react";
import { renderHook } from "@testing-library/react-hooks";
import { act } from "react-dom/test-utils";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../../Firebase/firebase";
import { AuthContext } from "../../context/AuthContext";
import useSignUp from "../../Pages/SignUp/useSignUp";

jest.mock("firebase/auth");

describe("useSignUp", () => {
  let dispatch;
  let wrapper;
  const email = "test@example.com";
  const password = "password123";
  const name = "Test User";

  beforeEach(() => {
    dispatch = jest.fn();
    wrapper = ({ children }) => (
      <AuthContext.Provider value={{ dispatch }}>
        {children}
      </AuthContext.Provider>
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should handle signup error", async () => {
    createUserWithEmailAndPassword.mockRejectedValueOnce(
      new Error("Signup error")
    );

    const { result, waitForNextUpdate } = renderHook(() => useSignUp(), {
      wrapper,
    });

    act(() => {
      result.current.signup(email, password, name);
    });

    expect(result.current.isPending).toBe(true);

    await waitForNextUpdate();

    expect(result.current.error).toBe("Signup error");
    expect(result.current.isPending).toBe(false);
    expect(dispatch).not.toHaveBeenCalled();
  });
});
