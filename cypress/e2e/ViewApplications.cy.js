/* eslint-disable cypress/no-unnecessary-waiting */
beforeEach(() => {
  cy.viewport(1920, 1080);
});

describe("Login to test account", () => {
  it("Logs into test account", () => {
    cy.logout();
    cy.visit("http://localhost:3000/login");
    cy.get("#email").type("viewapplication@test.com");
    cy.get("#password").type("test123");
    cy.get("#email").focus();
    cy.get(".MuiButton-contained").click();
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(1000);
  });
});

describe("Display job applications", () => {
  it("visits the visits the view my applications page", () => {
    cy.visit("http://localhost:3000/viewmyapplications");
    cy.wait(1000);
  });

  // it("show title", () => {
  //   cy.visit("http://localhost:3000/viewmyapplication");
  //   cy.wait(1000);
  //   cy.get(
  //     ":nth-child(3) > .MuiPaper-root > .MuiBox-root > .css-qvcdic-MuiStack-root > :nth-child(1) > .link"
  //   ).should("have.text", "My Applications");
  // });
});
