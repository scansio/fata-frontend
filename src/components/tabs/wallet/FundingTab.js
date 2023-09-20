/* eslint-disable react/prop-types */
/* eslint-disable require-jsdoc */
import React, { useEffect, useState } from 'react'
import { Button, Card, Col, Form, InputGroup, Row } from 'react-bootstrap'
import { toast } from 'react-toastify'
import { UID } from '../../../scripts/config/contants'
import {
  PROFIT_TRANSFER,
  PROFIT_WITHDRAWABLE_AMOUNT,
  SALES_TRANSFER
} from '../../../scripts/config/RestEndpoints'
import SharedConfig from '../../../scripts/SharedConfig'
import fetcher from '../../../scripts/SharedFetcher'
import FundingHistory from './funding_tab_components/FundingHistory'
import { useHistoryButton } from '../../../scripts/hooks/hookCollection'
import ModalBox from '../../general/Modal'
import PinInput from '../../general/PinInput'
import { FaDollarSign } from 'react-icons/fa'

const PROFIT_WALLET = 'PROFIT'
const SALES_WALLET = 'SALES'

function FundingTab (props) {
  const [amount, setAmount] = useState('')
  const [wallet, setWallet] = useState(PROFIT_WALLET)
  const [enteringPin, setEnteringPin] = useState(false)
  const [makingTransfer, setMakingTransfer] = useState(false)
  // eslint-disable-next-line no-unused-vars
  const [history, _setHistory, historyButton] = useHistoryButton()
  const [withdrawable, setWithdrawable] = useState('')

  useEffect(() => {
    if (wallet === PROFIT_WALLET) {
      fetcher
        .fetch(PROFIT_WITHDRAWABLE_AMOUNT)
        .then((data) => {
          setWithdrawable(data?.data?.amount)
        })
        .catch()
    } else {
      setWithdrawable(props.salesWallet)
    }
  }, [wallet])

  async function makeTransfer (pin) {
    setMakingTransfer(true)
    setEnteringPin(false)
    if (!pin) {
      toast.error(
        'Pin not captured please enter your transaction pin to continue'
      )
      setEnteringPin(true)
      return
    }

    const uid = SharedConfig.getLocalData(UID)
    const fData = {
      url: wallet === SALES_WALLET ? SALES_TRANSFER : PROFIT_TRANSFER,
      data: {
        uid,
        amount,
        pin
      }
    }
    let data
    try {
      data = await fetcher.fetch(fData)
    } catch (er) {
      toast.error(er.message)
    }
    if (data) {
      if (!data.data.status) {
        toast.error(data.data.message)
      } else {
        setMakingTransfer(false)
        toast.success(data.data.message)
        props.refresh && props.refresh()
      }
    }
    setMakingTransfer(false)
  }

  return (
    <Col md="12" className="mt-3">
      <Card>
        <Card.Header>
          <h4>Transfer to Spot{historyButton}</h4>
        </Card.Header>
        <Card.Body>
          {history
            ? (
            <FundingHistory />
              )
            : (
            <>
              <ModalBox
                show={enteringPin}
                onCancel={() => setEnteringPin(false)}
                control={false}
                header={
                  <h1 className="text-center">Enter Your Transaction Pin</h1>
                }
                backdrop
              >
                <Row>
                  <Col xs="12" sm="12" className="p-1">
                    <PinInput setDone={makeTransfer}></PinInput>
                  </Col>
                </Row>
              </ModalBox>

              <Form
                onSubmit={(e) => {
                  e.preventDefault()
                  setEnteringPin(true)
                }}
              >
                <Row>
                  <Col xs="12" className="p-2 h4 fw-bold">
                    Transferable:{' '}
                    <span className="fw-bold fa fa-lg h2 text-primary">
                      <FaDollarSign className="text-black"></FaDollarSign>
                      {withdrawable}
                    </span>
                  </Col>
                  <Col xs="12" sm="12" className="p-1">
                    <InputGroup>
                      <InputGroup.Text className="fw-bold">
                        Wallet
                      </InputGroup.Text>
                      <Form.Select
                        required={true}
                        size="md"
                        value={wallet}
                        onChange={(e) => setWallet(e.target.value)}
                      >
                        <option value={PROFIT_WALLET}> Profit Wallet</option>
                        <option value={SALES_WALLET}> Sales Wallet</option>
                      </Form.Select>
                    </InputGroup>
                  </Col>

                  <Col xs="12" sm="12" className="p-1">
                    <InputGroup>
                      <InputGroup.Text className="fw-bold">
                        Amount
                      </InputGroup.Text>
                      <Form.Control
                        required={true}
                        size="md"
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                      ></Form.Control>
                      <InputGroup.Text
                        className="fw-bold c-pointer utilityLink"
                        onClick={(e) => setAmount(withdrawable)}
                      >
                        <span className="error">Max</span>
                      </InputGroup.Text>
                    </InputGroup>
                  </Col>
                  <Col xs="12" sm="12" className="p-1">
                    <Button
                      className="utilityLink pull-right"
                      type="submit"
                      disabled={makingTransfer}
                    >
                      Transfer
                    </Button>
                  </Col>
                </Row>
              </Form>
            </>
              )}
        </Card.Body>
      </Card>
    </Col>
  )
}

export default FundingTab
