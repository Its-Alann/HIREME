describe("example to-do app", () => {
  beforeEach(() => {
    // Cypress starts out with a blank slate for each test
    // so we must tell it to visit our website with the `cy.visit()` command.
    // Since we want to visit the same URL at the start of all our tests,
    // we include it in our beforeEach function so that it runs before each test
    cy.visit("http://localhost:3000");
  });

  it("clicks on navbar links", () => {
    cy.get(".css-1t6c9ts > :nth-child(2)").click();
    cy.url().should("eq", "http://localhost:3000/messaging");
    cy.get(".css-1t6c9ts > :nth-child(3)").click();
    cy.url().should("eq", "http://localhost:3000/network");
    cy.get(".css-1t6c9ts > :nth-child(1)").click();
    cy.url().should("eq", "http://localhost:3000/");
  });

  it("clicks on navbar links on mobile resolution", () => {
    cy.viewport(390, 844);
    //open menu
    cy.get(".css-1lvtzne > .MuiButtonBase-root").click();
    //click first option
    cy.get(".MuiList-root > :nth-child(2)", { timeout: 10000 })
      .should("be.visible")
      .click();
    //verify link
    cy.url().should("eq", "http://localhost:3000/messaging");
    cy.get(".css-1lvtzne > .MuiButtonBase-root").click();
    cy.get(".MuiList-root > :nth-child(3)", { timeout: 10000 })
      .should("be.visible")
      .click();
    cy.url().should("eq", "http://localhost:3000/network");
    cy.get(".css-1lvtzne > .MuiButtonBase-root").click();
    cy.get('.MuiList-root > [tabindex="0"]', { timeout: 10000 })
      .should("be.visible")
      .click();
    cy.url().should("eq", "http://localhost:3000/");

    //test closing menu
    cy.get(".css-1lvtzne > .MuiButtonBase-root").click();
    cy.get('[data-testid="homeLink"]').click("bottomLeft", { force: true });
  });
  //Integration test for firebase connection
});
