/* eslint-disable react/prop-types */
/* eslint-disable require-jsdoc */
import React, { useEffect, useState } from 'react'
import fetcher from '../../../../scripts/SharedFetcher'
import {
  PACKAGE,
  USER_PACKAGE
} from '../../../../scripts/config/RestEndpoints'
import SharedConfig from '../../../../scripts/SharedConfig'
import { UID } from '../../../../scripts/config/contants'
export default function TDDifference ({ data }) {
  const [myPackage, setMyPackage] = useState(null)
  const [buyFromExchangerPackage, setBuyFromExchangerPackage] = useState(null)
  const [sellToExchangerPackage, setSellToExchangerPackage] = useState(null)

  useEffect(() => {
    const uid = SharedConfig.getLocalData(UID)
    fetcher
      .fetch(USER_PACKAGE + uid)
      .then((data) => {
        setMyPackage(data?.data?.package)
      })
      .catch()
  }, [])

  useEffect(() => {
    if (data) {
      fetcher
        .fetch(PACKAGE + data?.buyFrom?.exchanger?.packageId)
        .then((data) => {
          setBuyFromExchangerPackage(data?.data?.package)
        })
        .catch()
      fetcher
        .fetch(PACKAGE + data?.sellTo?.exchanger?.packageId)
        .then((data) => {
          setSellToExchangerPackage(data?.data?.package)
        })
        .catch()
    }
  }, [data])

  return (
    <>
      <div>
        <span className='text-info'>{data?.percentage.toFixed(8)}% </span>
      </div>
      {(buyFromExchangerPackage?.code > sellToExchangerPackage?.code
        ? buyFromExchangerPackage
        : sellToExchangerPackage
      )?.code > myPackage?.code
        ? (
        <div className="badge bg-info fw-bold">
          {(buyFromExchangerPackage?.code > sellToExchangerPackage?.code
            ? buyFromExchangerPackage
            : sellToExchangerPackage
          )?.name + ' +'}
        </div>
          )
        : (
        <div>
          <span className='text-primary'>{data?.token}</span>
        </div>
          )}
    </>
  )
}
