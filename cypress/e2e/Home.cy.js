/* eslint-disable cypress/no-unnecessary-waiting */
import { getDoc, doc } from "firebase/firestore";
import { db } from "../../src/Firebase/firebase";

const formCompleted = async (email) => {
  const docRef = doc(db, "userProfiles", email);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return true;
  }
  return false;
};

Cypress.on("uncaught:exception", (err, runnable) => false);

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
    it("Adds document to test_hello_world collection of Firestore, manual log in/custom log in and click on edit profile", () => {
      cy.visit("http://localhost:3000");
      cy.login();
      cy.wait(1000);
      cy.callFirestore("add", "group", { members: "newMember" });

      //custom login
      const uid = "EVgG5esZ4cRVNkf67eySrkJ1dVg1";
      const email = "testacc2@mail.com";
      cy.login(uid);
      const edit = formCompleted(email);

      //either create profile or edit profile button
      if (edit) {
        cy.get('[data-testid="editProfileLink"]').click();
      } else {
        cy.get('[data-testid="createProfileLink"]').click();
      }
    });
  });
  //Integration test for firebase connection
});
