/* eslint-disable react/prop-types */
/* eslint-disable require-jsdoc */
import React, { useRef, useState } from 'react'
import { Col, Form, InputGroup, Row } from 'react-bootstrap'
import { UPDATE_TRANSACTION_HASH } from '../../../../scripts/config/RestEndpoints'
import { toast } from 'react-toastify'
import fetcher from '../../../../scripts/SharedFetcher'
import ClickCopy from '../../../general/ClickCopy'
import QRCode from 'qrcode.react'
import Spinner from '../../../paginating/Spinner'

function DepositGenerateFragment (props) {
  const [hash, setHash] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const addressInputRef = useRef()

  async function submitTransactionHash (e) {
    setSubmitting(true)
    e.preventDefault()
    const gdFetchOption = {
      method: 'PATCH',
      url: UPDATE_TRANSACTION_HASH,
      data: {
        id: props.transactionId,
        hash
      }
    }
    let data
    try {
      data = await fetcher.fetch(gdFetchOption)
    } catch (er) {
      toast.error(er.message)
    }
    if (data) {
      if (!data.data.status) {
        toast.error(data.data.message)
      } else {
        toast.success(
          'Submitted you will be credited after validation shortly'
        )
        props.refresh && props.refresh()
      }
    }
    setSubmitting(false)
  }

  return (
    <Form onSubmit={submitTransactionHash}>
      <Row>
        <Col
          xs="12"
          sm="12"
          md={{ span: '6', offset: '3' }}
          lg={{ span: '4', offset: '4' }}
          className="p-1"
        >
          <div className="thumbnail s-grid" style={{ height: 200 }}>
            <QRCode
              style={{ width: 200, height: 200, border: '0.5px solid black' }}
              value={props.walletAddress}
            />
          </div>
        </Col>
        <Col xs="12" className="p-1">
          <InputGroup>
            <Form.Control
              ref={addressInputRef}
              id="deposit-wallet-address"
              size="md"
              type="text"
              readOnly={true}
              value={props.walletAddress}
            ></Form.Control>
            <InputGroup.Text className="fw-bold c-pointer cpointer pointer utilityLink">
              <ClickCopy text={props.walletAddress} />
            </InputGroup.Text>
          </InputGroup>
        </Col>
        <Col xs="12" className="p-1">
          <InputGroup>
            <Form.Control
              id="hash"
              size="md"
              type="text"
              required={true}
              placeholder="Enter your transaction hash code"
              value={hash}
              onChange={(e) => setHash(e.target.value)}
            ></Form.Control>
            {submitting
              ? (
              <InputGroup.Text className="fw-bold">
                <span className=""></span>{' '}
                <div
                  className="spinner-border text-primary"
                  role="status"
                ></div>
              </InputGroup.Text>
                )
              : (
              <InputGroup.Text className="fw-bold c-pointer cpointer pointer utilityLink">
                <Spinner loading={submitting}>
                  <button type="submit" className="btn btn-default">
                    I have paid
                  </button>
                </Spinner>
              </InputGroup.Text>
                )}
          </InputGroup>
        </Col>
        <Col xs="12">
          <div className="mt-4">
            <h5>Description</h5>
            <p>
              After making the payment, kindly copy the transaction hash code
              into the hash input above and click <b>&apos;I have paid&apos;</b>
            </p>
          </div>
        </Col>
      </Row>
    </Form>
  )
}
export default DepositGenerateFragment
