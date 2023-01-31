import React from "react";
import { BrowserRouter } from "react-router-dom";
import SignIn from "./SignIn";

describe("<SignIn />", () => {
  it("renders", () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(
      <BrowserRouter>
        <SignIn />
      </BrowserRouter>
    );
  });

  beforeEach(() => {
    cy.mount(
      <BrowserRouter>
        <SignIn />
      </BrowserRouter>
    );
  });

  it("shows helper text when typing a wrong email", () => {
    cy.get("#email").type("email@test");
    cy.get("input").tab();
    cy.get('[data-cy="emailTest"]').contains("Please enter");
  });

  it("shows no messsage if the input is valid", () => {
    cy.get("#email").type("email@test.com");
    cy.get("#password").type("abcd");
    cy.get("input").tab();
    cy.get('[data-cy="formTest"]').should("not.include.text", "Please");
  });
});
