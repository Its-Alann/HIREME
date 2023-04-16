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

describe("Creates company account", () => {
  it("Creates a company account", () => {
    cy.visit("http://localhost:3000/createcompany");
    cy.get("#TextField-CompanyName").type("TesterCompanyName");

    const fileName = "src/Assets/fonts/Images/IMG_0524.png";
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(1000);
    cy.get(":nth-child(2) > input").selectFile(fileName, { force: true });
    //cy.get("#ButtonSave").click();
    //cy.url().should("equal", "http://localhost:3000/");
  });
});
