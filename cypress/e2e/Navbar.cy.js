/* eslint-disable cypress/no-unnecessary-waiting */
describe("example to-do app", () => {
  beforeEach(() => {
    // Cypress starts out with a blank slate for each test
    // so we must tell it to visit our website with the `cy.visit()` command.
    // Since we want to visit the same URL at the start of all our tests,
    // we include it in our beforeEach function so that it runs before each test
    cy.visit("http://localhost:3000");
    cy.login();
  });

  it("clicks on navbar links", () => {
    cy.get('[data-cy="Home-test"]').click();
    cy.url().should("eq", "http://localhost:3000/");
    cy.get('[data-cy="Messaging-test"]').click();
    cy.url().should("eq", "http://localhost:3000/messaging");
    cy.get('[data-cy="Network-test"]').click();
    cy.url().should("eq", "http://localhost:3000/network");
  });

  it("clicks on navbar links on mobile resolution", () => {
    cy.viewport(390, 844);
    //open menu
    cy.get('[data-cy="phone-menu-test"]').within(() =>
      cy.get("Button").click()
    );
    //click first option
    cy.get('[data-cy="Home-phone-test"]').should("be.visible").click();
    //verify link
    cy.url().should("eq", "http://localhost:3000/");

    //open menu
    cy.get('[data-cy="phone-menu-test"]').within(() =>
      cy.get("Button").click()
    );
    //click second option
    cy.get('[data-cy="Messaging-phone-test"]').click();
    //verify link
    cy.url().should("eq", "http://localhost:3000/messaging");

    //open menu
    cy.get('[data-cy="phone-menu-test"]').within(() =>
      cy.get("Button").click()
    );
    //click third option
    cy.get('[data-cy="Network-phone-test"]').click();
    //verify link
    cy.url().should("eq", "http://localhost:3000/network");
  });

  it("open user menu and close it", () => {
    cy.viewport(390, 844);
    cy.get('[data-cy="userBox"]').within(() =>
      cy.get('[data-cy="userMenu"]').click()
    );

    cy.visit("http://localhost:3000");
  });

  it("open user menu and log out", () => {
    cy.get('[data-cy="userBox"]').within(() =>
      cy.get('[data-cy="userMenu"]').click()
    );

    cy.get('[data-cy="logout-test"]').click();
  });

  //Integration test for firebase connection
});
