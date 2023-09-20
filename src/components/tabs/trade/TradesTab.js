/* eslint-disable react/prop-types */
/* eslint-disable require-jsdoc */
import React, { useRef, useState } from 'react'
import {
  ALL_SIGNAL,
  ALL_TRADE
} from '../../../scripts/config/RestEndpoints'
import PaginatedTable, { DESCENDING } from '../../paginating/PaginatedTable'
import ModalBox from '../../general/Modal'
import TDStatus from './trade_tab_components/TDStatus'
import TDDifference from './trade_tab_components/TDDifference'
import TDBuyHere from './trade_tab_components/TDBuyHere'
import TDSellAt from './trade_tab_components/TDSellAt'
import accounting from 'accounting'

function TradesTab ({ style, className }) {
  const urlRef = useRef(ALL_TRADE)
  const signalUrlRef = useRef(ALL_SIGNAL)

  const [viewSignal, setViewSignal] = useState(false)
  const [signalId, setSignalId] = useState('')

  const fieldRef = useRef({
    signal: {
      name: 'Signal',
      type: String,
      transform: {
        out: (row) => {
          return (
            <>
              <i className="fw-bold" >{row?.signal?.token}</i>
            </>
          )
        }
      }
    },
    // transaction: { name: "Transaction", type: String },
    allocation: { name: 'Allocated', type: Number },
    amount: {
      name: 'Total Amount',
      type: Number,
      transform: {
        out: (row) => (
          <>
            <div className="fw-bold">{accounting.formatMoney(row?.amount, '$', 8)}
            </div>
          </>
        )
      }
    },
    transaction: {
      name: 'Profit',
      type: String,
      virtual: true,
      transform: {
        out: (row) => (
          <>
            <div className="text-success">+{accounting.formatMoney(row?.transaction?.resolvedAmount, '$', 8)}</div>
          </>
        )
      }
    },
    status: { name: 'Status', type: String },
    'createdAt.date': { name: 'Date', type: Date }
  })

  const signalFieldRef = useRef({
    status: {
      name: 'Status',
      type: String,
      transform: {
        out: (row) => (
          <TDStatus
            data={row}
            loader={row?._id}
            status={row?.status}
            used={row?.used}
            trading={false}
            second={10}
            setDone={(done) => {}}
          />
        )
      }
    },
    percentage: {
      name: 'Difference',
      type: Number,
      transform: {
        out: (row) => {
          return <TDDifference data={row} />
        }
      }
    },
    'buyFrom.exchanger': {
      name: 'Buy Exchanger',
      type: String,
      transform: {
        out: (row) => {
          return <TDBuyHere data={row?.buyFrom} />
        }
      },
      hideFromSearch: true
    },
    'sellTo.exchanger': {
      name: 'Sell Exchanger',
      type: String,
      transform: {
        out: (row) => {
          return <TDSellAt data={row?.sellTo} />
        }
      },
      hideFromSearch: true
    }
  })
  const signalQuery = {
    _id: signalId,
    populate: ['sellTo.exchanger', 'buyFrom.exchanger']
  }

  const queryRef = useRef({
    populate: ['signal', 'transaction']
  })

  return (
    <>
      <ModalBox
        show={viewSignal}
        onCancel={() => setViewSignal(false)}
        control={false}
        backdrop
        noHeader
        noControl
      >
        <PaginatedTable
          style={{
            tableStyle: {
              fontSize: '11px',
              ...style
            },
            tdStyle: {
              padding: '5px'
            }
          }}
          className={{ tdClass: 'text-center', tableStyle: className || '' }}
          url={signalUrlRef.current}
          dataName="signals"
          fields={signalFieldRef.current}
          primaryKey="_id"
          sortOrder={DESCENDING}
          forCurrentUser={false}
          query={signalQuery}
          noControl
          noScroll
          noDoubleClick
          numbered={false}
        />
      </ModalBox>
      <PaginatedTable
        style={style}
        className={className}
        url={urlRef.current}
        dataName="trades"
        primaryKey="createdAt.date"
        sortOrder={DESCENDING}
        fields={fieldRef.current}
        query={queryRef.current}
        rowOptions={(rowData) => ({
          onClick: () => {
            setSignalId(rowData?.signal?._id)
            setViewSignal(true)
          }
        })}
        noControl
        noClickOpen
      />
    </>
  )
}

export default TradesTab
