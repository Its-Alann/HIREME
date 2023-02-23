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

describe("Creates an account", () => {
  it("Clicks create account button", () => {
    cy.visit("http://localhost:3000/");
    // cy.get('[data-testid="createProfileLink"]').click();
  });

  describe("Name Form", () => {
    it("should contain placeholders", () => {
      cy.visit("http://localhost:3000/accountCreation");
      cy.get(
        ":nth-child(1) > .MuiFormControl-root > .MuiInputBase-root > #standard-required"
      ).should("have.attr", "placeholder", "First Name");
      cy.get(
        ":nth-child(1) > .MuiFormControl-root > .MuiInputBase-root > #standard-required"
      ).type("NLALAAL");

      cy.get(
        ":nth-child(2) > .MuiFormControl-root > .MuiInputBase-root > #standard-required"
      ).should("have.attr", "placeholder", "Last Name");
      cy.get("#next").click();
    });
  });

  describe("Contact Information Form", () => {
    it("should contain placeholders", () => {
      cy.visit("http://localhost:3000/accountCreation");
      cy.get("#next").click();
      cy.get(
        "#formGrid > :nth-child(1) > .MuiFormControl-root > .MuiInputBase-root > #standard-required"
      ).should("have.attr", "placeholder", "Phone number");
      cy.get(
        ":nth-child(2) > .MuiFormControl-root > .MuiInputBase-root > #standard-required"
      ).should("have.attr", "placeholder", "Address");
      cy.get(
        ".css-13i4rnv-MuiGrid-root > .MuiFormControl-root > .MuiInputBase-root > #standard-required"
      ).should("have.attr", "placeholder", "City");
      cy.get(
        ".MuiGrid-grid-xs-6 > .MuiGrid-root > .MuiFormControl-root > .MuiInputBase-root > #standard-required"
      ).should("have.attr", "placeholder", "Country");
      cy.get(
        ".MuiGrid-spacing-xs-14 > :nth-child(1) > .MuiFormControl-root > .MuiInputBase-root > #standard-required"
      ).should("have.attr", "placeholder", "Postal Code");
      // cy.get("#:rf:").should("have.attr", "placeholder", "Date of Birth");
    });
  });
});
