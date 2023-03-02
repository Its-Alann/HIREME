// import React from "react";
// import { BrowserRouter } from "react-router-dom";
// // import SignUp from "../Pages/SignUp/SignUp";
// import Messaging from "../../src/Pages/Messaging/Messaging";
import "cypress-file-upload";

describe("<Messaging />", () => {
  // it("renders", () => {
  //   // see: https://on.cypress.io/mounting-react
  //   cy.mount(
  //     <BrowserRouter>
  //       <Messaging />
  //     </BrowserRouter>
  //   );
  // });

  beforeEach(() => {
    cy.viewport(1920, 1080);

    // // login
    cy.visit("http://localhost:3000/login");
    cy.get("#email").type("hypeboy@tok.ki");
    cy.get("#password").type("newjeans");
    cy.get(".MuiButton-contained").click();

    // cy.mount(
    //   <BrowserRouter>
    //     <Messaging />
    //   </BrowserRouter>
    // );
    cy.wait(2000);

    cy.visit("http://localhost:3000/messaging");
    cy.wait(2000);
  });

  it("testing messaging's buttons and title", () => {
    cy.get(".convo-list > .MuiList-root > :nth-child(1)").click();
    cy.get("#message-input").type("Hello test");
    cy.get('[data-cy="file_input"]').should("not.exist");
    cy.get('[data-cy="send-button"]').click();
    cy.get("#message-chats").contains("Hello test");
    cy.get("#message-input").should("be.empty");
    cy.get(":nth-child(1) > .message-stack > .css-k9lbh4").scrollIntoView();
    cy.get("#message-chats").contains("mr right now");
    cy.get("#message-chats").contains("Hello test");

    // cy.get('.MuiGrid-container > [align="right"]');
    // cy.get('[align="right"] > .MuiButtonBase-root');

    cy.get(".MuiBox-root > .MuiTypography-root").contains("Messaging");
    // cy.get('[align="center"] > .MuiButtonBase-root').click();
    // cy.get('[data-cy="file_input_label"]').click();

    const fileName = "IMG_0524.jpg";
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
      });
  });
});
