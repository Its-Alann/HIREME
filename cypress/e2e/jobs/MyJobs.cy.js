/* eslint-disable cypress/no-unnecessary-waiting */
beforeEach(() => {
  cy.viewport(1920, 1080);
});

describe("Login to test account", () => {
  it("Logs into test account", () => {
    cy.logout();
    cy.visit("http://localhost:3000/login");
    cy.get("#email").type("billybob@gmail.com");
    cy.get("#password").type("bob123@");
    cy.get("#email").focus();
    cy.get(".MuiButton-contained").click();
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(1000);
  });
});

describe("Browse Jobs", () => {
  it("Browse Jobs", () => {
    cy.visit("http://localhost:3000/myJobs");
    cy.wait(1000);
    cy.get("#Button-Next").click();
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(500);
    cy.get("#Button-Previous").click();
  });
});
