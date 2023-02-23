import React from "react";
import { BrowserRouter } from "react-router-dom";
// import SignUp from "../Pages/SignUp/SignUp";
import Messaging from "../../src/Pages/Messaging/Messaging";
import "cypress-file-upload";

describe("Testing the messaging feature", () => {
  beforeEach(() => {
    cy.viewport(1920, 1080);

    cy.visit("http://localhost:3000");
  });

  it("testing messaging's buttons and title", () => {
    const uid = "Eg7aTo5gtRCYjx3ggCJLOWnxVRFp2";
    const tenantId = "hypeboy@tok.ki";
    cy.login(uid, undefined, tenantId);

    //cy.get(".convo-list > .MuiList-root > :nth-child(1)").click();
    //cy.get("#message-input").type("Hello test");
    //cy.get('[data-cy="file_input"]').should("not.exist");
    //cy.get(".css-1yyxpsu-MuiGrid2-root").click();
    //cy.get("#message-chats").contains("Hello test");
    //cy.get("#message-input").should("be.empty");
    //cy.get(":nth-child(1) > .message-stack > .css-k9lbh4").scrollIntoView();
    //cy.get("#message-chats").contains("mr right now");
    //cy.get("#message-chats").contains("Hello test");
    // cy.get('.MuiGrid-container > [align="right"]');
    // cy.get('[align="right"] > .MuiButtonBase-root');
    //    cy.get(".MuiBox-root > .MuiTypography-root").contains("Messaging");
    /* const fileName = "IMG_0524.jpg";
    cy.fixture(fileName)
      .then((fileContent) => {
        cy.get('[data-cy="file_input"]').attachFile({
          fileContent: fileContent.toString(),
          fileName,
          mimeType: "image/jpg",
        });
      })
      .then(() => {
        cy.get("#file-preview > .MuiBox-root").should("be.visible");
        cy.get('[data-cy="send-button"]').click();
        cy.get("#message-chats").contains("jo.jpg");
      });*/
  });
});
