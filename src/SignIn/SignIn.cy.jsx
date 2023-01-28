import React from "react";
import SignIn from "./SignIn";

describe("<SignIn />", () => {
  it("renders", () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<SignIn />);
  });

  beforeEach(() => {
    cy.mount(<SignIn />);
  });

  it("shows helper text when typing a wrong email", () => {
    cy.get("#email").type("email@test");
    cy.get("input").tab();
    cy.get('[data-cy="emailTest"]').contains("Please enter a valid email");
  });
});
