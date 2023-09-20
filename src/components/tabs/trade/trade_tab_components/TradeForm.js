/* eslint-disable react/prop-types */
/* eslint-disable require-jsdoc */
import React, { useState, useEffect, useRef } from 'react'
import { Badge, Button, Col, Form, InputGroup, Row } from 'react-bootstrap'
import SharedConfig from '../../../../scripts/SharedConfig'
import { UID } from '../../../../scripts/config/contants'
import { WALLET_BALANCE } from '../../../../scripts/config/RestEndpoints'
import fetcher from '../../../../scripts/SharedFetcher'
import { Link } from 'react-router-dom'
function TradeForm (props) {
  const dataIdRef = useRef('')

  const [amount, setAmount] = useState('')

  const [balance, setBalance] = useState('')

  useEffect(() => {
    const uid = SharedConfig.getLocalData(UID)
    fetcher
      .fetch(WALLET_BALANCE + uid)
      .then((data) => setBalance(data?.data?.balance || 0))
  }, [])

  useEffect(() => {
    props?.setPercentage(
      amount ? amount * (props.data?.percentage / 100.0) + amount * 1 : amount
    )
  }, [amount])

  useEffect(() => {
    const data = props.data
    if (data) {
      dataIdRef.current = data._id
    }
  }, [props.data])

  return (
    <Form onSubmit={(e) => props.createTrade(e, amount)}>
      <Row>
        <Col xs="12" className="p-1">
          <InputGroup size='sm'>
            <InputGroup.Text className="fw-bold">$ </InputGroup.Text>
            <Form.Control
              required={true}
              type="number"
              value={amount}
              isValid={amount <= balance}
              step=".00000000001"
              max={balance}
              onChange={(e) => setAmount(e.target.value)}
            ></Form.Control>
            <InputGroup.Text>
              <Button variant="danger" size='sm' onClick={() => setAmount(balance)}>Max</Button>
            </InputGroup.Text>
            <InputGroup.Text className="fw-bold">
              <Form.Control
                type="submit"
                value={'Trade'}
                variant="danger"
                className="fw-bold utilityLink"
              />
            </InputGroup.Text>
          </InputGroup>
          <div className="text-center m-2">
            <small className="fa-sm">
              Spot<samp>:</samp> <span className="text-primary text-bold">${balance}</span>{' '}
            </small>
            {amount >= balance
              ? (
              <>
                <br />
                <Link to={'../wallet?tab=deposit'}>
                  <Badge>Fund Wallet</Badge>
                </Link>
              </>
                )
              : null}
          </div>
        </Col>
      </Row>
    </Form>
  )
}
export default TradeForm
