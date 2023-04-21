/* eslint-disable cypress/no-unnecessary-waiting */
beforeEach(() => {
  cy.viewport(1920, 1080);
});

describe("Login to test account", () => {
  it("Logs into test account", () => {
    cy.logout();
    cy.visit("http://localhost:3000/login");
    cy.get("#email").type("events@test.com");
    cy.get("#password").type("test123");
    cy.get("#email").focus();
    cy.get(".MuiButton-contained").click();
    cy.wait(1000);
  });
});

describe("Creates a new event", () => {
  it("Clicks on create event", () => {
    cy.visit("http://localhost:3000/VtimBR90MAReVayXpEhl");
    cy.get(".css-sir63q-MuiStack-root").click();
  });
  it("Fills form", () => {
    cy.visit("http://localhost:3000/VtimBR90MAReVayXpEhl/createEvent");
    cy.wait(500);
    cy.get("#TextField-Name").type("Cypress Test Event");
    cy.get("#TextField-Address").type("Cypress HQ");
    cy.get("#TextField-Description").type("Cypress Test Event");
    cy.get(".MuiInputAdornment-root > .MuiButtonBase-root").click();
    cy.get(
      ".MuiDayPicker-monthContainer > :nth-child(2) > :nth-child(4)"
    ).click();
    cy.get("#Button-Save").click();
    cy.wait(1000);
  });
});

describe("Edits an event", () => {
  it("Clicks on edit event", () => {
    cy.wait(500);
    cy.visit("http://localhost:3000/VtimBR90MAReVayXpEhl");
    cy.get("a.MuiButtonBase-root").click();
  });

  it("Edits the event", () => {
    cy.visit("http://localhost:3000/VtimBR90MAReVayXpEhl");
    cy.get("a.MuiButtonBase-root").click();
    cy.get("#TextField-Address").type(" Edit");
    cy.get("#TextField-Description").type(" Edit");
    cy.get(".MuiInputAdornment-root > .MuiButtonBase-root").click();
    cy.get(
      ".MuiDayPicker-monthContainer > :nth-child(2) > :nth-child(4)"
    ).click();
    cy.get("#Button-Save").click();
    cy.wait(500);
  });
});

describe("Deletes an event", () => {
  it("Clicks on delete event icon", () => {
    cy.visit("http://localhost:3000/VtimBR90MAReVayXpEhl");
    cy.get(".css-1h83icj-MuiStack-root > button.MuiIconButton-root").click();
  });

  it("Clicks on delete event confirmation", () => {
    cy.visit("http://localhost:3000/VtimBR90MAReVayXpEhl");
    cy.get(".css-1h83icj-MuiStack-root > button.MuiIconButton-root").click();
    cy.get('[style="color: red;"]').click();
    cy.wait(500);
  });
});
