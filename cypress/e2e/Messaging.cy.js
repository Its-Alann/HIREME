/* eslint-disable cypress/no-unnecessary-waiting */
// eslint-disable-next-line import/no-extraneous-dependencies
import "cypress-file-upload";

Cypress.on("uncaught:exception", (err, runnable) => false);

describe("example to-do app", () => {
  beforeEach(() => {
    // Cypress starts out with a blank slate for each test
    // so we must tell it to visit our website with the `cy.visit()` command.
    // Since we want to visit the same URL at the start of all our tests,
    // we include it in our beforeEach function so that it runs before each test
    cy.visit("http://localhost:3000");
  });

  describe("Testing the messaging feature", () => {
    it("Logins, goes to messaging feature, sends message, sends file", () => {
      //logout
      cy.logout();
      //login and reach messaging page
      //CONDITION: USER MUST HAVE A CONVERSATION
      cy.wait(1000);
      cy.login();
      cy.wait(1000);
      cy.visit("http://localhost:3000/messaging");

      //open first conversation and checks if it's visible
      cy.get(".convo-list > .MuiList-root > :nth-child(1)")
        .should("be.visible")
        .click({ force: true });

      //send Hi message
      cy.get("#message-input").should("be.visible").type("Hi");
      cy.get('[data-cy="messagingGrid"]').within(() =>
        cy.get("Button").click({ force: true })
      );
      cy.get("#message-chats").last().should("contain", "Hi");

      //send image
      const fileName = "src/Assets/fonts/Images/IMG_0524.png";
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(1000);
      cy.get(".css-qgqs2f-MuiGrid2-root > .MuiButtonBase-root")
        .find("input")
        .selectFile(fileName, { force: true });
      cy.get('[data-cy="messagingGrid"]').within(() =>
        cy.get("Button").click({ force: true })
      );
    });

    it("shows message if user is not signed in", () => {
      cy.logout();
      cy.visit("http://localhost:3000/messaging");
    });

    it("shows nothing if user has no conversation", () => {
      //CONDITION: USER MUST HAVE NO CONVERSATION
      //sjMRME25ceRusKoIEmN1jVcwF4F2 accountcreation@test2.com
      cy.login("sjMRME25ceRusKoIEmN1jVcwF4F2");
      cy.visit("http://localhost:3000/messaging");
    });
  });

  describe("Testing the phone resolution changes", () => {
    it("displays icon of returning to all convos when using phone resolution", () => {
      cy.logout();
      cy.login();

      //Iphone resolution
      cy.viewport(390, 844);
      cy.visit("http://localhost:3000/messaging");

      //open first conversation and checks if it's visible
      cy.get(".convo-list > .MuiList-root > :nth-child(1)")
        .should("be.visible")
        .click();

      //check if return button is present
      cy.get("#ChevronIcon").should("be.visible").click();
    });

    it("opens messaging of an account wihout a profile", () => {
      cy.logout();
      //CONDITION: USER WITHOUT A PROFILE
      cy.login("sjMRME25ceRusKoIEmN1jVcwF4F2");
    });
  });

  //Integration test for firebase connection
});
