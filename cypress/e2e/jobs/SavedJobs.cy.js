/* eslint-disable cypress/no-unnecessary-waiting */
beforeEach(() => {
  cy.viewport(1920, 1080);
});

describe("Login to test account", () => {
  it("Logs into test account", () => {
    //cy.logout();
    cy.visit("http://localhost:3000/login");
    cy.get("#email").type("saved@job.test");
    cy.get("#password").type("S4ved!");
    cy.get("#email").focus();
    cy.get(".MuiButton-contained").click();
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(2000);
  });

  it("Save a job", () => {
    cy.visit("http://localhost:3000/browseJobs");
    cy.wait(1000);
    cy.get('[data-cy="save-button"]').first().click();
    cy.wait(500);
  });

  it("View saved jobs", () => {
    cy.visit("http://localhost:3000/savedJobs");
    cy.wait(1000);
    cy.get('[data-cy="unsave-button"]').first().click();
    cy.wait(100);
  });
});
