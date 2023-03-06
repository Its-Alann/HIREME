import React from "react";
import HomePage from "../../../src/Pages/Home/HomePage";

describe("<Home />", () => {
  it("renders", () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<HomePage />);
  });

  beforeEach(() => {
    cy.mount(<HomePage />);
  });

  it("changes route when clicking on the sign in button", () => {
    cy.get('[data-testid="homeLink"]').click();
    cy.url().should("be.equal", "http://localhost:8080/login");
  });
});
