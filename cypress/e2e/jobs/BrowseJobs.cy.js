/* eslint-disable cypress/no-unnecessary-waiting */
beforeEach(() => {
  cy.viewport(1920, 1080);
});

describe("Login to test account", () => {
  it("Logs into test account", () => {
    //cy.logout();
    cy.visit("http://localhost:3000/login");
    cy.get("#email").type("notificationtest@gmail.com");
    cy.get("#password").type("notificationtest1");
    cy.get("#email").focus();
    cy.get(".MuiButton-contained").click();
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(3000);
  });

  it("Add and remove favourite", () => {
    cy.visit("http://localhost:3000/browseJobs");
    cy.wait(1000);
    cy.get("body").then((body) => {
      if (body.find('[data-testid="StarOutlineIcon"]').length > 0) {
        cy.get('[data-testid="StarOutlineIcon"]').first().click();
        cy.wait(1000);
      }
    });
    cy.get("body").then((body) => {
      if (body.find('[data-testid="StarIcon"]').length > 0) {
        cy.get('[data-testid="StarIcon"]').first().click();
        cy.wait(1000);
      }
    });
  });

  it("Save and unsave job", () => {
    cy.visit("http://localhost:3000/browseJobs");
    cy.wait(1000);
    cy.get('[data-cy="save-button"]').first().click();
    cy.wait(100);
    cy.get('[data-cy="unsave-button"]').first().click();
    cy.wait(100);
  });
});

describe("Browse Jobs", () => {
  it("Browse Jobs", () => {
    cy.visit("http://localhost:3000/browseJobs");
    cy.wait(1000);
    cy.get("#Button-Next").click();
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(500);
    cy.get("#Button-Previous").click();
  });
});
