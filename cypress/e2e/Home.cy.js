beforeEach(() => {
  cy.viewport(1920, 1080);
});

describe("Login to test account", () => {
  it("Logs into test account", () => {
    cy.visit("http://localhost:3000/login");
    cy.get("#email").type("editprofile@test.com");
    cy.get("#password").type("test123");
    cy.get("input").tab();
    cy.get(".MuiButton-contained").click();
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(1000);
  });
});

describe("Visit edit profile page", () => {
  it("clicks edit profile if account has already been created", () => {
    cy.visit("http://localhost:3000/");

    cy.get('[data-testid="editProfileButton"]').click();
  });
});

describe("Displays appropraite welcome message", () => {
  it("should display welcome message with name", () => {
    cy.visit("http://localhost:3000/");
    cy.get(".css-ylmtbx-MuiGrid-root > .MuiTypography-root").should(
      "have.text",
      " Welcome Back a! "
    );
  });
});

describe("Allows sign out", () => {
  it("clicks sign out button", () => {
    cy.visit("http://localhost:3000/");
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(500);
    cy.get('[data-testid="homeLink"]').click();
  });
});
