describe("Testing the admin reported messages feature", () => {
  beforeEach(() => {
    // Cypress starts out with a blank slate for each test
    // so we must tell it to visit our website with the `cy.visit()` command.
    // Since we want to visit the same URL at the start of all our tests,
    // we include it in our beforeEach function so that it runs before each test
    cy.visit("http://localhost:3000");
    cy.logout();
    cy.login();
    cy.visit("http://localhost:3000/admin/flaggedmessages");
  });

  describe("Testing the Flagged Messages portal", () => {
    it("Selects some rows", () => {
      cy.get(
        '[data-id="0"] > .MuiDataGrid-cellCheckbox > .MuiButtonBase-root > .PrivateSwitchBase-input'
      ).click();
      cy.get(
        ".MuiDataGrid-row--lastVisible > .MuiDataGrid-cellCheckbox > .MuiButtonBase-root > .PrivateSwitchBase-input"
      ).click();
    });
  });

  // should add a test where we go to messaging, report a message and then find that message in the admin page
});
