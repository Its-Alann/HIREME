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
});

describe("Name Form", () => {
  it("should be able to enter information", () => {
    cy.visit("http://localhost:3000/accountCreation");
    cy.get(
      ":nth-child(1) > .MuiFormControl-root > .MuiInputBase-root > #standard-required"
    ).type("Test");

    cy.get(
      ":nth-child(2) > .MuiFormControl-root > .MuiInputBase-root > #standard-required"
    ).type("Account");
    // cy.get("#next").click();
  });
});

describe("Filling Up Forms", () => {
  describe("Contact Information Form", () => {
    it("should be able to enter information", () => {
      cy.visit("http://localhost:3000/accountCreation");
      cy.get("#next").click();
      cy.get(
        "#formGrid > :nth-child(1) > .MuiFormControl-root > .MuiInputBase-root > #standard-required"
      ).type("11111111111");
      cy.get(
        ":nth-child(2) > .MuiFormControl-root > .MuiInputBase-root > #standard-required"
      ).type("11 Something Street");
      cy.get(
        ".css-13i4rnv-MuiGrid-root > .MuiFormControl-root > .MuiInputBase-root > #standard-required"
      ).type("Young City");
      cy.get(
        ".MuiGrid-grid-xs-6 > .MuiGrid-root > .MuiFormControl-root > .MuiInputBase-root > #standard-required"
      ).type("Canada");
      cy.get(
        ".MuiGrid-spacing-xs-14 > :nth-child(1) > .MuiFormControl-root > .MuiInputBase-root > #standard-required"
      ).type("H1H 1H1");
      cy.get(".MuiInputAdornment-root > .MuiButtonBase-root").click();
      cy.get(
        ".MuiDayPicker-monthContainer > :nth-child(2) > :nth-child(2)"
      ).click();
    });
  });
  describe("Education Form", () => {
    it("should be able to enter information", () => {
      cy.visit("http://localhost:3000/accountCreation");
      cy.get("#next").click();
      cy.get("#next").click();
      cy.get(
        ":nth-child(1) > .MuiFormControl-root > .MuiInputBase-root > #standard-required"
      ).type("Concordia");
      cy.get(
        ":nth-child(2) > .MuiFormControl-root > .MuiInputBase-root > #standard-required"
      ).type("Arts");
      cy.get(
        ":nth-child(3) > .MuiFormControl-root > .MuiInputBase-root > #standard-required"
      ).type("Fancy Arts");
      cy.get(
        ".MuiGrid-spacing-xs-10 > :nth-child(1) > .MuiFormControl-root > .MuiInputBase-root > .MuiInputAdornment-root > .MuiButtonBase-root"
      ).click();
      cy.get(
        ".MuiDayPicker-monthContainer > :nth-child(2) > :nth-child(2)"
      ).click();
      cy.get(
        ":nth-child(2) > .MuiGrid-root > .MuiFormControl-root > .MuiInputBase-root > .MuiInputAdornment-root > .MuiButtonBase-root"
      ).click();
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(500);
      cy.get(
        ".MuiDayPicker-monthContainer > :nth-child(2) > :nth-child(3)"
      ).click();
      cy.get("#outlined-multiline-static").type("SOEN390");
      cy.get("#next").click();
    });
  });
  describe("Experience Form", () => {
    it("should be able to enter information", () => {
      cy.visit("http://localhost:3000/accountCreation");
      cy.get("#next").click();
      cy.get("#next").click();
      cy.get("#next").click();
      cy.get(
        ":nth-child(1) > .MuiFormControl-root > .MuiInputBase-root > #standard-required"
      ).type("Google");
      cy.get(
        ":nth-child(2) > .MuiFormControl-root > .MuiInputBase-root > #standard-required"
      ).type("Software Engineer");
      cy.get(
        ":nth-child(3) > .MuiFormControl-root > .MuiInputBase-root > #standard-required"
      ).type("Montreal");
      cy.get(".PrivateSwitchBase-input").dblclick();
      cy.get(
        ".MuiGrid-grid-xs-18 > :nth-child(1) > .MuiFormControl-root > .MuiInputBase-root > .MuiInputAdornment-root > .MuiButtonBase-root"
      ).click();
      cy.get(
        ".MuiDayPicker-monthContainer > :nth-child(2) > :nth-child(2)"
      ).click();
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(500);
      cy.get(
        ":nth-child(2) > .MuiGrid-root > .MuiFormControl-root > .MuiInputBase-root > .MuiInputAdornment-root > .MuiButtonBase-root"
      ).click();
      cy.get(
        ".MuiDayPicker-monthContainer > :nth-child(2) > :nth-child(2)"
      ).click();
      cy.get("#outlined-multiline-static").type(
        "I was the best Software Engineer ever"
      );
    });
  });
  describe("Skills Form", () => {
    it("should be able to enter information", () => {
      cy.visit("http://localhost:3000/accountCreation");
      cy.get("#next").click();
      cy.get("#next").click();
      cy.get("#next").click();
      cy.get("#next").click();
      cy.get("#outlined-multiline-static").type("Critical thinker");
    });
  });
  describe("Languages Form", () => {
    it("should be able to enter information", () => {
      cy.visit("http://localhost:3000/accountCreation");
      cy.get("#next").click();
      cy.get("#next").click();
      cy.get("#next").click();
      cy.get("#next").click();
      cy.get("#next").click();
      cy.get("#standard-required").type("English");
      cy.get("#language-dropdown").click();
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.get('[data-value="Beginner"]');
    });
  });
  describe("Projects Form", () => {
    it("should be able to enter information", () => {
      cy.visit("http://localhost:3000/accountCreation");
      cy.get("#next").click();
      cy.get("#next").click();
      cy.get("#next").click();
      cy.get("#next").click();
      cy.get("#next").click();
      cy.get("#next").click();
      cy.get("#standard-required").type("Cure for Cancer");
      cy.get("#outlined-multiline-static").type(
        "Yes, I discovered the cure for cancer by myself"
      );
    });
  });
  describe("Volunteering Form", () => {
    it("should be able to enter information", () => {
      cy.visit("http://localhost:3000/accountCreation");
      cy.get("#next").click();
      cy.get("#next").click();
      cy.get("#next").click();
      cy.get("#next").click();
      cy.get("#next").click();
      cy.get("#next").click();
      cy.get("#next").click();
      cy.get("#standard-required").type("Frigo Vert");
      cy.get(
        ":nth-child(1) > .MuiGrid-root > .MuiFormControl-root > .MuiInputBase-root > .MuiInputAdornment-root > .MuiButtonBase-root"
      ).click();
      cy.get(
        ".MuiDayPicker-monthContainer > :nth-child(2) > :nth-child(2)"
      ).click();
      cy.get("#outlined-multiline-static").type("I helped out a lot of people");
    });
  });
  describe("Awards Form", () => {
    it("should be able to enter information", () => {
      cy.visit("http://localhost:3000/accountCreation");
      cy.get("#next").click();
      cy.get("#next").click();
      cy.get("#next").click();
      cy.get("#next").click();
      cy.get("#next").click();
      cy.get("#next").click();
      cy.get("#next").click();
      cy.get("#next").click();
      cy.get("#standard-required").type("Nobel Peace Prize");
      cy.get(
        ".MuiGrid-spacing-xs-10 > :nth-child(1) > .MuiFormControl-root > .MuiInputBase-root > #standard-required"
      ).type("Nobel");
      cy.get(".MuiInputAdornment-root > .MuiButtonBase-root").click();
      cy.get(
        ".MuiDayPicker-monthContainer > :nth-child(2) > :nth-child(2)"
      ).click();
      cy.get("#outlined-multiline-static").type(
        "I ended all wars in all countries"
      );
      cy.get(".MuiButton-textInherit").click();
    });
  });

  describe("Form Submission", () => {
    describe("Submission", () => {
      it("submits form", () => {
        cy.visit("http://localhost:3000/accountCreation");
        cy.get("#next").click();
        cy.get("#next").click();
        cy.get("#next").click();
        cy.get("#next").click();
        cy.get("#next").click();
        cy.get("#next").click();
        cy.get("#next").click();
        cy.get("#next").click();
        cy.get("#next").click();
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(500);
      });
    });
  });
});
