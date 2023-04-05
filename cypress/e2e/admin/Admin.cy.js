describe("Testing the admin reported messages feature", () => {
  //   beforeEach(() => {
  //     // Cypress starts out with a blank slate for each test
  //     // so we must tell it to visit our website with the `cy.visit()` command.
  //     // Since we want to visit the same URL at the start of all our tests,
  //     // we include it in our beforeEach function so that it runs before each test
  //     cy.visit("http://localhost:3000");
  //     cy.logout();
  //     cy.login();
  //     cy.visit("http://localhost:3000/admin/flaggedmessages");
  //   });

  //   // describe("Testing the Flagged Messages portal", () => {
  //   //   it("Selects some rows", () => {
  //   //     cy.get(
  //   //       '[data-id="0"] > .MuiDataGrid-cellCheckbox > .MuiButtonBase-root > .PrivateSwitchBase-input'
  //   //     ).click();
  //   //     cy.get(
  //   //       ".MuiDataGrid-row--lastVisible > .MuiDataGrid-cellCheckbox > .MuiButtonBase-root > .PrivateSwitchBase-input"
  //   //     ).click();
  //   //   });
  //   // });

  //   // should add a test where we go to messaging, report a message and then find that message in the admin page
  it("Logs into flagged users accoount and writes 3 messages to the admin account", () => {
    cy.logout();
    cy.visit("http://localhost:3000/login");
    cy.get("#email").type("flaggedUsers@test.com");
    cy.get("#password").type("test@123");
    // cy.get("#email").focus();
    cy.get(".MuiButton-contained").click();
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(1000);

    //     //goes to messaging page and selects first convo (should be between Flagged Users account & admin15)
    cy.visit("http://localhost:3000/messaging");
    cy.wait(1000);

    cy.get(":nth-child(2) > .MuiListItemText-root > .MuiTypography-body1")
      .should("have.text", "Admin15 Test")
      .click();

    //write 3 messages
    cy.get("#message-input").should("be.visible").type("toUnflag");
    cy.get('[data-testid="SendRoundedIcon"]').should("be.visible").click();
    cy.get("#message-chats").last().should("contain", "toUnflag");
    cy.wait(500);

    cy.get("#message-input").should("be.visible").type("toWarn");
    cy.get('[data-testid="SendRoundedIcon"]').should("be.visible").click();
    cy.get("#message-chats").last().should("contain", "toWarn");
    cy.wait(500);

    cy.get("#message-input").should("be.visible").type("toBlock");
    cy.get('[data-testid="SendRoundedIcon"]').should("be.visible").click();
    cy.get("#message-chats").last().should("contain", "toBlock");
    cy.wait(1000);
  });

  it("Login to admin15 test account and report the 3 messages", () => {
    cy.logout();
    cy.visit("http://localhost:3000/login");
    cy.get("#email").type("admin15@test.com");
    cy.get("#password").type("test@123");
    cy.get("#email").focus();
    cy.get(".MuiButton-contained").click();
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(1000);

    //selects first convo (should be between Flagged Users account & admin15)
    cy.visit("http://localhost:3000/messaging");
    cy.wait(1000);

    cy.get(":nth-child(1) > .MuiListItemText-root > .MuiTypography-body1")
      .should("have.text", "Flagged User Test")
      .click();

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

  it("Goes to flagged messages page and clicks all 3 buttons, then goes to the blocked users page", () => {
    cy.visit("http://localhost:3000/admin/flaggedMessages");
    cy.wait(1000);

    // unflag a message
    cy.get(
      '.MuiDataGrid-row:nth-last-child(10)  > [data-field="user"] > .MuiDataGrid-cellContent'
    ).should("have.text", "flaggedusers@test.com");
    cy.get(
      '.MuiDataGrid-row:nth-last-child(10) > [data-field="unflag"] > .MuiButtonBase-root'
    ).click();
    cy.wait(1000);

    // warn a user
    cy.get(
      '.MuiDataGrid-row:nth-last-child(10)  > [data-field="user"] > .MuiDataGrid-cellContent'
    ).should("have.text", "flaggedusers@test.com");

    cy.get(
      '.MuiDataGrid-row:nth-last-child(10) > [data-field="warn"] > .MuiButtonBase-root'
    ).click();
    cy.wait(1000);

    // ban a user
    cy.get(
      '.MuiDataGrid-row:nth-last-child(10)  > [data-field="user"] > .MuiDataGrid-cellContent'
    ).should("have.text", "flaggedusers@test.com");

    cy.get(
      '.MuiDataGrid-row:nth-last-child(10) > [data-field="ban"] > .MuiButtonBase-root'
    ).click();
    cy.wait(1000);

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
  });
});
