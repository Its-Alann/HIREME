/* eslint-disable cypress/no-unnecessary-waiting */
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
    cy.wait(3000);
  });
});

describe("Creates a new job", () => {
  it("Creates a new job", () => {
    cy.visit("http://localhost:3000/createJob");
    // not a good fix
    // we are waiting for firebase to give the id of the company.
    // we can try cy.spy() on console log.
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(2000);
    cy.get("#TextField-Title").type("Tester Job Title");
    cy.get("#TextField-City").type("City");
    cy.get("#TextField-Country").type("Country");
    cy.get("#TextField-Description").type("Tester Job Description");
    cy.get("#TextField-Requirement").type("Tester Job Requirement");
    cy.get("#TextField-Benefits").type("Tester Job Benefits");
    cy.get('[data-testid="CalendarIcon"]').click();
    cy.get("button").contains("28").click();
    cy.get('[name="thirdPartyCheck"]').check();
    cy.get("#TextField-thirdParty").type("https://www.glassdoor.com");
    cy.get('[name="thirdPartyCheck"]').uncheck();
    cy.get('[name="resumeCheck"]').check();
    cy.get('[name="coverCheck"]').check();
    cy.get('[name="transcriptCheck"]').check();
    cy.get("#Button-Save").click();
    cy.wait(1000);
  });
});

describe("Delete the new job", () => {
  it("deletes the new created job", () => {
    cy.visit("http://localhost:3000/");
    cy.wait(2000);
    cy.get('[data-cy="My Jobs-test"]').click();
    cy.wait(2000);
    cy.get('[data-cy="viewJob"]').first().click();
    cy.get(".css-gmwslw-MuiStack-root > :nth-child(2) > :nth-child(2)").click();
    cy.get(".css-847nqu-MuiButtonBase-root-MuiButton-root").click();
    cy.wait(500);
  });
});
