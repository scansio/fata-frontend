/* eslint-disable react/prop-types */
/* eslint-disable require-jsdoc */
import React, { useEffect, useRef, useState } from 'react'
import { Col, Form, InputGroup, Row } from 'react-bootstrap'
import fetcher from '../../../scripts/SharedFetcher'
import { toast } from 'react-toastify'
import SharedConfig from '../../../scripts/SharedConfig'
import { UID } from '../../../scripts/config/contants'
import {
  ALL_USER_AUTO_TRADE_SETTING,
  USER_AUTO_TRADE_SETTING
} from '../../../scripts/config/RestEndpoints'
import Spinner from '../../general/Spinner'
import { encodeQuery } from '../../../scripts/misc'

function SettingTab (props) {
  const [submitting, setSubmitting] = useState(false)

  const dataIdRef = useRef(null)

  const [minSignalPercentage, setMinSignalPercentage] = useState('')
  const [balancePercentagePerSignal, setBalancePercentagePerSignal] =
    useState('')
  const [status, setStatus] = useState('')

  useEffect(() => {
    const q = encodeQuery({
      uid: SharedConfig.getLocalData(UID)
    })
    fetcher
      .fetch(ALL_USER_AUTO_TRADE_SETTING + `?q=${q}`)
      .then((data) => {
        if (data?.data?.status && data.data.userAutoTradeSettings.results[0]) {
          data = data.data.userAutoTradeSettings.results[0]
          dataIdRef.current = data._id
          setMinSignalPercentage(data.minSignalPercentage)
          setBalancePercentagePerSignal(data.balancePercentagePerSignal)
          setStatus(data.status)
        } else {
          props.setNoSettings && props.setNoSettings(true)
        }
      })
      .catch((error) => toast.error(error.message))
  }, [])

  async function updateSetting (e) {
    setSubmitting(true)
    e.preventDefault()
    const gdFetchSetting = {
      url: USER_AUTO_TRADE_SETTING,
      method: 'PATCH',
      data: {
        id: dataIdRef.current,
        minSignalPercentage,
        balancePercentagePerSignal,
        status
      }
    }
    let data
    try {
      data = await fetcher.fetch(gdFetchSetting)
    } catch (er) {
      toast.error(er.message)
    }
    if (data) {
      if (!data.data.status) {
        toast.error(data.data.message)
      } else {
        toast.success(data.data.message)
      }
    }
    setSubmitting(false)
  }

  return (
    <Form onSubmit={(e) => updateSetting(e)}>
      <Row>
        <Col xs="12" sm="12" md="6" lg="4" className="p-1">
          <InputGroup>
            <InputGroup.Text className="fw-bold">Min. Signal %</InputGroup.Text>
            <Form.Control
              required={true}
              type="number"
              title="Minimum signal percentage"
              value={minSignalPercentage}
              onChange={(e) => setMinSignalPercentage(e.target.value)}
            ></Form.Control>
          </InputGroup>
        </Col>

        <Col xs="12" sm="12" md="6" lg="4" className="p-1">
          <InputGroup>
            <InputGroup.Text className="fw-bold">Percentage</InputGroup.Text>
            <Form.Control
              required={true}
              type="number"
              title="The percentage of your spot wallet per trade"
              value={balancePercentagePerSignal}
              onChange={(e) => setBalancePercentagePerSignal(e.target.value)}
            ></Form.Control>
          </InputGroup>
        </Col>

        <Col xs="12" sm="12" md="6" lg="4" className="p-1">
          <InputGroup>
            <InputGroup.Text className="fw-bold">
              Status &nbsp;
              <Form.Switch
                checked={!!status}
                onChange={(e) => setStatus(status === 1 ? 0 : 1)}
              ></Form.Switch>
            </InputGroup.Text>
          </InputGroup>
        </Col>

        <Col xs="12" sm="12" md="6" lg="4" className="p-1">
          <Spinner loading={submitting} loadingText={'Updating setting'}>
            <Form.Control
              size="md"
              type="submit"
              value={'Update'}
              className="fw-bold utilityLink"
            ></Form.Control>
          </Spinner>
        </Col>
      </Row>
    </Form>
  )
}
export default SettingTab
