/* eslint-disable react/prop-types */
/* eslint-disable require-jsdoc */
import React, { useEffect, useMemo, useRef, useState } from 'react'
import {
  ALL_REFERRAL_LEVEL,
  TEAM_SALES_SUMMARY
} from '../../../scripts/config/RestEndpoints'
import PaginatedTable from '../../paginating/PaginatedTable'
import fetcher from '../../../scripts/SharedFetcher'
import { FormSelect } from 'react-bootstrap'

function NetworthTab ({ style, className }) {
  const [referralLevels, setReferralLevels] = useState([])
  const [level, setLevel] = useState('')

  const fieldRef = useRef({
    name: {
      name: 'Name',
      type: String
    },
    referrer: {
      name: 'Referrer',
      type: String
    },
    license: {
      name: 'License',
      type: String
    },
    team: {
      name: 'Team',
      type: Number
    },
    sales: {
      name: 'Team Sales',
      type: Number
    }
  })

  const urlRef = useRef(TEAM_SALES_SUMMARY)

  useEffect(() => {
    fetcher.fetch(ALL_REFERRAL_LEVEL).then((data) => {
      setReferralLevels(data?.data?.referralLevels?.results || [])
      data?.data?.referralLevels?.results &&
        setLevel(data?.data?.referralLevels?.results[0]?._id)
    })
  }, [])

  const queryRef = useMemo(
    () => ({
      level
    }),
    [level]
  )

  return (
    <>
      <span
        className=""
        style={{ position: 'absolute', right: '0', top: '0', margin: '3px' }}
      >
        <FormSelect
          className="form-control"
          value={level}
          onChange={(e) => setLevel(e.target.value)}
        >
          {referralLevels?.map((refLevel, i) => {
            return (
              <option key={i} value={refLevel?._id}>
                {refLevel?.name}
              </option>
            )
          })}
        </FormSelect>
      </span>
      {level
        ? (
        <PaginatedTable
          className={className}
          style={style}
          url={urlRef.current}
          query={queryRef}
          dataName="teamSales"
          fields={fieldRef.current}
          primaryKey="sales"
          forCurrentUser={false}
          noControl
          noPaginator
          reload={!level}
        />
          )
        : null}
    </>
  )
}

export default NetworthTab
