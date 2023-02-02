import React from "react";
import Home from "./Home";

describe("<Home />", () => {
  it("renders", () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<Home />);
  });

  beforeEach(() => {
    cy.mount(<Home />);
  });

  it("changes route when clicking on the sign in button", () => {
    cy.get('[data-testid="homeLink"]').click();
    cy.url().should("be.equal", "http://localhost:8080/login");
  });
});
