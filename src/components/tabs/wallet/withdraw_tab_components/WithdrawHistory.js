import React, { useState } from 'react'
import {
  ALL_PROFIT_TRANSACTION,
  ALL_SALES_TRANSACTION,
  ALL_TRANSACTION
} from '../../../../scripts/config/RestEndpoints'
import PaginatedTable, { DESCENDING } from '../../../paginating/PaginatedTable'
import { Button, Card, Nav, NavItem } from 'react-bootstrap'

function WithdrawHistory () {
  const [tab, setTab] = useState('spot')
  const url = ALL_TRANSACTION
  const profitUrl = ALL_PROFIT_TRANSACTION
  const salesUrl = ALL_SALES_TRANSACTION

  const fields = {
    address: { name: 'Wallet Address', type: String },
    preBalance: { name: 'Balance Before', type: Number },
    actualAmount: {
      name: 'Transaction Token Amount',
      type: Number,
      transform: {
        out: (row) => (
          <>
            <div className="fw-bold">
              {row?.actualAmount}
              {row?.token?.symbol}
            </div>
          </>
        )
      }
    },
    resolvedAmount: {
      name: 'Default Token Amount',
      type: Number,
      transform: {
        out: (row) => (
          <>
            <div className="fw-bold">{row?.resolvedAmount}USDT</div>
          </>
        )
      }
    },
    type: { name: 'Type', type: String },
    hash: { name: 'Transaction Hash ID', type: String },
    description: { name: 'Description', type: String },
    status: { name: 'Status', type: String },
    'createdAt.date': { name: 'Date', type: Date }
  }

  const query = {
    type: 'withdraw',
    populate: ['token']
  }

  return (
    <>
      <Nav variant="pills" className="s-grid my-2">
        <NavItem>
          <Button
            onClick={() => setTab('spot')}
            className={`nav-link ${tab === 'spot' ? 'active' : ''}`}
          >
            Spot
          </Button>
        </NavItem>

        <NavItem>
          <Button
            onClick={() => setTab('profit')}
            className={`nav-link ${!tab || tab === 'profit' ? 'active' : ''}`}
          >
            Profit
          </Button>
        </NavItem>

        <NavItem>
          <Button
            onClick={() => setTab('sales')}
            className={`nav-link ${!tab || tab === 'sales' ? 'active' : ''}`}
          >
            Sales
          </Button>
        </NavItem>
      </Nav>

      <Card>
        {tab === 'spot'
          ? (
          <>
            <Card.Header className="h3 fw-bolder">
              Withdrawals from Spot Wallet
            </Card.Header>
            <PaginatedTable
              url={url}
              dataName="transactions"
              fields={fields}
              query={query}
              sortOrder={DESCENDING}
              primaryKey="createdAt.date"
            />
          </>
            )
          : tab === 'profit'
            ? (
          <>
            <Card.Header className="h3 fw-bolder">
              Withdrawals from Profit Wallet
            </Card.Header>
            <PaginatedTable
              url={profitUrl}
              dataName="transactions"
              fields={fields}
              query={query}
              sortOrder={DESCENDING}
              primaryKey="createdAt.date"
            />
          </>
              )
            : (
          <>
            <Card.Header className="h3 fw-bolder">
              Withdrawals Sales Wallet
            </Card.Header>
            <PaginatedTable
              url={salesUrl}
              dataName="userReferralEarningTransactions"
              fields={fields}
              query={query}
              sortOrder={DESCENDING}
              primaryKey="createdAt.date"
            />
          </>
              )}
      </Card>
    </>
  )
}

export default WithdrawHistory
