/* eslint-disable react/prop-types */
/* eslint-disable require-jsdoc */
import accounting from 'accounting'
import React from 'react'
export default function TDSellAt ({ data }) {
  return (
    <>
      <div>
        <span className="text-primary">
          {data?.exchanger?.name}&nbsp;
          {!data.packageEligible
            ? (
            <i className="fas fa-lock text-danger"></i>
              )
            : (
                ''
              )}
        </span>
      </div>
      <div>
        <span className="text-bold">
          {accounting.formatMoney(data?.amount, '$', 8)}
        </span>
      </div>
      {/*
      <div>
        <span className="text-danger">
          Vol:
          <span className="">{' $'}{data?.userBalance || 0}</span>
        </span>
      </div> */}
    </>
  )
}
