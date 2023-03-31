import React, { useEffect, useState } from "react";
import { Box, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { collection, doc, setDoc, getDocs } from "firebase/firestore";
import PropTypes from "prop-types";
import { auth, db } from "../../Firebase/firebase";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

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
      <Button variant="contained" size="small">
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
    renderCell: (params) => (
      <Button
        variant="contained"
        sx={{ backgroundColor: "#DF9000" }}
        size="small"
      >
        X
      </Button>
    ),
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
      >
        X
      </Button>
    ),
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
            columns={columns}
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
