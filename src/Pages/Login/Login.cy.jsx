import React from "react";
import { BrowserRouter } from "react-router-dom";
import Login from "./Login";

describe("<Login />", () => {
  it("renders", () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
  });

  beforeEach(() => {
    cy.mount(
      <BrowserRouter>
        <Login />
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
    cy.get('[data-cy="formTest"]').should("not.include.text", "Please");
    cy.get('[data-cy="formTest"] > .MuiButton-root').click();
    cy.get(".css-18rt8lx-MuiStack-root > .MuiButtonBase-root").click();
  });
});
