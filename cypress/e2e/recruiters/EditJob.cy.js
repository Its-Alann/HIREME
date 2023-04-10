/* eslint-disable cypress/no-unnecessary-waiting */
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

// describe("Edit job posting", () => {
//   it("edits first test job posting", () => {
//     cy.visit("http://localhost:3000/myJobs");
//     // eslint-disable-next-line cypress/no-unnecessary-waiting
//     cy.wait(1000);
//     cy.get(
//       ':nth-child(3) > .MuiPaper-root > .css-yuob64 > .css-qvcdic-MuiStack-root > [data-cy="view"]'
//     )
//       .first()
//       .click();
//     cy.get("a > .MuiButtonBase-root").click();
//     cy.get("#TextField-Title").type(" edited");
//     cy.get("#TextField-City").type(" edited");
//     cy.get("#TextField-Country").type(" edited");
//     cy.get("#TextField-Description").type(" edited");
//     cy.get("#TextField-Requirement").type(" edited");
//     cy.get("#TextField-Benefits").type(" edited");
//     cy.get("#Button-Save").click();
//     cy.wait(1000);
//   });
// });

describe("Change job posting back to original", () => {
  it("edits first test job posting", () => {
    cy.visit("http://localhost:3000/myJobs");
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(1000);
    cy.get(
      ':nth-child(3) > .MuiPaper-root > .css-yuob64 > .css-qvcdic-MuiStack-root > [data-cy="viewJob"]'
    )
      .first()
      .click();
    cy.get("a > .MuiButtonBase-root").click();
    cy.get("#TextField-Title").clear();
    cy.get("#TextField-City").clear();
    cy.get("#TextField-Country").clear();
    cy.get("#TextField-Description").clear();
    cy.get("#TextField-Requirement").clear();
    cy.get("#TextField-Benefits").clear();
    cy.get('[name="thirdPartyCheck"]').uncheck();
    cy.get('[name="resumeCheck"]').uncheck();
    cy.get('[name="coverCheck"]').uncheck();
    cy.get('[name="transcriptCheck"]').uncheck();

    cy.get("#TextField-Title").type("Edit Jobs");
    cy.get("#TextField-City").type("Toronto");
    cy.get("#TextField-Country").type("Canada");
    cy.get("#TextField-Description").type("Edit job postings in HIREME");
    cy.get("#TextField-Requirement").type("< 2.5 GPA");
    cy.get("#TextField-Benefits").type("Lots of fun");
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
