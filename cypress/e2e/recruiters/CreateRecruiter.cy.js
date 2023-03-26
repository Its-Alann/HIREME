beforeEach(() => {
  cy.viewport(1920, 1080);
});

describe("Login to test account", () => {
  it("Logs into test account", () => {
    cy.visit("http://localhost:3000/login");
    cy.get("#email").type("be@badoo.bee");
    cy.get("#password").type("care123");
    cy.get("input").tab();
    cy.get(".MuiButton-contained").click();
  });
});

describe("Creates a recruiter account", () => {
  it("Creates a recruiter account", () => {
    cy.logout();
    cy.visit("http://localhost:3000/createRecruiter");
    cy.get("#TextField-FirstName").type("Tester First Name");
    cy.get("#TextField-LastName").type("Tester Last Name");
    cy.get("#ComboBox-CompanyList").click();
    cy.get('li[data-option-index="0"]').click();
    cy.get("#Button-Save").click();
    cy.wait(1000);
  });
});
