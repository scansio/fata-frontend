import React, { useState } from 'react'
import { Card, Col } from 'react-bootstrap'
import { useHistoryButton } from '../../../scripts/hooks/hookCollection'
import DepositHistory from './deposit_tab_components/DepositHistory'
import DepositGenerateFragment from './deposit_tab_components/DepositGenerateFragment'
import DepositForm from './deposit_tab_components/DepositForm'

function DepositTab (props) {
  const [data, setData] = useState(null)
  const [history, , historyButton] = useHistoryButton()

  return (
    <Col md="12" className="mt-3">
      <Card>
        <Card.Header>
          <h4>Deposit {historyButton}</h4>
        </Card.Header>
        <Card.Body>
          {history
            ? (
            <DepositHistory />
              )
            : data !== null
              ? (
            <>
              <DepositGenerateFragment
                {...props}
                walletAddress={data.address}
                description={data.description}
                transactionId={data._id}
                setData={(element) => setData(element)}
              />
            </>
                )
              : (
            <DepositForm {...props} setData={(element) => setData(element)} />
                )}
        </Card.Body>
      </Card>
    </Col>
  )
}

export default DepositTab
