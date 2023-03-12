import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { collection, doc, setDoc } from "firebase/firestore";
import PropTypes from "prop-types";
import { auth, db } from "../../Firebase/firebase";

const FlaggedMessages = (props) => {
  const antinos = "🖖";
  const tempData = [
    {
      email: "hypeboy@tok.ki",
      message: "im definitely a munch",
    },
  ];

  const messagesRef = collection(db, "messages");

  
  const reportedQuery = 

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Flagged Message</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tempData.map((data) => (
            <TableRow>
              <TableCell>{data.email}</TableCell>
              <TableCell>{data.message}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

FlaggedMessages.propTypes = {};

export default FlaggedMessages;
