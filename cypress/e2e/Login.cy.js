import firebase from "firebase/compat";

describe("Testing the login feature", () => {
  beforeEach(() => {
    // Cypress starts out with a blank slate for each test
    // so we must tell it to visit our website with the `cy.visit()` command.
    // Since we want to visit the same URL at the start of all our tests,
    // we include it in our beforeEach function so that it runs before each test
    cy.visit("http://localhost:3000");
  });

  describe("Testing the login feature", () => {
    it("Logs In", () => {
      cy.visit("http://localhost:3000/login");
      cy.get("#email").type("hypeboy@tok.ki");
      cy.get("#password").type("newjeans");
      cy.get(".MuiButton-contained").click();
      firebase.auth().currentUser;
    });
  });
});
