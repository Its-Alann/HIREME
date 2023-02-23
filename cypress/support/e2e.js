// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import "./commands";

import { mount } from "cypress/react18";
// https://github.com/bahmutov/cypress-code-coverage
import "@bahmutov/cypress-code-coverage/support";
import "@cypress/code-coverage/support";

Cypress.Commands.add("mount", mount);
// Alternatively you can use CommonJS syntax:
// require('./commands')
