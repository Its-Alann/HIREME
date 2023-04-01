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
} from "firebase/firestore";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { getAuth, getUserByEmail } from "firebase/auth";

import { auth, db } from "../../Firebase/firebase";

const FlaggedMessages = () => {
  // array of reported message objects
  const [reportedMessages, setReportedMessages] = useState([]);
  const [blockedMessages, setBlockedMessages] = useState([]);

  const [selectedRowData, setSelectedRowData] = useState([]);

  const changeStatusToBlocked = async (docID) => {
    console.log("USER", getAuth().currentUser);

    console.log("in blocked", docID);

    const reportedMessageDocRef = doc(db, "reportedMessages", docID);
    // const dataaa = reportedMessageDocRef.data();
    // console.log("DOCCCC", dataaa);
    await updateDoc(reportedMessageDocRef, {
      status: "blocked",
    });
    console.log("done");

    // try {
    //   await updateDoc(reportedMessageDocRef, {
    //     status: "blocked",
    //   });
    // } catch (error) {
    //   console.log(error);
    // }

    // add code to actually block the user
  };

  const warnUser = async (docID) => {
    console.log("in warn", docID);
    // const reportedMessageDocRef = doc(db, "reportedMessages", "test");
  };

  const unflagUser = async (docID) => {
    console.log("in unflag", docID);
    try {
      await deleteDoc(doc(db, "reportedMessages", docID));
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };
  // const handleSend = async () => {
  //   const messageContent =
  //     "You have been WARNED by the Admin for your behaviour. Be better.";
  //   // Format a new message
  //   const timestamp = Timestamp.now();

  //   const sender = "admin@admin.com";
  //   const newMessage = {
  //     timestamp,
  //     sender,
  //   };

  //   if (file) {
  //     newMessage.attachment = file.name;
  //   } else {
  //     newMessage.content = messageContent;
  //   }

  //   console.log(newMessage, newMessage.timestamp.toDate());

  //   // SENDS TO THE DB
  //   // ex id: "17k4dPDcymw3GcNjSCSG"
  //   await updateDoc(doc(db, "messages", conversationID), {
  //     messages: arrayUnion(newMessage),
  //   });
  // };

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
        console.log("AAAAAA", params);
        return (
          <Button
            variant="contained"
            sx={{ backgroundColor: "#DF9000" }}
            size="small"
            onClick={() =>
              warnUser(`${params.row.convoId}-${params.row.index}`)
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
          onClick={() =>
            changeStatusToBlocked(`${params.row.convoId}-${params.row.index}`)
          }
        >
          X
        </Button>
      ),
    },
  ];

  const columnsBlocked = [
    // { field: "id", headerName: "ID", width: 90 },
    {
      field: "user",
      numeric: false,
      width: 240,
      headerName: "Blocked User",
    },
    // {
    //   field: "message",
    //   numeric: false,
    //   width: 360,
    //   headerName: "Flagged Message 🚩",
    // },
    // {
    //   field: "type",
    //   numeric: false,
    //   width: 90,
    //   headerName: "Type",
    // },
    {
      field: "date",
      numeric: false,
      width: 180,
      headerName: "Date",
    },
    {
      field: "unblock",
      width: 180,
      headerName: "Unblock",
      headerAlign: "center",
      sortable: false,
      filterable: false,
      hidecolumn: false,
      disableColumnMenu: true,
      align: "center",
      renderCell: (params) => (
        <Button variant="contained" size="small">
          X
        </Button>
      ),
    },
    {
      field: "delete",
      width: 180,
      headerName: "Delete",
      headerAlign: "center",
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      align: "center",
      renderCell: (params) => {
        console.log("AAAAAA", params);
        return (
          <Button
            variant="contained"
            sx={{ backgroundColor: "#C41E3A" }}
            size="small"
          >
            X
          </Button>
        );
      },
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
    setBlockedMessages(tempBlocked);
  };

  const blockUser = async (userEmail) => {
    console.log(userEmail);
    // console.log("AAAAAAAA user email", userEmail);
    // getAuth()
    //   .getUserByEmail(userEmail)
    //   .then((userRecord) => {
    //     // See the UserRecord reference doc for the contents of userRecord.
    //     console.log(`Successfully fetched user data: ${userRecord.toJSON()}`);
    //     console.log(`UID: `, userRecord.uid);
    //   })
    //   .catch((error) => {
    //     console.log("Error fetching user data:", error);
    //   });
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
        // <div> Blocked users </div>
        <Box sx={{ height: 700, width: "100%" }}>
          <DataGrid
            rows={blockedMessages}
            columns={columnsBlocked}
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
      )}
    </>
  );
};

FlaggedMessages.propTypes = {};

export default FlaggedMessages;
