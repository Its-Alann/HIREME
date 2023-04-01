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
import { getAuth, getUserByEmail } from "firebase/auth";

import { auth, db } from "../../Firebase/firebase";

const FlaggedMessages = () => {
  // array of reported message objects
  const [reportedMessages, setReportedMessages] = useState([]);
  // const [blockedMessages, setBlockedMessages] = useState([]);

  const [selectedRowData, setSelectedRowData] = useState([]);

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

    // probably redundant cause it should exist
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
  // these columns should appear in the flagged messagess page
  const columnsFlagged = [
    // { field: "id", headerName: "ID", width: 90 },
    {
      field: "user",
      numeric: false,
      width: 240,
      headerName: "User",
    },
    {
      field: "message",
      numeric: false,
      width: 360,
      headerName: "Flagged Message 🚩",
    },
    {
      field: "type",
      numeric: false,
      width: 90,
      headerName: "Type",
    },
    {
      field: "date",
      numeric: false,
      width: 180,
      headerName: "Date",
    },
    {
      field: "unflag",
      width: 180,
      headerName: "Unflag",
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
      headerName: "Warn",
      headerAlign: "center",
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      align: "center",
      renderCell: (params) => {
        console.log("AAAAAA", params.row.user);
        return (
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
        );
      },
    },
    {
      field: "block",
      width: 180,
      headerName: "Block",
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
          // onClick={() =>
          //   changeStatusToBlocked(`${params.row.convoId}-${params.row.index}`)
          // }
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

  useEffect(() => {
    getReportedMessages();
  }, []);

  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
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
        <Tab label="Flagged" value={0} />
        <Tab label="Blocked" />
      </Tabs>
      {value === 0 ? (
        <Box sx={{ height: 700, width: "100%" }}>
          <DataGrid
            rows={reportedMessages}
            columns={columnsFlagged}
            pageSizeOptions={[10]}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 10,
                },
              },
            }}
            checkboxSelection
            disableRowSelectionOnClick
            onRowSelectionModelChange={(ids) => {
              const selectedIDs = new Set(ids);
              const data = reportedMessages.filter((row) =>
                selectedIDs.has(row.id)
              );
              setSelectedRowData(data);
            }}
          />
        </Box>
      ) : (
        <div> Blocked users </div>
      )}
    </>
  );
};

FlaggedMessages.propTypes = {};

export default FlaggedMessages;
