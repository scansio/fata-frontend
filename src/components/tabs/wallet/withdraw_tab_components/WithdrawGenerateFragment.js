import React, { useEffect, useState } from "react";
import { Card, Col, Form, InputGroup, Row } from "react-bootstrap";
function WithdrawGenerateFragment(props) {
  let [copyText, setCopyText] = useState("Copy");

  useEffect(() => {
    if (copyText !== "Copy") {
      let timeOutId = setTimeout(() => {
        setCopyText("Copy");
        clearTimeout(timeOutId);
      }, 3000);
    }
  }, [copyText]);

  function clipCopy() {
    navigator.clipboard
      .writeText(props.walletAddress)
      .then((result) => {
        setCopyText("Copied");
      })
      .catch((err) => {
        setCopyText("Try Again");
      });
  }

  return (
    <Row>
      <Col
        xs="12"
        sm="12"
        md={{ span: "6", offset: "3" }}
        lg={{ span: "4", offset: "4" }}
        className="p-1"
      >
        <div className="thumbnail s-grid" style={{ height: 200 }}>
          <img
            className=""
            style={{ width: 200, height: 200, border: "0.5px solid black" }}
            variant="top"
            src={props.walletAddressQRCode}
            alt="wallet-address-qrcode"
          />
        </div>
      </Col>
      <Col xs="12" className="p-1">
        <InputGroup>
          <Form.Control
            id="deposit-wallet-address"
            size="md"
            type="text"
            readOnly={true}
            value={props.walletAddress}
          ></Form.Control>
          <InputGroup.Text
            className="fw-bold c-pointer cpointer pointer utilityLink"
            onClick={() => {
              clipCopy();
            }}
          >
            {copyText}
          </InputGroup.Text>
        </InputGroup>
      </Col>
      <Col xs="12">
        <div className="mt-4">
          <h5>Description</h5>
          <p>{props.description}</p>
        </div>
      </Col>
    </Row>
  );
}
export default WithdrawGenerateFragment;
