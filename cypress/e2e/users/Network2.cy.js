/* eslint-disable cypress/no-unnecessary-waiting */
beforeEach(() => {
  cy.viewport(1920, 1080);
});

// networkTest1@hireme.com
// ilovetesting124?

// networkTest2@hireme.com
// ihatetesting123!

describe("Login to test account", () => {
  it("Logs into test account", () => {
    cy.logout();
    cy.visit("http://localhost:3000/login");
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(3000);
    cy.get("#email").type("networkTest1@hireme.com");
    cy.get("#password").type("ilovetesting124?");
    cy.get("#email").focus();
    cy.get(".MuiButton-contained").click();
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(3000);
  });
});

describe("Tests network tabs", () => {
  it("goes to network page", () => {
    cy.visit("http://localhost:3000/network");
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(1000);
    cy.get('[data-cy="ReceivedInvitationTab"]').click();
    cy.get('[data-cy="SentInvitationTab"]').click();
    cy.get('[data-cy="PossibleConnectionsTab"]').click();
    cy.get("#Button-Next").click();
    cy.get("#Button-Previous").click();
  });
});

describe("Test sending an invitation to another user and receiving invitations", () => {
  it("send invitation", () => {
    cy.visit("http://localhost:3000/network");
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(2000);
    cy.get('[data-cy="PossibleConnectionsTab"]').click();
    cy.get("#Button-Next").click();
    cy.get("#Button-Next").click();
    cy.get('[data-cy="invitationButtonNetwork Test"]').click();
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(2000);
  });
  it("check if invitation has been sent", () => {
    cy.visit("http://localhost:3000/network");
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(1000);
    cy.get('[data-cy="SentInvitationTab"]').click();
    cy.get(
      '[data-cy="invitationsGrid"] > :nth-child(1) > .css-nwqh5 > .MuiPaper-root'
    ).should("exist");
  });
  it("Logs into receive invitation test account", () => {
    cy.logout();
    cy.visit("http://localhost:3000/login");
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(3000);
    cy.get("#email").type("networkTest2@hireme.com");
    cy.get("#password").type("ihatetesting123!");
    cy.get("#email").focus();
    cy.get(".MuiButton-contained").click();
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(3000);
  });
  it("ignore the invitation", () => {
    cy.visit("http://localhost:3000/network");
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(3000);
    cy.get('[data-cy="ReceivedInvitationTab"]').click();
    cy.get('[data-cy="IgnoreInvitationBtnNetwork Test"]').click();
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(2000);
  });
  it("Logs back into test account", () => {
    cy.logout();
    cy.visit("http://localhost:3000/login");
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(3000);
    cy.get("#email").type("networkTest1@hireme.com");
    cy.get("#password").type("ilovetesting124?");
    cy.get("#email").focus();
    cy.get(".MuiButton-contained").click();
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(3000);
  });
  it("send invitation again", () => {
    cy.visit("http://localhost:3000/network");
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(3000);
    cy.get('[data-cy="PossibleConnectionsTab"]').click();
    cy.get("#Button-Next").click();
    cy.get("#Button-Next").click();
    cy.get('[data-cy="invitationButtonNetwork Test"]').click();
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(2000);
  });
  it("withdraw the invitation", () => {
    cy.visit("http://localhost:3000/network");
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(1000);
    cy.get('[data-cy="SentInvitationTab"]').click();
    cy.get(
      '[data-cy="invitationsGrid"] > :nth-child(1) > .css-nwqh5 > .MuiPaper-root'
    ).should("exist");
    cy.get("#withdrawButton").click();
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(2000);
  });
});

describe("Create a connection with another user", () => {
  it("Logs back into test account", () => {
    cy.logout();
    cy.visit("http://localhost:3000/login");
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(1000);
    cy.get("#email").type("networkTest1@hireme.com");
    cy.get("#password").type("ilovetesting124?");
    cy.get("#email").focus();
    cy.get(".MuiButton-contained").click();
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(3000);
  });
  it("send invitation", () => {
    cy.visit("http://localhost:3000/network");
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(1000);
    cy.get('[data-cy="PossibleConnectionsTab"]').click();
    cy.get("#Button-Next").click();
    cy.get("#Button-Next").click();
    cy.get('[data-cy="invitationButtonNetwork Test"]').click();
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(2000);
  });
  it("check if invitation has been sent", () => {
    cy.visit("http://localhost:3000/network");
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(1000);
    cy.get('[data-cy="SentInvitationTab"]').click();
    cy.get(
      '[data-cy="invitationsGrid"] > :nth-child(1) > .css-nwqh5 > .MuiPaper-root'
    ).should("exist");
  });
  it("Logs into receive invitation test account", () => {
    cy.logout();
    cy.visit("http://localhost:3000/login");
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(3000);
    cy.get("#email").type("networkTest2@hireme.com");
    cy.get("#password").type("ihatetesting123!");
    cy.get("#email").focus();
    cy.get(".MuiButton-contained").click();
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(3000);
  });
  it("ignore the invitation", () => {
    cy.visit("http://localhost:3000/network");
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(1000);
    cy.get('[data-cy="ReceivedInvitationTab"]').click();
    cy.get('[data-cy="AcceptInvitationBtnNetwork Test"]').click();
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(2000);
  });
  it("connection should exist", () => {
    cy.visit("http://localhost:3000/network");
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(1000);
    cy.get('[data-cy="userProfileInNetwork"]').should("exist");
  });
  it("logs into connected test account", () => {
    cy.logout();
    cy.visit("http://localhost:3000/login");
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(3000);
    cy.get("#email").type("networkTest2@hireme.com");
    cy.get("#password").type("ihatetesting123!");
    cy.get("#email").focus();
    cy.get(".MuiButton-contained").click();
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(3000);
  });
  it("connection should exist", () => {
    cy.visit("http://localhost:3000/network");
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(1000);
    cy.get('[data-cy="userProfileInNetwork"]').should("exist");
  });
  it("remove connections", () => {
    cy.visit("http://localhost:3000/network");
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(1000);
    cy.get(".css-gmwslw-MuiStack-root > .MuiButtonBase-root").click();
    cy.get('[style="color: red;"]').click();
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(1000);
  });
});

describe("Login hanni and test sending message", () => {
  it("Logs into test account", () => {
    cy.logout();
    cy.visit("http://localhost:3000/login");
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(3000);
    cy.get("#email").type("hypeboy@tok.ki");
    cy.get("#password").type("newjeans");
    cy.get("#email").focus();
    cy.get(".MuiButton-contained").click();
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(3000);
  });
  it("test messaging button", () => {
    cy.visit("http://localhost:3000/network");
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(3000);
    cy.get(
      ':nth-child(2) > :nth-child(1) > .css-nwqh5 > [data-cy="userProfileInNetwork"] > .MuiBox-root > .MuiCardActions-root > .MuiButton-outlined'
    ).click();
    cy.wait(3000);
  });
});
