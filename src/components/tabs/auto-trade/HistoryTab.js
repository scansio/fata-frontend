import React from 'react'
import { ALL_AUTO_TRADE_PLAN_TRANSACTION } from '../../../scripts/config/RestEndpoints'
import PaginatedTable, { DESCENDING } from '../../paginating/PaginatedTable'
import accounting from 'accounting'

function HistoryTab (props) {
  const url = ALL_AUTO_TRADE_PLAN_TRANSACTION

  const fields = {
    duration: {
      name: 'Duration',
      type: String,
      transform: {
        out: (row) => (
          <>
            <div className="fw-bold">{row?.duration?.durationTitle}</div>
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
  }

  const query = {
    populate: ['duration']
  }

  return (
    <PaginatedTable
      url={url}
      dataName="autoTradePlanTransactions"
      fields={fields}
      query={query}
      primaryKey="createdAt.date"
      sortOrder={DESCENDING}
/>
  )
}

export default HistoryTab
