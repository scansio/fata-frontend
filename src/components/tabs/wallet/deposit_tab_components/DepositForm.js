/* eslint-disable require-jsdoc */
import React, { useState } from 'react'
import { Col, Form, FormSelect, InputGroup, Row } from 'react-bootstrap'
import fetcher from '../../../../scripts/SharedFetcher'
import { toast } from 'react-toastify'
import SharedConfig from '../../../../scripts/SharedConfig'
import { UID } from '../../../../scripts/config/contants'
import { GENERATE_DEPOSIT } from '../../../../scripts/config/RestEndpoints'
import { useTokenAndNetwork } from '../../../../scripts/hooks/hookCollection'

function DepositForm (props) {
  const [submitting, setSubmitting] = useState(false)
  const [amount, setAmount] = useState('')
  const [tokenOptions, networkOptions, onNetworkSelection] = useTokenAndNetwork()

  async function generateDeposit (e) {
    setSubmitting(true)
    e.preventDefault()
    if (amount <= 0) {
      toast.error('Amount not accepted')
    } else {
      const formData = new FormData(e.target)
      const gdFetchOption = {
        url: GENERATE_DEPOSIT,
        data: {
          uid: SharedConfig.getLocalData(UID),
          token: formData.get('token'),
          amount: formData.get('amount')
        }
      }
      let data
      try {
        data = await fetcher.fetch(gdFetchOption)
      } catch (er) {}
      if (data) {
        if (!data.data.status) {
          toast.error(data.data.message)
        } else {
          // eslint-disable-next-line react/prop-types
          props?.setData(data.data.generated)
          const timeoutId = setTimeout(() => {
            setSubmitting(false)
            clearTimeout(timeoutId)
          }, 3000)
          return
        }
      } else {
        toast.error('Error generating deposit details. ')
      }
    }
    setSubmitting(false)
  }

  return (
    <Form onSubmit={(e) => generateDeposit(e)}>
      <Row>
        <Col xs="12" sm="12" md="6" lg="4" className="p-1">
          <InputGroup>
            <InputGroup.Text className="fw-bold">Network</InputGroup.Text>
            <FormSelect
              required={true}
              id="token-network-select"
              className="form-select"
              name="network"
              onChange={(e) => onNetworkSelection(e.target.value)}
            >
              <option key="0" value="">
                Select Network
              </option>
              {networkOptions}
            </FormSelect>
          </InputGroup>
        </Col>
        <Col xs="12" sm="12" md="6" lg="4" className="p-1">
          <InputGroup>
            <InputGroup.Text className="fw-bold">Token</InputGroup.Text>
            <FormSelect
              required={true}
              id="token-select"
              className="form-select"
              name="token"
            >
              {tokenOptions}
            </FormSelect>
          </InputGroup>
        </Col>
        <Col xs="12" sm="12" md="6" lg="4" className="p-1">
          <InputGroup>
            <InputGroup.Text className="fw-bold">Amount</InputGroup.Text>
            <Form.Control
              required={true}
              isValid={amount > 0 && amount < 10000}
              id="amount"
              name="amount"
              size="md"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            ></Form.Control>
          </InputGroup>
        </Col>
        <Col xs="12" sm="12" md="6" lg="4" className="p-1">
          <InputGroup>
            {submitting
              ? (
              <InputGroup.Text className="fw-bold">
                <span className="">Generating... </span>{' '}
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
                value="Generate"
                className="fw-bold utilityLink"
              ></Form.Control>
                )}
          </InputGroup>
        </Col>
      </Row>
    </Form>
  )
}
export default DepositForm
