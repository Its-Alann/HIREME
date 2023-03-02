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

describe("template spec", () => {
  it("test template and testing other pages via testingOtherPages ", () => {
    cy.logout();
    cy.login("g7aTo5gtRCYjx3ggCJLOWnxVRFp2");
    cy.visit("http://localhost:3000/possibleConnections");
    cy.visit("http://localhost:3000/testingOtherPages");
  });
});

describe("template spec", () => {});
