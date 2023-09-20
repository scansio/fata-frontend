/* eslint-disable require-jsdoc */
/* eslint-disable react/prop-types */
import accounting from 'accounting'
import React from 'react'
export default function TDBuyHere ({ data }) {
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
