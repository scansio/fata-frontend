/* eslint-disable react/prop-types */
/* eslint-disable require-jsdoc */
import React, { useContext, useMemo, useRef, useState } from 'react'
import {
  ALL_SIGNAL,
  CREATE_TRADE
} from '../../../../scripts/config/RestEndpoints'
import PaginatedTable, { DESCENDING } from '../../../paginating/PaginatedTable'
import ModalBox from '../../../general/Modal'
import fetcher from '../../../../scripts/SharedFetcher'
import TradeForm from './TradeForm'
import TDStatus from './TDStatus'
import TDDifference from './TDDifference'
import TDBuyHere from './TDBuyHere'
import TDSellAt from './TDSellAt'
import SharedConfig from '../../../../scripts/SharedConfig'
import { ACTIVE, INACTIVE, UID } from '../../../../scripts/config/contants'
import {
  StateContext,
  StateProvider
} from '../../../context/tradingStatusContext'

function TV ({
  search,
  className,
  style,
  noScroll,
  size,
  todaySignal,
  activeOnly,
  hidePaginator
}) {
  const [reload, setReload] = useState(false)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [itemId, setItemId] = useState('')
  const [updatingData, setUpdatingData] = useState(null)
  // If searched found exchanger id are stored here
  const [percentage, setPercentage] = useState('')
  const { state, dispatch } = useContext(StateContext)

  /* useEffect(() => {
    const getExchangerRelatedName = async (s) => {
      const q = encodeQuery({
        $in: [{ name: [s] }]
      })
      let data = null
      try {
        data = await fetcher.fetch(ALL_TOKEN + '?size=500&q=' + q)
      } catch (er) {
        toast.error(er.message)
      }
      if (!data?.data?.status) {
        toast.error(data.data.message)
      } else {
        if (Array.isArray(data.data.tokens.results)) {
          const matchedTokenIds = []
          for (const token of data.data.tokens.results) {
            matchedTokenIds.push(token._id)
          }
          setFound(matchedTokenIds)
        }
      }
    }
    if (search) {
      getExchangerRelatedName(search)
    }
  }, [search]) */

  const urlRef = useRef(ALL_SIGNAL)
  const fieldRef = useRef({
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
            trading={state?.trading}
            second={10}
            setDone={(done) => {
              dispatch({ type: 'DONE' })
              setReload(!reload)
            }}
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
    },
    'createdAt.time': { name: 'Date', type: Date }
  })

  const query = useMemo(() => {
    const q = {
      populate: ['sellTo.exchanger', 'buyFrom.exchanger']
    }
    if (search) {
      q.token = search
    }
    if (todaySignal) {
      q.createdAt = 'today'
    }
    if (activeOnly) {
      q.status = ACTIVE
    }
    return q
  }, [search])

  function check (rowData) {
    setShowCreateForm(true)
    setUpdatingData(rowData)
    setItemId(rowData._id)
  }

  function createTrade (e, amount) {
    dispatch({ type: 'START', payload: itemId })
    setShowCreateForm(false)
    e.preventDefault()
    const gdFetchSignal = {
      url: CREATE_TRADE,
      data: {
        uid: SharedConfig.getLocalData(UID),
        amount,
        signal: itemId
      }
    }
    fetcher
      .fetch(gdFetchSignal)
      .then((data) => {
        if (data) {
          if (!data.data.status) {
            dispatch({ type: 'ERROR', payload: data.data.message })
          } else {
            dispatch({ type: 'SUCCESS', payload: data.data.message })
          }
        }
      })
      .catch((er) => {
        dispatch({ type: 'ERROR', payload: er.message })
      })
  }

  return (
    <>
      <ModalBox
        show={showCreateForm}
        onCancel={() => {
          setShowCreateForm(false)
          setUpdatingData(null)
          setItemId('')
        }}
        control={false}
        header={
          <h2 className="text-center">
            Trade Signal
            <br />
            <i className="fa-xs">
              How much would you like to trade this signal that has{' '}
              <b className="text-red fa">{updatingData?.percentage}%</b>{' '}
              percentage profit.
            </i>
            {percentage
              ? (
              <>
                <br />
                <br />
                <b className="fa-xs">
                  You will get estimately{' '}
                  <span className="text-blue">{percentage}</span>
                </b>
              </>
                )
              : null}
          </h2>
        }
        backdrop
      >
        <TradeForm
          setReload={(e) => setReload(!reload)}
          createTrade={createTrade}
          data={updatingData}
          setPercentage={(result) => setPercentage(result)}
        />
      </ModalBox>

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
        url={urlRef.current}
        dataName="signals"
        fields={fieldRef.current}
        primaryKey="createdAt.date"
        sortOrder={DESCENDING}
        forCurrentUser={false}
        reload={reload}
        query={query}
        rowOptions={(rowData) => ({
          title: rowData?.used
            ? 'You have traded this signal'
            : rowData?.status === INACTIVE
              ? 'Closed'
              : !(
                  rowData?.buyFrom?.packageEligible &&
                rowData?.sellTo?.packageEligible
                )
                  ? 'You not eligible for this signal upgrade your package'
                  : !state?.trading
                      ? 'Click to Trade'
                      : 'Trading please wait..',
          onClick:
            !state?.trading &&
            rowData?.eligible &&
            !rowData?.used &&
            rowData?.status === ACTIVE
              ? check
              : () => {},
          style: {
            cursor:
              rowData?.used ||
              rowData?.status !== ACTIVE ||
              !(
                rowData?.buyFrom?.packageEligible &&
                rowData?.sellTo?.packageEligible
              )
                ? 'not-allowed'
                : state?.trading
                  ? 'wait'
                  : 'pointer'
          }
        })}
        size={size}
        noControl
        noScroll={noScroll}
        noDoubleClick
        noClickOpen
        hidePaginator={hidePaginator}
        numbered={false}
      />
    </>
  )
}

function TradeView (props) {
  return (
    <StateProvider>
      <TV {...props} />
    </StateProvider>
  )
}

export default TradeView
