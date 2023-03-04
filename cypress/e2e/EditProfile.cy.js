Cypress.on("uncaught:exception", (err, runnable) => false);

/* eslint-disable cypress/no-unnecessary-waiting */
beforeEach(() => {
  cy.viewport(1920, 1080);
});

describe("Login to test account", () => {
  it("Logs into test account", () => {
    cy.logout();
    cy.visit("http://localhost:3000/login");
    cy.get("#email").type("editprofile@test.com");
    cy.get("#password").type("test123");
    cy.get("#email").focus();
    cy.get(".MuiButton-contained").click();
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(1000);
  });
});

describe("Edit Profile Button", () => {
  it("should be clickable", () => {
    cy.visit("http://localhost:3000/");
    cy.get('[data-testid="editProfileLink"]').click();
  });
});

describe("Edit Profile Page", () => {
  it("display correct", () => {
    cy.visit("http://localhost:3000/editProfile");
  });

  it("save changes", () => {
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.visit("http://localhost:3000/editProfile");
    cy.scrollTo("bottom", { easing: "linear" });
    cy.get('[data-cy="saveBtn"]').click();
  });
});
