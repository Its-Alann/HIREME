import React from "react";
import AccountCreation from "./AccountCreation";

describe("<AccountCreation />", () => {
  it("renders", () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<AccountCreation />);
  });

  beforeEach(() => {
    cy.mount(<AccountCreation />);
  });

  //it("")
});
