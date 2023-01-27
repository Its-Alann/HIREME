import {
  render,
  screen,
  waitFor,
  within,
  cleanup,
} from "@testing-library/react";
import React from "react";
import user from "@testing-library/user-event";
import { check } from "prettier";
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";
import SignUp from "../SignUp/SignUp";

afterEach(() => {
  cleanup();
});

function getEmail() {
  return screen.findByRole("textbox", { name: /email/i });
}

function getPassword() {
  //getByRole for passwords does not seem to work with Jest
  return screen.getByLabelText(/password/i);
}

function getFirstName() {
  return screen.findByRole("textbox", { name: /firstName/i });
}

function getLastName() {
  return screen.findByRole("textbox", { name: /lastName/i });
}

function getEmailsCheckBox() {
  //name checks the property label on the MUI component
  return screen.getByRole("checkbox", { name: /updates/i });
}

describe("SignUp", () => {
  render(<SignUp />);
  it("checks if components for the form are present", () => {
    user.type(getFirstName(), "Joe");
    user.type(getLastName(), "Doe");
    user.click(getEmailsCheckBox());

    user.type(getEmail(), "email@test.com");
    user.type(getPassword(), "123456");
  });
});
