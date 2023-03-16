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

// const columns = [
//   { field: "id", headerName: "ID", width: 90 },
//   {
//     field: "firstName",
//     headerName: "First name",
//     width: 150,
//     editable: true,
//   },
//   {
//     field: "lastName",
//     headerName: "Last name",
//     width: 150,
//     editable: true,
//   },
//   {
//     field: "age",
//     headerName: "Age",
//     type: "number",
//     width: 110,
//     editable: true,
//   },
//   {
//     field: "fullName",
//     headerName: "Full name",
//     description: "This column has a value getter and is not sortable.",
//     sortable: false,
//     width: 160,
//     valueGetter: (params) =>
//       `${params.row.firstName || ""} ${params.row.lastName || ""}`,
//   },
// ];

// const rows = [
//   { id: 1, lastName: "Snow", firstName: "Jon", age: 35 },
//   { id: 2, lastName: "Lannister", firstName: "Cersei", age: 42 },
//   { id: 3, lastName: "Lannister", firstName: "Jaime", age: 45 },
//   { id: 4, lastName: "Stark", firstName: "Arya", age: 16 },
//   { id: 5, lastName: "Targaryen", firstName: "Daenerys", age: null },
//   { id: 6, lastName: "Melisandre", firstName: null, age: 150 },
//   { id: 7, lastName: "Clifford", firstName: "Ferrara", age: 44 },
//   { id: 8, lastName: "Frances", firstName: "Rossini", age: 36 },
//   { id: 9, lastName: "Roxie", firstName: "Harvey", age: 65 },
// ];

const FlaggedMessages = (props) => {
  // array of reported message objects
  const [reportedMessages, setReportedMessages] = useState([]);
  const [selectedRowData, setSelectedRowData] = useState([]);

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
