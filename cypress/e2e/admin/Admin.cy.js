/* eslint-disable cypress/no-unnecessary-waiting */
beforeEach(() => {
  cy.viewport(1920, 1080);
});

describe("Login to test account", () => {
  it("Logs into test account", () => {
    cy.logout();
    cy.visit("http://localhost:3000/login");
    cy.get("#email").type("flaggedUsers@test.com");
    cy.get("#password").type("test@123");
    cy.get("#email").focus();
    cy.get(".MuiButton-contained").click();
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(3000);
  });
});

describe("Reports messages", () => {
  // should add a test where we go to messaging, report a message and then find that message in the admin page
  it("writes 3 messages to the second account", () => {
    //     //goes to messaging page and selects first convo (should be between Flagged Users account & admin15)
    cy.visit("http://localhost:3000/messaging");
    cy.wait(1000);

    cy.get(":nth-child(2) > .MuiListItemText-root > .MuiTypography-body1")
      .should("have.text", "Flagged Users 2")
      .click();

    //write 3 messages
    cy.get("#message-input").should("be.visible").type("toUnflag");
    cy.get('[data-testid="SendRoundedIcon"]').should("be.visible").click();
    cy.wait(1000);
    cy.get("#message-chats").last().should("contain", "toUnflag");

    cy.get("#message-input").should("be.visible").type("toWarn");
    cy.get('[data-testid="SendRoundedIcon"]').should("be.visible").click();
    cy.wait(1000);
    cy.get("#message-chats").last().should("contain", "toWarn");

    cy.get("#message-input").should("be.visible").type("toBlock");
    cy.get('[data-testid="SendRoundedIcon"]').should("be.visible").click();
    cy.wait(1000);
    cy.get("#message-chats").last().should("contain", "toBlock");
  });

  it("Login to the second test account", () => {
    cy.logout();
    cy.visit("http://localhost:3000/login");
    cy.get("#email").type("flaggedusers2@test.com");
    cy.get("#password").type("test@123");
    cy.get("#email").focus();
    cy.get(".MuiButton-contained").click();
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(3000);
  });

  it("reports the messages that the user has sent", () => {
    //selects first convo (should be between Flagged Users account & admin15)
    cy.visit("http://localhost:3000/messaging");
    cy.wait(1000);

    cy.get(":nth-child(1) > .MuiListItemText-root > .MuiTypography-body1")
      .should("have.text", "Flagged User Test")
      .click();

    // cy.wait(500);

    // report last 3 messages
    cy.get(".messageOptions").last().invoke("show").click({ force: true });
    cy.get(".reportMsgButton").click();
    cy.get('[data-testid="reportedBadge"]').should("be.visible");

    cy.get(".messageOptions").eq(-2).invoke("show").click({ force: true });
    cy.get(
      ":nth-child(7) > .MuiPaper-root > .MuiList-root > .MuiButtonBase-root"
    ).click();
    cy.get('[data-testid="reportedBadge"]').should("be.visible");

    cy.get(".messageOptions").eq(-3).invoke("show").click({ force: true });
    cy.get(
      ":nth-child(8) > .MuiPaper-root > .MuiList-root > .MuiButtonBase-root"
    ).click();
    cy.get('[data-testid="reportedBadge"]').should("be.visible");
  });
});

describe("Admin Features", () => {
  it("Login to admin15 test account", () => {
    cy.logout();
    cy.visit("http://localhost:3000/login");
    cy.get("#email").type("admin15@test.com");
    cy.get("#password").type("test@123");
    cy.get("#email").focus();
    cy.get(".MuiButton-contained").click();
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(3000);
  });

  it("clicks on the 3 buttons", () => {
    cy.visit("http://localhost:3000/admin/flaggedMessages");
    cy.wait(500);

    // unflag a message
    cy.get(
      '.MuiDataGrid-row:nth-last-child(10)  > [data-field="user"] > .MuiDataGrid-cellContent'
    ).should("have.text", "flaggedusers@test.com");
    cy.get(
      '.MuiDataGrid-row:nth-last-child(10) > [data-field="unflag"] > .MuiButtonBase-root'
    ).click();
    cy.wait(500);

    // warn a user
    cy.get(
      '.MuiDataGrid-row:nth-last-child(10)  > [data-field="user"] > .MuiDataGrid-cellContent'
    ).should("have.text", "flaggedusers@test.com");

    cy.get(
      '.MuiDataGrid-row:nth-last-child(10) > [data-field="warn"] > .MuiButtonBase-root'
    ).click();
    cy.wait(500);

    // ban a user
    cy.get(
      '.MuiDataGrid-row:nth-last-child(10)  > [data-field="user"] > .MuiDataGrid-cellContent'
    ).should("have.text", "flaggedusers@test.com");

    cy.get(
      '.MuiDataGrid-row:nth-last-child(10) > [data-field="ban"] > .MuiButtonBase-root'
    ).click();
    cy.wait(1000);
  });

  it("unbans the user", () => {
    cy.visit("http://localhost:3000/admin/flaggedMessages");

    // go to banned users tab
    cy.get('.MuiTabs-flexContainer > [tabindex="-1"]').click();
    cy.wait(500);

    // unban the user
    cy.get(
      ".MuiDataGrid-row--lastVisible > .MuiDataGrid-cell--textLeft > .MuiDataGrid-cellContent"
    ).should("have.text", "flaggedusers@test.com");
    cy.get(
      '.MuiDataGrid-row--lastVisible > [data-field="unbanned"] > .MuiButtonBase-root'
    ).click();
    // unbans the user
    cy.wait(500);
  });

  it("Logs out", () => {
    cy.visit("http://localhost:3000/");
    cy.logout();
    cy.wait(1000);
  });
});
