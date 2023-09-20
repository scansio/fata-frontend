import React, { useRef } from 'react'
import { Card, Col } from 'react-bootstrap'
import PaginatedTable, { DESCENDING } from '../../paginating/PaginatedTable'
import { ALL_PACKAGE_TRANSACTION } from '../../../scripts/config/RestEndpoints'
import accounting from 'accounting'

function UpgradeHistoryTab (props) {
  const urlRef = useRef(ALL_PACKAGE_TRANSACTION)

  const fieldsRef = useRef({
    packageId: {
      name: 'Package',
      type: String,
      transform: {
        out: (rowData) => (
          <>
            <span>{rowData?.packageId?.name}</span>
          </>
        )
      }
    },
    amount: {
      name: 'Amount',
      type: Number,
      transform: {
        out: (row) => (
          <>
            <div className="fw-bold">
              {accounting.formatMoney(row?.amount, '$', 8)}
            </div>
          </>
        )
      }
    },
    status: { name: 'Status', type: String },
    'createdAt.date': { name: 'Date', type: Date }
  })

  const queryRef = useRef({
    populate: ['packageId']
  })

  return (
    <Col md="12" className="mt-3">
      <Card>
        {/*
        <Card.Header>
          <h4>Withdraw {historyButton}</h4>
        </Card.Header> */}
        <Card.Body>
          <PaginatedTable
            url={urlRef.current}
            dataName="packageTransactions"
            fields={fieldsRef.current}
            query={queryRef.current}
            primaryKey="createdAt.date"
            sortOrder={DESCENDING}
            noControl
          />
        </Card.Body>
      </Card>
    </Col>
  )
}

export default UpgradeHistoryTab
