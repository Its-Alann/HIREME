import React, { useEffect, useState } from "react";
import { Box, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  Timestamp,
  query,
  where,
  addDoc,
  arrayUnion,
} from "firebase/firestore";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { useTranslation } from "react-i18next";
import { getAuth, getUserByEmail } from "firebase/auth";
import { auth, db } from "../../Firebase/firebase";

const FlaggedMessages = () => {
  // Set the strings based on the language defined by the user
  const { t, i18n } = useTranslation();
  // array of reported message objects
  const [reportedMessages, setReportedMessages] = useState([]);
  // array of blocked users
  const [blockedUsers, setBlockedUsers] = useState([]);
  // holds value of currently selected tab
  const [value, setValue] = useState(0);

  // removes message from flagged messages
  const unflagUser = async (docID) => {
    console.log("in unflag", docID);
    try {
      await deleteDoc(doc(db, "reportedMessages", docID));
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  // returns a convo id for the warning message from Admin
  const getConversationId = async (authorsList) => {
    authorsList.sort();
    const messagesRef = collection(db, "messages");
    const convoQuery = query(messagesRef, where("authors", "==", authorsList));
    const querySnapshot = await getDocs(convoQuery);

    // if no conversation between these users exists, create a new one
    if (querySnapshot.empty) {
      const docRef = await addDoc(collection(db, "messages"), {
        authors: authorsList,
        messages: [],
      });
      console.log(
        "findConversation: no existing conversation found, creating new one between",
        authorsList,
        "new id:",
        docRef.id
      );
      return docRef.id;
    }
    console.log(
      "Existing conversations found between",
      authorsList,
      "id:",
      querySnapshot.docs[0].id
    );
    return querySnapshot.docs[0].id;
  };
  // send warning to user & unflags them
  const handleSend = async (userEmail, convId) => {
    // Format a new message
    const timestamp = Timestamp.now();
    const content = "You have been WARNED by the admin. Be better.";
    const sender = "admin@hireme.com";
    const newMessage = {
      timestamp,
      sender,
      content,
      seenBy: [sender],
    };
    console.log("NEWWW", newMessage);

    // SENDS TO THE DB
    // ex id: "17k4dPDcymw3GcNjSCSG"
    const convoId = await getConversationId([sender, userEmail]);
    console.log("concvooo", convoId);

    await updateDoc(doc(db, "messages", convoId), {
      messages: arrayUnion(newMessage),
    });
    unflagUser(convId);
  };

  // functioon the takes the email of the user to be blocked, and adds this email to the blocked users collection
  const handleBlockUser = async (email) => {
    const blockedUserRef = doc(db, "blockedUsers", email);
    await setDoc(blockedUserRef, {});

    try {
      const messagesRef = collection(db, "reportedMessages");
      const q = query(messagesRef, where("sender", "==", email));
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach((document) => {
        console.log(document.id);
        // deleteDoc(document.ref);
        deleteDoc(doc(db, "reportedMessages", document.id));
      });

      localStorage.setItem("activeTab", 0);
      setTimeout(() => window.location.reload(), 100);

      // Add ban: true in userProfile
    } catch (err) {
      console.log(err);
    }
  };
  // this function unblocks a user by deleting the document with the email as docID from the blockedusers collection
  const handleUnblockUser = async (email) => {
    try {
      await deleteDoc(doc(db, "blockedUsers", email));
      localStorage.setItem("activeTab", 1);
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  // these columns should appear in the flagged messagess page
  const columnsFlagged = [
    {
      field: "user",
      numeric: false,
      width: 240,
      headerName: `${t("User")}`,
    },
    {
      field: "message",
      numeric: false,
      width: 360,
      headerName: `${t("FlaggedMessage🚩")}`,
    },
    {
      field: "type",
      numeric: false,
      width: 90,
      headerName: `${t("Type")}`,
    },
    {
      field: "date",
      numeric: false,
      width: 180,
      headerName: `${t("Date")}`,
    },
    {
      field: "unflag",
      width: 180,
      headerName: `${t("Unflag")}`,
      headerAlign: "center",
      sortable: false,
      filterable: false,
      hidecolumn: false,
      disableColumnMenu: true,
      align: "center",
      renderCell: (params) => (
        <Button
          variant="contained"
          size="small"
          onClick={() =>
            unflagUser(`${params.row.convoId}-${params.row.index}`)
          }
        >
          X
        </Button>
      ),
    },
    {
      field: "warn",
      width: 180,
      headerName: `${t("Warn")}`,
      headerAlign: "center",
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      align: "center",
      renderCell: (params) => (
        <Button
          variant="contained"
          sx={{ backgroundColor: "#DF9000" }}
          size="small"
          onClick={() =>
            handleSend(
              params.row.user,
              `${params.row.convoId}-${params.row.index}`
            )
          }
        >
          X
        </Button>
      ),
    },
    {
      field: "ban",
      width: 180,
      headerName: `${t("Ban")}`,
      headerAlign: "center",
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      align: "center",
      renderCell: (params) => (
        <Button
          variant="contained"
          sx={{ backgroundColor: "#C41E3A" }}
          size="small"
          onClick={() => handleBlockUser(params.row.user)}
        >
          X
        </Button>
      ),
    },
  ];

  // these columns should appear in the blocked users tab
  const columnsBlocked = [
    // { field: "id", headerName: "ID", width: 90 },
    {
      field: "user",
      numeric: false,
      width: 240,
      headerName: `${t("User")}`,
    },
    {
      field: "unbanned",
      width: 180,
      headerName: `${t("Unban")}`,
      headerAlign: "center",
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      align: "center",
      renderCell: (params) => (
        <Button
          variant="contained"
          sx={{ backgroundColor: "#C41E3A" }}
          size="small"
          onClick={() => handleUnblockUser(params.row.user)}
        >
          X
        </Button>
      ),
    },
  ];

  // fetch the reported messages from the database
  const getReportedMessages = async () => {
    const reportedMessagesRef = collection(db, "reportedMessages");

    const reportedQuerySnapshot = await getDocs(reportedMessagesRef);
    const tempFlagged = [];
    const tempBlocked = [];
    let ii = 0;
    reportedQuerySnapshot.forEach((document) => {
      const resData = document.data();
      const thingy = {
        user: resData.sender,
        message: resData.content || resData.attachment || null,
        date: resData.timestamp.toDate(),
        type: resData.content ? "content" : "attachment",
        index: resData.index,
        convoId: resData.convoId,
        id: ii,
      };
      tempFlagged.push(thingy);
      // tempBlocked.push(thingy);

      ii += 1;
    });

    setReportedMessages(tempFlagged);
  };

  // this functiono fetches sall blocked users from blocked users collection in database
  const getBlockedUsers = async () => {
    const blockedUsersRef = collection(db, "blockedUsers");
    const querySnapshot = await getDocs(blockedUsersRef);
    const blockedUsersArr = [];
    let ii = 0;
    querySnapshot.forEach((document) => {
      const thingy2 = {
        user: document.id,
        id: ii,
      };
      blockedUsersArr.push(thingy2);
      ii += 1;
    });
    setBlockedUsers(blockedUsersArr);
  };

  // useeffect that populates tabs with the right informattioon either selects the right tab with reported messages or blocked users
  useEffect(() => {
    const storedActiveTab = localStorage.getItem("activeTab");
    if (storedActiveTab) {
      setValue(parseInt(storedActiveTab, 10));
    }
    getReportedMessages();
    getBlockedUsers();
  }, []);

  const handleChange = (event, newValue) => {
    localStorage.setItem("activeTab", newValue);
    setValue(newValue);
  };

  return (
    <>
      {/* TODO: make mass report / warn users with the checklist
            selected rows are in the selectedRowData useState
      */}
      <Tabs
        value={value}
        onChange={handleChange}
        aria-label="basic tabs example"
      >
        <Tab label={t("Flagged")} value={0} />
        <Tab label={t("Banned")} value={1} />
      </Tabs>
      <Box sx={{ height: 700, width: "100%" }}>
        <DataGrid
          rows={value === 0 ? reportedMessages : blockedUsers}
          columns={value === 0 ? columnsFlagged : columnsBlocked}
          pageSizeOptions={[10]}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
            sorting: { sortModel: [{ field: "date", sort: "desc" }] },
          }}
        />
      </Box>
      )
    </>
  );
};

FlaggedMessages.propTypes = {};

export default FlaggedMessages;
