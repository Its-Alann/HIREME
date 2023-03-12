import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { collection, doc, setDoc, getDocs } from "firebase/firestore";
import PropTypes from "prop-types";
import { auth, db } from "../../Firebase/firebase";

const FlaggedMessages = (props) => {
  // array of reported message objects
  const [reportedMessages, setReportedMessages] = useState([]);

  const getReportedMessages = async () => {
    const reportedMessagesRef = collection(db, "reportedMessages");

    const reportedQuerySnapshot = await getDocs(reportedMessagesRef);
    const temp = [];
    reportedQuerySnapshot.forEach((document) => {
      // const resData =
      temp.push(document.data());
      // console.log(document.data());
      // console.log("useState", reportedMessages);
    });

    setReportedMessages(temp);
  };

  useEffect(() => {
    getReportedMessages();
  }, []);

  return (
    <>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Flagged Message 🚩</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reportedMessages.map((data) => (
              <TableRow>
                <TableCell>{data.sender}</TableCell>
                <TableCell>
                  {data.content
                    ? data.content
                    : data.attachment && data.attachment}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {/* <button onClick={getReportedMessages} /> */}
    </>
  );
};

FlaggedMessages.propTypes = {};

export default FlaggedMessages;
