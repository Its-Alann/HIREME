/* eslint-disable cypress/no-unnecessary-waiting */
beforeEach(() => {
    cy.viewport(1920, 1080);
  });

describe("Login to test account", () => {
    it("Logs into test account", () => {
        cy.logout();
        cy.visit("http://localhost:3000/login");
        cy.get("#email").type("notificationtest@gmail.com");
        cy.get("#password").type("notificationtest1");
        cy.get("#email").focus();
        cy.get(".MuiButton-contained").click();
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(1000);
    });
});

describe("Test notifications link", () => {
    it("Notifications", () => {
      cy.visit("http://localhost:3000/notifications");
      cy.wait(2000);

      //Test every link available for notifications
      cy.get('#nav_link').each((el) => {
        cy.get(el).click();
        cy.url().should('satisfy', (elements) => { 
            const text = elements[0].innerText;
            return text === "http://localhost:3000/viewJobPosting/OoOoylHjCDqt6H2SdGrJ/nRK2hgzFmRZOyCbohZQg" || "http://localhost:3000/network"
        });
        cy.visit("http:localhost:3000/notifications");
        cy.wait(2000);
      })
    });
  });

describe("Visit settings", () => {
    it("Settings", () => {
      cy.visit("http://localhost:3000/notifications");
      cy.get("#visitSettings").click();
      cy.url().should("include", "settings");
      cy.wait(1000);
    });
  });