import React from "react";
import { BrowserRouter } from "react-router-dom";
// import SignUp from "../Pages/SignUp/SignUp";
import Messaging from "../Pages/Messaging/Messaging";
import "cypress-file-upload";

describe("<Messaging />", () => {
  it("renders", () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(
      <BrowserRouter>
        <Messaging />
      </BrowserRouter>
    );
  });

  beforeEach(() => {
    cy.viewport(1920, 1080);
    cy.mount(
      <BrowserRouter>
        <Messaging />
      </BrowserRouter>
    );
  });
  it("testing messaging's buttons and title", () => {
    cy.get("#outlined-basic-email").type("Hello test");
    cy.get('.MuiGrid-container > [align="right"]');
    cy.get('[align="right"] > .MuiButtonBase-root');

    cy.get(".MuiBox-root > .MuiTypography-root").contains("Messaging");
    cy.get('[align="center"] > .MuiButtonBase-root').click();

    cy.fixture("jo.jpg").then((fileContent) => {
      cy.get(".chooseFile").attachFile({
        fileContent: fileContent.toString(),
        fileName: "jo.jpg",
        mimeType: "image/jpg",
      });
    });
  });
});
