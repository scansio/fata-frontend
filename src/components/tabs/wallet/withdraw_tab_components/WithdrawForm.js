/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable require-jsdoc */
import React, { useState, useRef, useEffect } from 'react'
import { Col, Form, FormSelect, InputGroup, Row } from 'react-bootstrap'
import fetcher from '../../../../scripts/SharedFetcher'
import { useTokenAndNetwork } from '../../../../scripts/hooks/hookCollection'
import { toast } from 'react-toastify'
import {
  REQUEST_WITHDRAW,
  PROFIT_WITHDRAWABLE_AMOUNT,
  PROFIT_WITHDRAW,
  SALES_WITHDRAW
} from '../../../../scripts/config/RestEndpoints'
import SharedConfig from '../../../../scripts/SharedConfig'
import { UID } from '../../../../scripts/config/contants'
import ModalBox from '../../../general/Modal'
import PinInput from '../../../general/PinInput'
import { FaDollarSign } from 'react-icons/fa'

const PROFIT_WALLET = 'PROFIT'
const SALES_WALLET = 'SALES'
const SPOT_WALLET = 'SPOT'

function WithdrawForm (props) {
  const [submitting, setSubmitting] = useState(false)
  const [wallet, setWallet] = useState(SPOT_WALLET)
  const [amount, setAmount] = useState('')
  const [withdrawable, setWithdrawable] = useState('')
  const formRef = useRef(null)
  const [enteringPin, setEnteringPin] = useState(false)
  const [tokenOptions, networkOptions, onNetworkSelection] = useTokenAndNetwork(
    true,
    'withdraw'
  )

  useEffect(() => {
    if (wallet === PROFIT_WALLET) {
      fetcher
        .fetch(PROFIT_WITHDRAWABLE_AMOUNT)
        .then((data) => {
          setWithdrawable(data?.data?.amount)
        })
        .catch()
    } else if (wallet === SALES_WALLET) {
      setWithdrawable(props.salesWallet)
    } else {
      setWithdrawable(props.fundingWallet)
    }
  }, [wallet])

  async function requestWithdraw (pin) {
    setSubmitting(true)
    setEnteringPin(false)
    if (!pin) {
      toast.error(
        'Pin not captured please enter your transaction pin to continue'
      )
      setEnteringPin(true)
      return
    }
    const formData = new FormData(formRef.current)
    const gdFetchOption = {
      url:
        wallet === PROFIT_WALLET
          ? PROFIT_WITHDRAW
          : wallet === SALES_WALLET
            ? SALES_WITHDRAW
            : REQUEST_WITHDRAW,
      data: {
        uid: SharedConfig.getLocalData(UID),
        token: formData.get('token'),
        address: formData.get('address'),
        amount: formData.get('amount'),
        pin
      }
    }
    let data
    try {
      data = await fetcher.fetch(gdFetchOption)
      if (data) {
        if (!data.data.status) {
          toast.error(data.data.message)
        } else {
          toast.success(
            data.data.message ||
              'Withdrawal ordered successfully, please wait shortly'
          )
          setAmount('')
          props.refresh && props.refresh()
          /* props.setData(data.data); */
        }
      } else {
        toast.error('Error generating withdrawal details. ')
      }
    } catch (err) {
      toast.error(err.message)
    }
    setSubmitting(false)
  }

  return (
    <>
      <ModalBox
        show={enteringPin}
        onCancel={() => setEnteringPin(false)}
        control={false}
        header={<h1 className="text-center">Enter Your Transaction Pin</h1>}
        backdrop
      >
        <Row>
          <Col xs="12" sm="12" className="p-1">
            <PinInput setDone={requestWithdraw}></PinInput>
          </Col>
        </Row>
      </ModalBox>

      <Form
        ref={formRef}
        onSubmit={(e) => {
          e.preventDefault()
          setEnteringPin(true)
        }}
      >
        <Row>
          <Col xs="12" className="p-2 h4 fw-bold">
            Withdrawable:{' '}
            <span className="fw-bold fa fa-lg h2 text-primary">
              <FaDollarSign className="text-black"></FaDollarSign>
              {withdrawable}
            </span>
          </Col>

          <Col xs="12" sm="12" className="p-1">
            <InputGroup>
              <InputGroup.Text className="fw-bold">Wallet</InputGroup.Text>
              <Form.Select
                required={true}
                value={wallet}
                onChange={(e) => setWallet(e.target.value)}
              >
                <option value={SPOT_WALLET}> Spot Wallet</option>
                <option value={PROFIT_WALLET}> Profit Wallet</option>
                <option value={SALES_WALLET}> Sales Wallet</option>
              </Form.Select>
            </InputGroup>
          </Col>

          <Col xs="12" sm="12" md="6" lg="4" className="p-1">
            <InputGroup>
              <InputGroup.Text className="fw-bold">
                Network <span className="error"> &nbsp;&nbsp;*</span>
              </InputGroup.Text>
              <FormSelect
                required={true}
                id="token-network-select"
                name="network"
                className="form-select"
                title="Select network"
                onChange={(e) =>
                  onNetworkSelection(e.target.value)
                }
              >
                <option key="0" value='' >Select Network</option>
                {networkOptions}
              </FormSelect>
            </InputGroup>
          </Col>

          <Col xs="12" sm="12" md="6" lg="4" className="p-1">
            <InputGroup>
              <InputGroup.Text className="fw-bold">
                Token <span className="error"> &nbsp;&nbsp;*</span>
              </InputGroup.Text>
              <FormSelect
                required={true}
                id="token-select"
                className="form-select"
                name="token"
                title="Select Coin"
              >
                {tokenOptions}
              </FormSelect>
            </InputGroup>
          </Col>

          <Col xs="12" sm="12" className="p-1">
            <InputGroup>
              <InputGroup.Text className="fw-bold">
                Address <span className="error">&nbsp;&nbsp; *</span>
              </InputGroup.Text>
              <Form.Control
                required={true}
                id="address"
                name="address"
                size="md"
                type="text"
              ></Form.Control>
            </InputGroup>
          </Col>

          <Col xs="12" sm="12" className="p-1">
            <InputGroup>
              <InputGroup.Text className="fw-bold">
                Amount <span className="error">&nbsp;&nbsp; *</span>
              </InputGroup.Text>
              <Form.Control
                required={true}
                id="amount"
                name="amount"
                size="md"
                type="number"
                step=".1"
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

          <Col xs="12" sm="12" md="6" lg="4" className="p-1">
            <InputGroup>
              {submitting
                ? (
                <InputGroup.Text className="fw-bold">
                  <span className="">Requesting Withdraw... </span>{' '}
                  <div
                    className="spinner-border text-primary"
                    role="status"
                  ></div>
                </InputGroup.Text>
                  )
                : (
                <Form.Control
                  size="md"
                  type="submit"
                  value="Submit"
                  className="fw-bold utilityLink"
                ></Form.Control>
                  )}
            </InputGroup>
          </Col>
        </Row>
      </Form>
    </>
  )
}

export default WithdrawForm
