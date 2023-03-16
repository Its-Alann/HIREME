Cypress.on("uncaught:exception", (err, runnable) => false);

beforeEach(() => {
  cy.viewport(1920, 1080);
});

describe("Login to test account", () => {
  it("Logs into test account", () => {
    cy.visit("http://localhost:3000/login");
    cy.get("#email").type("accountcreation@test.com");
    cy.get("#password").type("test123");
    cy.get("input").tab();
    cy.get(".MuiButton-contained").click();
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(1000);
  });
});

describe("Edit job posting", () => {
  it("edits first test job posting", () => {
    cy.visit("http://localhost:3000/myJobs");
    cy.get(`[data-cy="view"]`).first().click();
    cy.get("a > .MuiButtonBase-root").click();
    cy.get("#TextField-Title").type(" edited");
    cy.get("#TextField-City").type(" edited");
    cy.get("#TextField-Country").type(" edited");
    cy.get("#TextField-Description").type(" edited");
    cy.get("#TextField-Requirement").type(" edited");
    cy.get("#TextField-Benefits").type(" edited");
    cy.get("#Button-Save").click();
  });
});

describe("Change job posting back to origninal", () => {
  it("edits first test job posting", () => {
    cy.visit("http://localhost:3000/myJobs");
    cy.get(`[data-cy="view"]`).first().click();
    cy.get("a > .MuiButtonBase-root").click();
    cy.get("#TextField-Title").clear();
    cy.get("#TextField-City").clear();
    cy.get("#TextField-Country").clear();
    cy.get("#TextField-Description").clear();
    cy.get("#TextField-Requirement").clear();
    cy.get("#TextField-Benefits").clear();

    cy.get("#TextField-Title").type("Tester Job Title");
    cy.get("#TextField-City").type("City");
    cy.get("#TextField-Country").type("Country");
    cy.get("#TextField-Description").type("Tester Job Description");
    cy.get("#TextField-Requirement").type("Tester Job Requirement");
    cy.get("#TextField-Benefits").type("Tester Job Benefits");

    cy.get("#Button-Save").click();
  });
});
