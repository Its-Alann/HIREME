import React from "react";
import { BrowserRouter } from "react-router-dom";
import LoginPage from "../../../src/Pages/Login/LoginPage";

describe("<Login />", () => {
  it("renders", () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );
  });

  beforeEach(() => {
    cy.mount(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );
  });

  it("shows helper text when typing a wrong email", () => {
    cy.get("#email").type("email@test");
    cy.get("input").tab();
    cy.get('[data-cy="emailTest"]').contains("Please enter");
  });

  it("shows no messsage if the input is valid and tests the google button", () => {
    cy.get("#email").type("email@test.com");
    cy.get("#password").type("abcd");
    cy.get("input").tab();
    cy.get('[data-cy="formTest"]').should("not.include.text", "valid email");
    cy.get('[data-cy="formTest"] > .MuiButton-root').click();
    cy.get(".MuiButton-contained").click();
  });
});
