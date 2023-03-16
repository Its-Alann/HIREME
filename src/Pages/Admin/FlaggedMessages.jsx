import React, { useEffect, useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { collection, doc, setDoc, getDocs } from "firebase/firestore";
import PropTypes from "prop-types";
import { auth, db } from "../../Firebase/firebase";

const descendingComparator = (a, b, orderBy) => {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
};

const headCells = [
  {
    id: "user",
    numeric: false,
    disablePadding: true,
    label: "User",
  },
  {
    id: "message",
    numeric: false,
    disablePadding: true,
    label: "Flagged Message 🚩",
  },
  {
    id: "type",
    numeric: false,
    disablePadding: true,
    label: "Type",
  },
  {
    id: "date",
    numeric: false,
    disablePadding: true,
    label: "Date",
  },
];

const columns = [
  { field: "id", headerName: "ID", width: 90 },
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

let rows = [];

const FlaggedMessages = (props) => {
  // array of reported message objects
  const [reportedMessages, setReportedMessages] = useState([]);
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("date");

  // let rows = [];

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
      const thingy2 = {
        user: resData.sender,
        message: resData.content || resData.attachment || null,
        date: resData.timestamp.toDate(),
        type: resData.content ? "content" : "attachment",
        id: ii,
      };
      // console.log(thingy.date instanceof Date);
      temp.push(thingy2);
      ii += 1;
    });

    setReportedMessages(temp);

    rows = temp;
    setReportedMessages(rows);
    console.log("rows", rows);
  };

  useEffect(() => {
    getReportedMessages();
  }, []);

  return (
    <Box sx={{ height: 400, width: "100%" }}>
      {/* <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Flagged Message 🚩</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reportedMessages.map((data) => (
              <TableRow>
                <TableCell>{data.user}</TableCell>
                <TableCell>{data.message}</TableCell>
                <TableCell>{data.type}</TableCell>
                <TableCell>{data.date.toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer> */}

      {/* <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {headCells.map((headCell) => (
                <TableCell
                  key={headCell.id}
                  align="left"
                  // padding={headCell.disablePadding ? "none" : "normal"}
                  // sortDirection={orderBy === headCell.id ? order : false}
                >
                  <TableSortLabel
                  // active={orderBy === headCell.id}
                  // direction={orderBy === headCell.id ? order : "asc"}
                  // onClick={createSortHandler(headCell.id)}
                  >
                    {headCell.label}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>{}</TableBody>
        </Table>
      </TableContainer> */}

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
      />
    </Box>
  );
};

FlaggedMessages.propTypes = {};

export default FlaggedMessages;
