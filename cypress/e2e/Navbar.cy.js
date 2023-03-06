beforeEach(() => {
  cy.viewport(1920, 1080);
});

describe("Click buttons on navbar when logged out", () => {
  it("clicks on jobs", () => {
    cy.visit("http://localhost:3000");
    cy.contains("Jobs").click();
  });

  it("clicks on sign up", () => {
    cy.visit("http://localhost:3000");
    cy.contains("Sign Up").click();
    cy.url().should("include", "/SignUp");
  });

  it("clicks on log in", () => {
    cy.visit("http://localhost:3000");
    cy.contains("Log In").click();
    cy.url().should("include", "/login");
  });
});

describe("Click buttons on navbar when logged in", () => {
  it("Logs into test account", () => {
    cy.visit("http://localhost:3000/login");
    cy.get("#email").type("editprofile@test.com");
    cy.get("#password").type("test123");
    cy.get("input").tab();
    cy.get(".MuiButton-contained").click();
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(1000);
  });

  it("clicks on home", () => {
    cy.visit("http://localhost:3000/network");
    cy.contains("Home").click();
    cy.url().should("eq", "http://localhost:3000/");
  });

  it("clicks on network", () => {
    cy.visit("http://localhost:3000");
    cy.contains("Network").click();
    cy.url().should("include", "/network");
  });

  it("clicks on jobs", () => {
    cy.visit("http://localhost:3000");
    cy.contains("Jobs").click();
  });

  it("clicks on messaging", () => {
    cy.visit("http://localhost:3000");
    cy.contains("Messaging").click();
    cy.url().should("include", "/messaging");
  });

  it("clicks on profile", () => {
    cy.visit("http://localhost:3000");
    cy.get(".MuiAvatar-root").click();
    cy.contains("Profile").click();
  });

  it("clicks on Account", () => {
    cy.visit("http://localhost:3000");
    cy.get(".MuiAvatar-root").click();
    cy.contains("Account").click();
  });

  it("clicks on Dashboard", () => {
    cy.visit("http://localhost:3000");
    cy.get(".MuiAvatar-root").click();
    cy.contains("Dashboard").click();
  });

  it("clicks on logout", () => {
    cy.visit("http://localhost:3000");
    cy.get(".MuiAvatar-root").click();
    cy.contains("Logout").click();
  });
});

describe("click menu buttons when logged out with small screen", () => {
  it("click on jobs", () => {
    cy.viewport(600, 800);
    cy.visit("http://localhost:3000");
    cy.get("[data-testid='MenuIcon']").click();
    //doesnt click on jobs but it does open the menu, so its something
  });
});
