/* eslint-disable cypress/no-unnecessary-waiting */
beforeEach(() => {
  cy.viewport(1920, 1080);
});

describe("Login to test account", () => {
  it("Logs into test account", () => {
    cy.logout();
    cy.visit("http://localhost:3000/login");
    cy.get("#email").type("notificationtest@gmail.com");
    cy.get("#password").type("notificationtest1");
    cy.get("#email").focus();
    cy.get(".MuiButton-contained").click();
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(3000);
  });
});

describe("Test notification settings buttons", () => {
  it("Settings", () => {
    cy.visit("http://localhost:3000/settings");
    cy.wait(1000);
    // Test for button "connections"
    cy.get('[data-testid="connectionsSwitch"]').click();
    cy.get('[data-testid="connectionsForm"]').should("have.text", "Off");
    cy.get('[data-testid="connectionsSwitch"]').click();
    cy.get('[data-testid="connectionsForm"]').should("have.text", "On");

    // Test for button "jobs"
    cy.get('[data-testid="jobSwitch"]').click();
    cy.get('[data-testid="jobForm"]').should("have.text", "Off");
    cy.get('[data-testid="jobSwitch"]').click();
    cy.get('[data-testid="jobForm"]').should("have.text", "On");
  });
});
