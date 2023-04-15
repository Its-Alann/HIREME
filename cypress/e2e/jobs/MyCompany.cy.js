/* eslint-disable cypress/no-unnecessary-waiting */
beforeEach(() => {
  cy.viewport(1920, 1080);
});

describe("Edit Company", () => {
  it("Logs into test account", () => {
    cy.logout();
    cy.visit("http://localhost:3000/login");
    cy.get("#email").type("be@badoo.bee");
    cy.get("#password").type("care123");
    cy.get("#email").focus();
    cy.get(".MuiButton-contained").click();
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(1000);
  });
  it("Edit Company Name", () => {
    cy.visit("http://localhost:3000");
    cy.get('[data-cy="My Company-test"]').click();
    cy.get('[data-cy="Button-Edit-CompanyName"]').click();
    cy.get('[data-cy="Textfield-CompanyName"]').find("input").clear();
    cy.get('[data-cy="Textfield-CompanyName"]').type("GOOOGLE");
    cy.get('[data-cy="saveBtn"]').click();

    cy.get('[data-cy="Button-Edit-CompanyName"]').click();
    cy.get('[data-cy="Textfield-CompanyName"]').find("input").clear();
    cy.get('[data-cy="Textfield-CompanyName"]').type("Google");
    cy.get('[data-cy="saveBtn"]').click();
  });
  it("Navigate in job list", () => {
    cy.visit("http://localhost:3000");
    cy.get('[data-cy="My Company-test"]').click();
    cy.get('[data-cy="Button-Next-Job"]').click();
    cy.get('[data-cy="Button-Previous-Job"]').click();
  });
  it("Navigate in employee list", () => {
    cy.visit("http://localhost:3000");
    cy.get('[data-cy="My Company-test"]').click();
    cy.get('[data-cy="Button-Next-Employee"]').click();
    cy.get('[data-cy="Button-Previous-Employee"]').click();
  });
  it("Navigate in manager list", () => {
    cy.visit("http://localhost:3000");
    cy.get('[data-cy="My Company-test"]').click();
    cy.get('[data-cy="Button-Next-Manager"]').click();
    cy.get('[data-cy="Button-Previous-Manager"]').click();
  });
});
