/* eslint-disable cypress/no-unnecessary-waiting */
import { expect } from "chai";
import { auth } from "../../../src/Firebase/firebase";

describe("Testing the login feature", () => {
  beforeEach(() => {
    // Cypress starts out with a blank slate for each test
    // so we must tell it to visit our website with the `cy.visit()` command.
    // Since we want to visit the same URL at the start of all our tests,
    // we include it in our beforeEach function so that it runs before each test
  });

  describe("Testing the login feature", () => {
    it("tries to logs In with right email, wrong password", () => {
      cy.logout();
      cy.visit("http://localhost:3000/login");
      cy.get("#email").type("hypeboy@tok.ki");
      cy.get("#password").type("1234");
      cy.get(".MuiButton-contained").click();
      cy.wait(3000);
    });

    it("tries to log In with wrong email, wrong password", () => {
      cy.logout();
      cy.visit("http://localhost:3000/login");
      cy.get("#email").type("hypeboy@tokkkkk.ki");
      cy.get(".MuiButton-contained").click();
      cy.wait(3000);
    });

    it("has form validation for email", () => {
      cy.logout();
      cy.visit("http://localhost:3000/login");
      cy.get("#email").type("hypeboy@tokkkk");
      cy.get("#password").focus();
      cy.get("#email-helper-text").contains("Please enter valid credentials");
      cy.wait(3000);
    });

    it("Log in with Google", () => {
      cy.logout();
      cy.visit("http://localhost:3000/login");
      cy.get('[data-testid="GoogleIcon"]').click();
    });

    it("Logs In with right email, right password, then signs out", () => {
      cy.visit("http://localhost:3000/login");
      cy.get("#email").type("hypeboy@tok.ki");
      cy.get("#password").type("newjeans");
      cy.get(".MuiButton-contained").click();
      cy.wait(3000);
      //Better to have API calls end the tests
    });

    it("verifies account has logged in and log out", () => {
      cy.visit("http://localhost:3000");
      cy.wait(500);
      const user = auth.currentUser?.email;
      if (user) {
        expect(user).to.equal("hypeboy@tok.ki");
        cy.wait(500);
        cy.get('[data-testid="homeLink"]').click();
        cy.wait(500);
      }
    });
  });
  describe("Testing the password reset", () => {
    it("accepts an email and sends password reset", () => {
      cy.visit("http://localhost:3000/login");
      cy.get('[data-testid="forgotPassword"]').click();
      cy.get('[data-cy="emailTest"]').type("hypeboy@tok.ki");
      cy.get('[data-cy="resetSubmit"]').click();
    });
  });
});
