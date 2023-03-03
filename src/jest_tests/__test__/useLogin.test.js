import React from "react";
import { renderHook } from "@testing-library/react-hooks";
import { act } from "react-dom/test-utils";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth } from "../../Firebase/firebase";
import { AuthContext } from "../../context/AuthContext";
import useLogin from "../../context/useLogin";

jest.mock("firebase/auth");

describe("useLogin", () => {
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

  it("should handle login error", async () => {
    signInWithEmailAndPassword.mockRejectedValueOnce(
      new Error("user-not-found")
    );

    const { result, waitForNextUpdate } = renderHook(() => useLogin(), {
      wrapper,
    });

    act(() => {
      result.current.login(email, password);
    });

    expect(result.current.isPending).toBe(true);

    await waitForNextUpdate();

    expect(result.current.error).toBe("user-not-found");
    expect(result.current.isPending).toBe(false);
    expect(dispatch).not.toHaveBeenCalled();
  });
});
