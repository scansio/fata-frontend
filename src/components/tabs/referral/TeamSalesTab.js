/* eslint-disable react/prop-types */
/* eslint-disable require-jsdoc */
import React, { useRef } from 'react'
import { ALL_TEAM_SALES } from '../../../scripts/config/RestEndpoints'
import PaginatedTable from '../../paginating/PaginatedTable'
import { ACTIVE, UID } from '../../../scripts/config/contants'
import SharedConfig from '../../../scripts/SharedConfig'

function TeamSalesTab ({ style, className }) {
  const urlRef = useRef(ALL_TEAM_SALES)

  const fieldRef = useRef({
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
    team: {
      name: 'Teams',
      type: String,
      transform: {
        out: (row) => (
          <>
            <div className="fw-bold">{row?.team}</div>
          </>
        )
      }
    },
    sales: {
      name: 'Sales',
      type: String,
      transform: {
        out: (row) => (
          <>
            <div className="fw-bold">${row?.sales || 0}</div>
          </>
        )
      }
    },
    'createdAt.date': { name: 'Date', type: Date }
  })

  const queryRef = useRef({
    populate: ['level'],
    toUid: SharedConfig.getLocalData(UID),
    status: ACTIVE
  })

  return (
    <>
      <PaginatedTable
        className={className}
        style={style}
        url={urlRef.current}
        dataName="teamSales"
        fields={fieldRef.current}
        primaryKey="level"
        query={queryRef.current}
        noControl
      />
    </>
  )
}

export default TeamSalesTab
