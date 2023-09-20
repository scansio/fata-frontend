import React from "react";
import { ALL_EXCHANGER_TRANSACTION } from "../../../../scripts/config/RestEndpoints";
import PaginatedTable, { DESCENDING } from "../../../paginating/PaginatedTable";

function ExchangerHistory(props) {
  const url = ALL_EXCHANGER_TRANSACTION;

  const fields = {
    exchanger: { name: "Exchanger", type: String },
    amount: {
      name: "Amount",
      type: Number,
      transform: {
        out: (row) => (
          <>
            <div className="fw-bold">{row?.amount}USDT</div>
          </>
        ),
      },
    },
    type: { name: "Type", type: String },
    description: { name: "Description", type: String },
    status: { name: "Status", type: String },
    'createdAt.date': { name: "Created", type: Date },
  };

  return (
    <PaginatedTable
      url={url}
      dataName="exchangerTransactions"
      fields={fields}
      primaryKey="createdAt.date"
      sortOrder={DESCENDING}
  />
  );
}

export default ExchangerHistory;
