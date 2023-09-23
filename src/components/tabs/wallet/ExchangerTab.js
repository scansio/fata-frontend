/* eslint-disable require-jsdoc */
import React, { useEffect, useRef, useState } from 'react'
import {
  Card,
  InputGroup,
  Row,
  Col,
  Table,
  ButtonGroup,
  Button,
  Form
} from 'react-bootstrap'
import {
  CLEAR_EXCHANGER,
  LOAD_EXCHANGER,
  USER_EXCHANGERS,
  WITHDRAW_EXCHANGER
} from '../../../scripts/config/RestEndpoints'
import fetcher from '../../../scripts/SharedFetcher'
import { toast } from 'react-toastify'
import SharedConfig from '../../../scripts/SharedConfig'
import { UID } from '../../../scripts/config/contants'
import ModalBox from '../../general/Modal'
import Spinner from '../../general/Spinner'
import ExchangerHistory from './exchangers_tab_components/ExchangerHistory'
import { useHistoryButton } from '../../../scripts/hooks/hookCollection'

function ExchangerTab (props) {
  const [history, , historyButton] = useHistoryButton()
  const [loadingExchangers, setLoadingExchangers] = useState(true)
  const [loading, setLoading] = useState(false)
  const [withdrawing, setWithdrawing] = useState(false)
  const [clearing, setClearing] = useState(false)
  const [exchangers, setExchangers] = useState([])
  const [loadId, setLoadId] = useState('')
  const [amount, setAmount] = useState('')
  const [showLoad, setShowLoad] = useState(false)
  const uidRef = useRef(SharedConfig.getLocalData(UID))
  const query = { uid: uidRef.current }

  useEffect(() => {
    async function getMyExchangers () {
      setLoadingExchangers(true)
      let data
      try {
        data = await fetcher.fetch(USER_EXCHANGERS + `${uidRef.current}`)
      } catch (er) {
        toast.error(er.message)
      }
      if (data) {
        if (!data.data.status) {
          toast.error(data.data.message)
        } else {
          setExchangers(data.data.exchangers)
        }
      }
      setLoadingExchangers(false)
    }
    getMyExchangers()
  }, [])

  async function load (e) {
    setLoading(true)
    e.preventDefault()
    const fData = {
      url: LOAD_EXCHANGER,
      data: {
        uid: uidRef.current,
        exchangerId: loadId,
        amount
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
        setShowLoad(false)
        toast.success(data.data.message)
        props.refresh()
      }
    }
    setLoading(false)
  }

  async function withdraw (e) {
    setLoading(true)
    e.preventDefault()
    const fData = {
      url: WITHDRAW_EXCHANGER,
      data: {
        uid: uidRef.current,
        exchangerId: loadId,
        amount
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
        setShowLoad(false)
        setWithdrawing(false)
        toast.success(data.data.message)
        props.refresh()
      }
    }
    setLoading(false)
  }

  async function clear (exchangerId) {
    setClearing(true)
    let data
    try {
      data = await fetcher.fetch(
        CLEAR_EXCHANGER + `${uidRef.current}/${exchangerId}`
      )
    } catch (er) {
      toast.error(er.message)
    }
    if (data) {
      if (!data.data.status) {
        toast.error(data.data.message)
      } else {
        toast.success(data.data.message)
        props.refresh()
      }
    }
    setClearing(false)
  }

  return (
    <Col md="12" className="mt-3">
      <Card>
        <Card.Header>
          <h4>Exchanger {historyButton}</h4>
        </Card.Header>
        <Card.Body>
          {history
            ? (
            <ExchangerHistory />
              )
            : (
            <>
              <ModalBox
                show={showLoad}
                onCancel={() => {
                  setShowLoad(false)
                  setWithdrawing(false)
                }}
                control={false}
                noHeader
                backdrop
              >
                <Form onSubmit={(e) => (withdrawing ? withdraw(e) : load(e))}>
                  <Row>
                    <Col xs="12" sm="12" className="p-1">
                      <InputGroup>
                        <InputGroup.Text className="fw-bold">
                          Amount
                        </InputGroup.Text>
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
                        <InputGroup.Text>
                          <Button
                            className="utilityLink"
                            type="submit"
                            disabled={loading}
                          >
                            {withdrawing ? 'Withdraw' : 'Load'}
                          </Button>
                        </InputGroup.Text>
                      </InputGroup>
                    </Col>
                  </Row>
                </Form>
              </ModalBox>

              <Table responsive striped>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Balance</th>
                    <th>Transfer</th>
                  </tr>
                </thead>
                <tbody>
                  {loadingExchangers
                    ? (
                    <tr>
                      <td colSpan={4} className="text-center">
                        <Spinner loading={loadingExchangers} />
                      </td>
                    </tr>
                      )
                    : (
                        exchangers.map((exchanger, i) => (
                      <tr key={exchanger.id}>
                        <td>{i + 1}</td>
                        <td>{exchanger.name}</td>
                        <td>{exchanger.balance}</td>
                        <td>
                          <ButtonGroup>
                            <Button
                              title="Deposit from main wallet"
                              onClick={(e) => {
                                setLoadId(exchanger.id)
                                setShowLoad(true)
                              }}
                            >
                              <i className="fas fa-download"></i>
                            </Button>
                            <Button
                              title="Withdraw to main wallet"
                              onClick={(e) => {
                                setLoadId(exchanger.id)
                                setShowLoad(true)
                                setWithdrawing(true)
                              }}
                              disabled={clearing}
                            >
                              <i className="fas fa-upload fa-sm fa-fw"></i>
                            </Button>
                            <Button
                              title="Withdraw all amount to main wallet"
                              onClick={(e) => clear(exchanger.id)}
                              disabled={clearing}
                            >
                              <i className="fas fa-times fa-sm fa-fw"></i>
                            </Button>
                          </ButtonGroup>
                        </td>
                      </tr>
                        ))
                      )}
                </tbody>
              </Table>
            </>
              )}
        </Card.Body>
      </Card>
    </Col>
  )
}

export default ExchangerTab
