import React from "react";
import { BrowserRouter } from "react-router-dom";
import SignUp from "../Pages/SignUp/SignUp";

describe("<SignUp />", () => {
  it("renders", () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(
      <BrowserRouter>
        <SignUp />
      </BrowserRouter>
    );
  });

  beforeEach(() => {
    cy.mount(
      <BrowserRouter>
        <SignUp />
      </BrowserRouter>
    );
  });

  it("shows helper text when typing a wrong email", () => {
    cy.get("#email").type("email@test");
    cy.get("input").tab();
    cy.get('[data-cy="emailTest"]').contains("Please enter a valid email");
  });

  it("shows helper text when typing a wrong password", () => {
    cy.get("#password").type("123546");
    cy.get("input").tab();
    cy.get('[data-cy="passwordTest"]').contains("Please enter a password");
  });

  it("shows helper text when typing name with characters other than letters", () => {
    cy.get("#firstName").type("abc12");
    cy.get("input").tab();
    cy.get('[data-cy="firstNameTest"]').contains("letters");
  });

  it("shows helper text when typing name with characters other than letters", () => {
    cy.get("#lastName").type("abc12");
    cy.get("input").tab().tab();
    cy.get('[data-cy="lastNameTest"]').contains("letters");
  });

  it("shows no helper text when typing correct information", () => {
    cy.get("#email").type("email@test.com");
    cy.get("#password").type("abcd1234!");
    cy.get("#firstName").type("joe");
    cy.get("#lastName").type("doe");
    //All helper text starts with Please
    cy.get('[data-cy="formTest"]').should("not.include.text", "Please");
  });
});
