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

describe("Creates a recruiter account", () => {
  it("Creates a recruiter account", () => {
    cy.visit("http://localhost:3000/createRecruiter");

    cy.get("#TextField-FirstName").type("Tester First Name");
    cy.get("#TextField-LastName").type("Tester Last Name");
    cy.get("#ComboBox-CompanyList").click();
    cy.get('li[data-option-index="0"]').click();
    cy.get("#Button-Save").click();
  });
});
