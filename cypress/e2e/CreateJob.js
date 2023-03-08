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
  });
});

describe("Creates a new job", () => {
  it("Creates a new job", () => {
    cy.visit("http://localhost:3000/jobCreation");
    // not a good fix
    // we are waiting for firebase to give the id of the company.
    // we can try cy.spy() on console log.
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(2000);
    cy.get("#TextField-Title").type("Tester Job Title");
    cy.get("#TextField-Description").type("Tester Job Description");
    cy.get("#TextField-Location").type("Tester Job Location");
    cy.get("#TextField-Requirement").type("Tester Job Requirement");
    // somehow cannot get date picker by id
    // cy.get("#DatePicker-Deadline").click();
    cy.get("#Button-Save").click();
  });
});
