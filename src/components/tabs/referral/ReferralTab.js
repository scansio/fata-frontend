/* eslint-disable react/prop-types */
/* eslint-disable require-jsdoc */
import React, { useRef } from 'react'
import { ALL_REFERRAL_EARNING } from '../../../scripts/config/RestEndpoints'
import PaginatedTable, { DESCENDING } from '../../paginating/PaginatedTable'
import { ACTIVE, UID } from '../../../scripts/config/contants'
import SharedConfig from '../../../scripts/SharedConfig'

function ReferralTab ({ style, className, exchangerId }) {
  const urlRef = useRef(ALL_REFERRAL_EARNING)

  const fieldRef = useRef({
    fromUid: {
      name: 'Referree',
      type: Number,
      transform: {
        out: (row) => (
          <>
            <div className="text-italic">{row?.fromUid?.email}</div>
            <div className="fw-bold">
              {row?.fromUid?.firstname + ' ' + row?.fromUid?.lastname}
            </div>
          </>
        )
      }
    },
    level: {
      name: 'Level',
      type: String,
      transform: {
        out: (row) => (
          <>
            <div title={row?.level?.description}>{row?.level?.name}</div>
          </>
        )
      }
    },
    earned: {
      name: 'Earning',
      type: String,
      transform: {
        out: (row) => (
          <>
            <div className="fw-bold">${row?.earned || 0}</div>
          </>
        )
      }
    },
    'createdAt.date': { name: 'Date', type: Date }
  })

  const queryRef = useRef({
    populate: ['fromUid', 'toUid', 'level'],
    toUid: SharedConfig.getLocalData(UID),
    status: ACTIVE
  })

  return (
    <>
      <PaginatedTable
        className={className}
        style={style}
        url={urlRef.current}
        dataName="userReferralEarnings"
        fields={fieldRef.current}
        primaryKey="createdAt.date"
        sortOrder={DESCENDING}
        query={queryRef.current}
        forCurrentUser={false}
        noControl
      />
    </>
  )
}

export default ReferralTab
