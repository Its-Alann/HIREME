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
import { byRole as fromRole } from "testing-library-selectors";
import Login from "../Login/Login";

afterEach(() => {
  cleanup();
});

const ui = {
  emailTextbox: fromRole("textbox", { name: /email/i }),
};

function getEmail() {
  return screen.findByRole("textbox", {
    name: /email/i,
    options: { hidden: true },
  });
}

function getPassword() {
  //getByRole for passwords does not seem to work with Jest
  return screen.getByLabelText(/password/i);
}

describe("SignInForm", () => {
  render(
    <BrowserRouter>
      <Login />
    </BrowserRouter>
  );
  it("call onSubmit after form validation", () => {
    user.type(getEmail(), "email@test.com");
    user.type(getPassword(), "123456");
  });

  /*it("shows error if email has an invalid form", async () => {
    screen.getAllByRole();
    user.type(screen.getBy("email"), "email@test");
    user.tab();

    await waitFor(() => {
      expect(screen.getByText("Email").toBeInDocument());
    });
    // TODO: more tests during the video
  });

  /*it("has email as a required field", async () => {
    //Press submit directly
    clickSubmitButton();

    //async method due to delay for helper message
    await waitFor(screen.getByText("Please enter a valid email"));
  });*/
});
