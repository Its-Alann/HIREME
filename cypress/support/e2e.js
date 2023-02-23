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
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/database";
import "firebase/compat/firestore";
import { attachCustomCommands } from "cypress-firebase";

const fbConfig = {
  // Your config from Firebase Console
  apiKey: "AIzaSyAtBgQOP98BP-kfPojULSjRj6enAuToJ_I",
  authDomain: "team-ate.firebaseapp.com",
  projectId: "team-ate",
  storageBucket: "team-ate.appspot.com",
  messagingSenderId: "1078110272163",
  appId: "1:1078110272163:web:3c0ac8143d1ed0ceb8dd16",
  measurementId: "G-PJ6PRNK71S",
  serviceAccountId:
    "firebase-service-account@firebase-sa-management.iam.gserviceaccount.com",
};

firebase.initializeApp(fbConfig);

attachCustomCommands({ Cypress, cy, firebase });

import { mount } from "cypress/react18";
// https://github.com/bahmutov/cypress-code-coverage
import "@bahmutov/cypress-code-coverage/support";
import "@cypress/code-coverage/support";

Cypress.Commands.add("mount", mount);
// Alternatively you can use CommonJS syntax:
// require('./commands')
