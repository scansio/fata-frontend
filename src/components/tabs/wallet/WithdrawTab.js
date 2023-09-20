/* eslint-disable react/prop-types */
import React from 'react'
import { Card, Col } from 'react-bootstrap'
import { useHistoryButton } from '../../../scripts/hooks/hookCollection'
import WithdrawForm from './withdraw_tab_components/WithdrawForm'
import WithdrawHistory from './withdraw_tab_components/WithdrawHistory'

function WithdrawTab (props) {
  const [history,, historyButton] = useHistoryButton()

  return (
    <Col md="12" className="mt-3">
      <Card>
        <Card.Header>
          <h4>Withdraw {historyButton}</h4>
        </Card.Header>
        <Card.Body>
          {history
            ? (
            <WithdrawHistory />
              )
            : (
            <WithdrawForm {...props} />
              )}
        </Card.Body>
      </Card>
    </Col>
  )
}

export default WithdrawTab
