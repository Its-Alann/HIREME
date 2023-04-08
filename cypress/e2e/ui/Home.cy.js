/* eslint-disable cypress/no-unnecessary-waiting */
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../src/Firebase/firebase";

beforeEach(() => {
  cy.viewport(1920, 1080);
});

Cypress.on("uncaught:exception", (err, runnable) => false);
let name;

describe("Login to test account", () => {
  it("Logs into test account", () => {
    cy.visit("http://localhost:3000/login");
    cy.get("#email").type("editprofile@test.com");
    cy.get("#password").type("test123");
    cy.get("input").tab();
    cy.get(".MuiButton-contained").click();
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(3000);
  });
});

describe("Visit edit profile page", () => {
  it("clicks edit profile if account has already been created and get name", () => {
    cy.visit("http://localhost:3000/");
    cy.get('[data-testid="editProfileButton"]').click();
  });
});

describe("Displays appropraite welcome message with NAME: a", () => {
  it("should display welcome message", () => {
    cy.visit("http://localhost:3000/");

    cy.get('[data-cy="grid-test"]').within(() =>
      cy.get('[data-cy="message-test"]').contains("Welcome Back a!")
    );
  });
});

describe("Allows sign out", () => {
  it("clicks sign out button", () => {
    cy.visit("http://localhost:3000/");
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(500);
    cy.get('[data-testid="homeLink"]').click();
  });
});
