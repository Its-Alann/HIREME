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

  describe("Some Test", () => {
    it("Adds document to test_hello_world collection of Firestore", () => {
      cy.callFirestore("add", "group", { members: "newMember" });
      //logs in with the UID found on cypress.env.json
      cy.login();

      //custom login
      const uid = "EVgG5esZ4cRVNkf67eySrkJ1dVg1";
      const tenantId = "testacc2@mail.com";
      cy.login(uid, undefined, tenantId);
    });
  });

  //Integration test for firebase connection
});
