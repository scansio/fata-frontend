import React, { useRef, useState } from 'react'
import {
  ALL_PROFIT_TRANSACTION,
  ALL_SALES_TRANSACTION
} from '../../../../scripts/config/RestEndpoints'
import PaginatedTable, { DESCENDING } from '../../../paginating/PaginatedTable'
import { Card, Nav, NavItem, Button } from 'react-bootstrap'

function FundingHistory () {
  const [tab, setTab] = useState('profit')
  const urlForProfitRef = useRef(ALL_PROFIT_TRANSACTION)
  const urlForSalesRef = useRef(ALL_SALES_TRANSACTION)

  const fields = {
    resolvedAmount: {
      name: 'Amount',
      type: Number,
      transform: {
        out: (row) => (
          <>
            <div className="fw-bold">${row?.resolvedAmount}</div>
          </>
        )
      }
    },
    address: { name: 'Wallet Address', type: String },
    type: { name: '', type: Number },
    description: { name: 'Description', type: String },
    status: { name: 'Status', type: String },
    'createdAt.date': { name: 'Date', type: Date }
  }

  return (
    <>
      <Nav variant="pills" className="s-grid my-2">
        <NavItem>
          <Button
            onClick={() => setTab('profit')}
            className={`nav-link ${tab === 'profit' ? 'active' : ''}`}
          >
            Profit
          </Button>
        </NavItem>

        <NavItem>
          <Button
            onClick={() => setTab('sales')}
            className={`nav-link ${tab === 'sales' ? 'active' : ''}`}
          >
            Sales
          </Button>
        </NavItem>
      </Nav>

      <Card>
        {tab === 'profit'
          ? (
          <>
            <Card.Header className="h3 fw-bolder">
              Transfers from Profit{' '}
            </Card.Header>
            <div className="fw-bold"></div>
            <PaginatedTable
              url={urlForProfitRef.current}
              dataName="transactions"
              fields={fields}
              primaryKey="createdAt.date"
              sortOrder={DESCENDING}
            />
          </>
            )
          : (
          <>
            <Card.Header className="h3 fw-bolder">
              Transfers from Sales
            </Card.Header>
            <PaginatedTable
              url={urlForSalesRef.current}
              dataName="userReferralEarningTransactions"
              fields={fields}
              primaryKey="createdAt.date"
              sortOrder={DESCENDING}
            />
          </>
            )}
      </Card>
    </>
  )
}

export default FundingHistory
