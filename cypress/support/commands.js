// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
import "@testing-library/cypress/add-commands";
import "@cypress/code-coverage/support";

//command added from https://github.com/cypress-io/cypress/issues/395

function ifExistsClick(selector) {
  cy.document().then(($document) => {
    const documentResult = $document.querySelectorAll(selector);
    if (documentResult.length) {
      // Do something
      documentResult.click();
    }
  });
}

Cypress.Commands.add("ifExistsClick", ifExistsClick);

require("cypress-plugin-tab");
