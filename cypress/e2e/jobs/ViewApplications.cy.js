/* eslint-disable cypress/no-unnecessary-waiting */

Cypress.on("uncaught:exception", (err, runnable) => false);

beforeEach(() => {
  cy.viewport(1920, 1080);
});

describe("Login to test account", () => {
  it("Logs into test account", () => {
    cy.logout();
    cy.visit("http://localhost:3000/login");
    cy.get("#email").type("viewapplication@test.com");
    cy.get("#password").type("test123");
    cy.get("#email").focus();
    cy.get(".MuiButton-contained").click();
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(1000);
  });
});

describe("Display job applications", () => {
  it("visits the visits the view my applications page", () => {
    cy.visit("http://localhost:3000/viewmyapplications");
    cy.wait(1000);
  });
});

describe("Applies for a job", () => {
  it("apply for a job", () => {
    cy.visit(
      "http://localhost:3000/jobApplication/VtimBR90MAReVayXpEhl/6OBaDdXVkjdJiiOkK5Qz"
    );
    // upload file
    cy.get(".MuiList-root > :nth-child(1) > .MuiButtonBase-root").selectFile(
      "cypress/fixtures/IMG_0524.jpg"
    );
    cy.wait(1000);

    // upload file 2
    cy.get(".MuiList-root > :nth-child(2) > .MuiButtonBase-root").selectFile(
      "cypress/fixtures/IMG_0524.jpg"
    );
    cy.wait(1000);

    // upload file 3
    cy.get(".MuiList-root > :nth-child(3) > .MuiButtonBase-root").selectFile(
      "cypress/fixtures/IMG_0524.jpg"
    );
    cy.wait(1000);

    cy.get("#mui-1").type("1234@test.com");
    cy.get("#mui-2").type("1111111111");
    cy.get("#mui-3").type("something street");
    cy.get('[data-testid="submit-button"]').click();
    cy.wait(3000);
  });
});

describe("Remove a job", () => {
  it("clicks on the remove button", () => {
    cy.visit("http://localhost:3000/viewmyapplications");
    cy.wait(1000);
    // cy.get(
    //   ':nth-child(2) > .MuiPaper-root > :nth-child(1) > .css-1glpfpa-MuiGrid2-root > .css-1mx9e1j-MuiStack-root > .MuiGrid2-root > .css-gmwslw-MuiStack-root > [data-cy="remove-button"]'
    // ).click();
    cy.wait(1000);
    cy.visit("http://localhost:3000/viewmyapplications");
  });
});

// describe("Applies for a job", () => {
//   it("applies to a job", () => {
//     cy.visit(
//       "http://localhost:3000/jobApplication/VtimBR90MAReVayXpEhl/6OBaDdXVkjdJiiOkK5Qz"
//     );
//     cy.wait(500);
//     // upload file
//     cy.get(".MuiList-root > :nth-child(1) > .MuiButtonBase-root").selectFile(
//       "cypress/fixtures/IMG_0524.jpg"
//     );
//     cy.wait(1000);
//     // upload file 2
//     cy.get(".MuiList-root > :nth-child(2) > .MuiButtonBase-root").selectFile(
//       "cypress/fixtures/IMG_0524.jpg"
//     );
//     cy.wait(1000);
//     // upload file 3
//     cy.get(".MuiList-root > :nth-child(3) > .MuiButtonBase-root").selectFile(
//       "cypress/fixtures/IMG_0524.jpg"
//     );
//     cy.wait(1000);

//     // cy.visit("http://localhost:3000/browsejobs");
//     // cy.get(
//     //   ":nth-child(3) > .MuiPaper-root > .MuiBox-root > .css-qvcdic-MuiStack-root > :nth-child(1) > .link"
//     // ).click();
//     // cy.wait(1000);
//     // cy.get(
//     //   ".css-1mhd35f-MuiStack-root > .MuiBox-root > .MuiButtonBase-root"
//     // ).click();
//     cy.get("#mui-1").type("viewapp@test.com");
//     cy.get("#mui-2").type("1111111111");
//     cy.get("#mui-3").type("something street");
//     cy.get('[data-testid="submit-button"]').click();
//     cy.wait(1000);
//   });
// });

// describe("Returns to job applications", () => {
//   it("applies to a job", () => {
//     cy.visit("http://localhost:3000/viewmyapplications");
//     cy.wait(1000);
//   });
// });
