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
    cy.wait(3000);
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
      "http://localhost:3000/jobApplication/VtimBR90MAReVayXpEhl/0bjJWxYvMEVavadXDhBx"
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
    cy.get("#mui-2").type("1234567890");
    cy.get("#mui-3").type("123 name street");
    cy.wait(1000);
    cy.get('[data-testid="submit-button"]').click();
    cy.wait(3000);
  });
});

describe("Remove a job", () => {
  it("clicks on the remove button", () => {
    cy.visit("http://localhost:3000/viewmyapplications");
    cy.wait(1000);
    cy.get(
      ':nth-child(2) > .MuiPaper-root > .css-1t7ij07-MuiStack-root > .css-6hd0e3-MuiStack-root > [data-cy="remove-button"]'
    ).click();
    cy.wait(1000);
    cy.visit("http://localhost:3000/viewmyapplications");
  });
});

describe("Applies for a job", () => {
  it("apply for a job", () => {
    cy.visit(
      "http://localhost:3000/jobApplication/VtimBR90MAReVayXpEhl/0bjJWxYvMEVavadXDhBx"
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
    cy.get("#mui-2").type("1234567890");
    cy.get("#mui-3").type("123 name street");
    cy.wait(1000);
    cy.get('[data-testid="submit-button"]').click();
    cy.wait(3000);
  });
});

describe("Returns to job applications", () => {
  it("return to initial page - job applications", () => {
    cy.visit("http://localhost:3000/viewmyapplications");
    cy.wait(1000);
  });
});
