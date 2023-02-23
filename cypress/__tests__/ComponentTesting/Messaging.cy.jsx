import React from "react";
import { BrowserRouter } from "react-router-dom";
// import SignUp from "../Pages/SignUp/SignUp";
// import Messaging from "../../../src/Pages/Messaging/Messaging";
//import "cypress-file-upload";

describe("Login to test account", () => {
  it("Logs into test account", () => {
    cy.visit("http://localhost:3000/login");
    cy.get("#email").type("accountcreation@test.com");
    cy.get("#password").type("test123");
    cy.get("input").tab();
    cy.get(".MuiButton-contained").click();
  });
});

  beforeEach(() => {
    cy.viewport(1920, 1080);

    // // login
    /*     cy.visit("http://localhost:3000/login");
    cy.get("#email").type("hypeboy@tok.ki");
    cy.get("#password").type("newjeans"); */

    // cy.mount(
    //   <BrowserRouter>
    //     <Messaging />
    //   </BrowserRouter>
    // );
  });
  // it("testing messaging's buttons and title", () => {
    /*cy.get("#outlined-basic-email").type("Hello test");
    cy.get('.MuiGrid-container > [align="right"]');
    cy.get('[align="right"] > .MuiButtonBase-root');

    cy.get(".MuiBox-root > .MuiTypography-root").contains("Messaging");
    cy.get('[align="center"] > .MuiButtonBase-root').click();*/
    /*     cy.fixture("jo.jpg").then((fileContent) => {
      cy.get(".chooseFile").attachFile({
        fileContent: fileContent.toString(),
        fileName: "jo.jpg",
        mimeType: "image/jpg",
      });
    }); */
  // });
});
