import React, { useEffect, useState } from "react";
import { Box, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { collection, doc, setDoc, getDocs } from "firebase/firestore";
import PropTypes from "prop-types";
import { auth, db } from "../../Firebase/firebase";

const columns = [
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
];

const FlaggedMessages = () => {
  // array of reported message objects
  const [reportedMessages, setReportedMessages] = useState([]);
  const [selectedRowData, setSelectedRowData] = useState([]);

  // fetch the reported messages from the database
  const getReportedMessages = async () => {
    const reportedMessagesRef = collection(db, "reportedMessages");

    const reportedQuerySnapshot = await getDocs(reportedMessagesRef);
    const temp = [];
    let ii = 0;
    reportedQuerySnapshot.forEach((document) => {
      const resData = document.data();
      const thingy = {
        user: resData.sender,
        message: resData.content || resData.attachment || null,
        date: resData.timestamp.toDate(),
        type: resData.content ? "content" : "attachment",
        index: resData.index,
        id: ii,
      };
      temp.push(thingy);
      ii += 1;
    });

    setReportedMessages(temp);
  };

  useEffect(() => {
    getReportedMessages();
  }, []);

  return (
    <>
      {/* TODO: make mass report / warn users with the checklist
            selected rows are in the selectedRowData useState
      */}
      <Button variant="contained">Button</Button>
      <Box sx={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={reportedMessages}
          columns={columns}
          pageSizeOptions={[5]}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5,
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
    </>
  );
};

FlaggedMessages.propTypes = {};

export default FlaggedMessages;
