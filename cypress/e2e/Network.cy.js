import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import {
  doc,
  updateDoc as update,
  arrayUnion,
  arrayRemove,
  deleteDoc,
  FieldValue,
} from "firebase/firestore";
import { db } from "../../src/Firebase/firebase";

//async function to remove a sent invitation to
async function AsyncRemoveSentInvitation(RemoveAcc, fromAcc) {
  const sentInvitationsRef = doc(db, "invitations", fromAcc);
  // Atomically remove a region from the "regions" array field.
  // Atomically remove a region from the "regions" array field.
  await update(sentInvitationsRef, {
    sentInvitations: arrayRemove(RemoveAcc),
  });
}

//async function to remove a received invitation
async function AsyncRemoveReceivedInvitation(RemoveAcc, fromAcc) {
  const receivedInvitationsRef = doc(db, "invitations", fromAcc);
  // Atomically remove a region from the "regions" array field.
  // Atomically remove a region from the "regions" array field.
  await update(receivedInvitationsRef, {
    receivedInvitations: arrayRemove(RemoveAcc),
  });
}
//reference to document network and element accountcreation@test.com

//async function to remove connected user accountcreation@test.com from hypeboy@tok.ki
async function AsyncRemoveConnectedUser(RemoveAcc, fromAcc) {
  const connectedUsersRef = doc(db, "network", fromAcc);
  // Atomically remove a region from the "regions" array field.
  // Atomically remove a region from the "regions" array field.
  await update(connectedUsersRef, {
    connectedUsers: arrayRemove(RemoveAcc),
  });
}

describe("Testing the networking feature of the app", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/");
    // Cypress starts out with a blank slate for each test
    // so we must tell it to visit our website with the `cy.visit()` command.
    // Since we want to visit the same URL at the start of all our tests,
    // we include it in our beforeEach function so that it runs before each test
  });

  //No received invitations yet :/
  //No sent invitations :/
  //No connections yet :/

  describe("Testing the different tabs of networking", () => {
    it("Switch to Received Invitations and Sent invitations Tab", () => {
      //fails when tabs are empty, loign uid gives problems
      cy.logout();

      //List of accounts
      //"g7aTo5gtRCYjx3ggCJLOWnxVRFp2" hypeboy@tok.ki
      //CqtAL3huXbQyo0ZAHNcRkvWbfBc2 billybob@gmail.com
      //sjMRME25ceRusKoIEmN1jVcwF4F2 accountcreation@test2.com
      //fZ54oR1iGTfwThreKpnuklsV5JC2 aliceykchen01@gmail.com
      //QdFFUPgmxrdGl8IT72Jgm1Ooc6p2 accountcreation@test.com

      //Go to hypeboy's account
      const uid = "g7aTo5gtRCYjx3ggCJLOWnxVRFp2";
      //login to hypeboy's account
      cy.login(uid);

      //visit both possible connections and network pages
      cy.visit("http://localhost:3000/possibleConnections");
      cy.visit("http://localhost:3000/network");
      //click on view profile of the first user
      //needs to be modified
      cy.get(
        ":nth-child(2) > :nth-child(1) > .MuiContainer-root > .css-12ke8jn > .MuiGrid-container > :nth-child(1) > :nth-child(1) > .css-nwqh5 > .MuiPaper-root > .MuiBox-root > .MuiCardActions-root > .MuiButton-text"
      ).click();

      //switch to sent and received invitations tabs
      cy.get('[data-cy="SentInvitationTab"]').click();
      cy.get('[data-cy="ReceivedInvitationTab"]').click();

      //revisit the pages
      cy.visit("http://localhost:3000/network");
      cy.visit("http://localhost:3000/possibleConnections");
    });
  });

  describe("sends an invitation from possible connections page and tries different scenarios", () => {
    it("removes the connected user, sends the invitation", () => {
      //remove sent invitation of accountcreation@test.com from "hypeboy@tok.ki"
      cy.wrap(null).then(() =>
        AsyncRemoveReceivedInvitation(
          "hypeboy@tok.ki",
          "accountcreation@test.com"
        )
      );
      //remove sent invitation of accountcreation@test.com from "hypeboy@tok.ki"
      cy.wrap(null).then(() =>
        AsyncRemoveSentInvitation("accountcreation@test.com", "hypeboy@tok.ki")
      );
      //remove hypeboy@tok.ki from connected users
      cy.wrap(null).then(() =>
        AsyncRemoveConnectedUser("hypeboy@tok.ki", "accountcreation@test.com")
      );
      //remove accountcreation@test.com from connected users
      cy.wrap(null).then(() =>
        AsyncRemoveConnectedUser("accountcreation@test.com", "hypeboy@tok.ki")
      );

      //logout and login to hypeboy@tok.ki account
      cy.logout();
      cy.login("g7aTo5gtRCYjx3ggCJLOWnxVRFp2");

      //vist both pages
      cy.visit("http://localhost:3000/network");
      cy.visit("http://localhost:3000/possibleConnections");

      //send invitation
      //needs to be specified
      cy.get('[data-cy="invitationButton"]').click();
    });

    it("ignores the invitation from the account that received it", () => {
      cy.logout();
      //login to accountcreation@test.com
      cy.login("QdFFUPgmxrdGl8IT72Jgm1Ooc6p2");
      cy.visit("http://localhost:3000/network");
      cy.get('[data-cy="SentInvitationTab"]').click();
      cy.get('[data-cy="ReceivedInvitationTab"]').click();

      //IgnoreInvitationBtn
      cy.get('[data-cy="IgnoreInvitationBtn"]').click();
      //visit all tabs
      cy.get('[data-cy="SentInvitationTab"]').click();
      cy.get('[data-cy="ReceivedInvitationTab"]').click();
      cy.get('[data-cy="NetworkTab"]').click();

      //logout and login to hypeboy@tok.ki account
      cy.logout();
      cy.login("g7aTo5gtRCYjx3ggCJLOWnxVRFp2");

      //vist network page and all tabs
      cy.visit("http://localhost:3000/network");
      //visit all tabs
      cy.get('[data-cy="SentInvitationTab"]').click();
      cy.get('[data-cy="ReceivedInvitationTab"]').click();
      cy.get('[data-cy="NetworkTab"]').click();
    });

    it("removes the sent invitation, checks whether invitation is present on possible connections page and sends invitation", () => {
      cy.logout();
      //remove sent invitation of accountcreation@test.com from "hypeboy@tok.ki"
      cy.wrap(null).then(() =>
        AsyncRemoveReceivedInvitation(
          "hypeboy@tok.ki",
          "accountcreation@test.com"
        )
      );

      //remove sent invitation of accountcreation@test.com from "hypeboy@tok.ki"
      cy.wrap(null).then(() =>
        AsyncRemoveSentInvitation("accountcreation@test.com", "hypeboy@tok.ki")
      );
      //remove hypeboy@tok.ki from connected users
      cy.wrap(null).then(() =>
        AsyncRemoveConnectedUser("hypeboy@tok.ki", "accountcreation@test.com")
      );
      //remove accountcreation@test.com from connected users
      cy.wrap(null).then(() =>
        AsyncRemoveConnectedUser("accountcreation@test.com", "hypeboy@tok.ki")
      );

      //login to hypeboy@tok.ki account
      cy.login("g7aTo5gtRCYjx3ggCJLOWnxVRFp2");

      //vist both pages
      cy.visit("http://localhost:3000/network");
      cy.visit("http://localhost:3000/possibleConnections");

      //send invitation
      cy.get('[data-cy="invitationButton"]').click();
      //WEIRD CYPRESS BUG: TEST MUST END AFTER INVITATION CLICK FOR IT TO TAKE EFFECT
    });

    it("withdraws the invitation that was sent from the right account", () => {
      //vist network page and all tabs
      cy.visit("http://localhost:3000/network");
      //visit all tabs
      cy.get('[data-cy="SentInvitationTab"]').click();
      //verify that last user is the user we sent the invitation to (could be modified to a find if last invitation != last user that appears)
      //name of the user is "Test User"
      if (
        cy.get('[data-cy="invitationsGrid"]').last("Grid").contains("Test User")
      ) {
        cy.get('[data-cy="invitationsGrid"]')
          .last("Grid")
          .within(() => cy.get("#withdrawButton").click());
      }
    });

    it("removes the sent invitation, checks whether invitation is present on possible connections page and sends invitation", () => {
      cy.logout();
      //remove sent invitation of accountcreation@test.com from "hypeboy@tok.ki"
      cy.wrap(null).then(() =>
        AsyncRemoveReceivedInvitation(
          "hypeboy@tok.ki",
          "accountcreation@test.com"
        )
      );

      //remove sent invitation of accountcreation@test.com from "hypeboy@tok.ki"
      cy.wrap(null).then(() =>
        AsyncRemoveSentInvitation("accountcreation@test.com", "hypeboy@tok.ki")
      );
      //remove hypeboy@tok.ki from connected users
      cy.wrap(null).then(() =>
        AsyncRemoveConnectedUser("hypeboy@tok.ki", "accountcreation@test.com")
      );
      //remove accountcreation@test.com from connected users
      cy.wrap(null).then(() =>
        AsyncRemoveConnectedUser("accountcreation@test.com", "hypeboy@tok.ki")
      );

      //login to hypeboy@tok.ki account
      cy.login("g7aTo5gtRCYjx3ggCJLOWnxVRFp2");

      //vist both pages
      cy.visit("http://localhost:3000/network");
      cy.visit("http://localhost:3000/possibleConnections");

      //send invitation
      //needs to be specified
      cy.get('[data-cy="invitationButton"]').click();
      //WEIRD CYPRESS BUG: TEST MUST END AFTER INVITATION CLICK FOR IT TO TAKE EFFECT
    });

    it("visits the page again to ensure the user is not present on possible connections anymore", () => {
      //visit all tabs
      cy.visit("http://localhost:3000/network");

      cy.get('[data-cy="SentInvitationTab"]').click();
      cy.get('[data-cy="ReceivedInvitationTab"]').click();
      cy.get('[data-cy="NetworkTab"]').click();
    });

    it("logs, logs in to account with the invitation and accepts it", () => {
      //logout, login to createaccount, accept invitation
      cy.logout();
      cy.login("QdFFUPgmxrdGl8IT72Jgm1Ooc6p2");
      cy.visit("http://localhost:3000/network");
      cy.get('[data-cy="SentInvitationTab"]').click();
      cy.get('[data-cy="ReceivedInvitationTab"]').click();
      //Gives problems at times, especially when not last action in test
      cy.get('[data-cy="AcceptInvitationBtn"]').click();
    });

    it("verify user has been added to the network once added", () => {
      //logout and login to hypeboy@tok.ki account
      cy.logout();
      cy.login("QdFFUPgmxrdGl8IT72Jgm1Ooc6p2");
      cy.visit("http://localhost:3000/network");
      cy.get('[data-cy="ReceivedInvitationTab"]').click();
      //forcing click
      cy.get('[data-cy="AcceptInvitationBtn"]').click({ force: true });
      //switching to network tab
      cy.get('[data-cy="NetworkTab"]').click();
      //check if profile exists
      cy.get('[data-cy="userProfileInNetwork"]').findByText("Hanni Pham");
      cy.visit("http://localhost:3000/possibleConnections");
    });
  });
});
