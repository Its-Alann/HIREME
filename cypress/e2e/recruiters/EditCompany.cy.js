/* eslint-disable cypress/no-unnecessary-waiting */
beforeEach(() => {
  cy.viewport(1920, 1080);
});

describe("Login to test account", () => {
  it("Logs into test account", () => {
    //cy.logout();
    cy.visit("http://localhost:3000/login");
    cy.get("#email").type("companyRecruiterTest@gmail.com");
    cy.get("#password").type("companyRecruiterTest");
    cy.get("#email").focus();
    cy.get(".MuiButton-contained").click();
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(3000);
  });
});

describe("Edit company page", () => {
  it("should be clickable", () => {
    cy.visit("http://localhost:3000/companyPage/UJKcu7igvpu9mtnfvwII");
    cy.get('[data-cy="Button-Edit-CompanyName"]').click();
    cy.get('[data-cy="Textfield-CompanyName"]').find("input").clear();
    cy.get('[data-cy="Textfield-CompanyName"]').type("Company Test");
    const fileName = "src/Assets/fonts/Images/IMG_0524.png";
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(1000);
    cy.get(`[data-cy="pictureBtn"]`).selectFile(fileName, { force: true });
    cy.get(`[data-cy="saveBtn"]`).click();
  });
});

describe("New job Button", () => {
  it("should be clickable", () => {
    cy.visit("http://localhost:3000/companyPage/UJKcu7igvpu9mtnfvwII");
    cy.get('[data-cy="Button-NewJob"]').click();
  });
});
