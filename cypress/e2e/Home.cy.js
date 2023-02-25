describe("example to-do app", () => {
  beforeEach(() => {
    // Cypress starts out with a blank slate for each test
    // so we must tell it to visit our website with the `cy.visit()` command.
    // Since we want to visit the same URL at the start of all our tests,
    // we include it in our beforeEach function so that it runs before each test
    cy.visit("http://localhost:3000");
  });

  it("visits the login page after clicking on the login", () => {
    cy.get('[data-testid="homeLink"]').click();
  });

  it("goes back to the home page and signs out", () => {
    cy.visit("http://localhost:3000");
    cy.get('[data-testid="homeLink"]').click();
  });

  describe("Adding document to the database Firebase", () => {
    it("Adds document to test_hello_world collection of Firestore, logs in, custom log in, and tests create profile button", () => {
      cy.callFirestore("add", "group", { members: "newMember" });
      //logs in and log out
      cy.login();
      cy.get('[data-testid="homeLink"]').click();

      //custom login
      const uid = "EVgG5esZ4cRVNkf67eySrkJ1dVg1";
      const tenantId = "testacc2@mail.com";
      cy.login(uid);

      //edit profile button
      cy.get('[style="display: grid;"] > a').click();
    });
  });
  //Integration test for firebase connection
});
