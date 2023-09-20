import React from 'react'
import { ALL_TRANSACTION } from '../../../../scripts/config/RestEndpoints'
import PaginatedTable, { DESCENDING } from '../../../paginating/PaginatedTable'

function DepositHistory () {
  const url = ALL_TRANSACTION

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
    'createdAt.date': { name: 'Created', type: Date }
  }

  const query = {
    type: 'deposit',
    populate: ['token']
  }

  return (
    <PaginatedTable
      url={url}
      dataName="transactions"
      fields={fields}
      query={query}
      primaryKey="createdAt.date"
      sortOrder={DESCENDING}
    />
  )
}

export default DepositHistory
