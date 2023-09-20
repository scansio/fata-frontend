import React, { useEffect, useRef, useState } from 'react'
import { Button, ButtonGroup, Card, Col } from 'react-bootstrap'
import PaginatedTable from '../../paginating/PaginatedTable'
import {
  CREATE_AUTO_TRADE_PLAN,
  AUTO_TRADE_PLAN_RENEWAL,
  USER_AUTO_TRADE_PLAN,
  ALL_AUTO_TRADE_DURATION
} from '../../../scripts/config/RestEndpoints'
import fetcher from '../../../scripts/SharedFetcher'
import Spinner from '../../paginating/Spinner'
import { UID } from '../../../scripts/config/contants'
import ModalBox from '../../general/Modal'
import SharedConfig from '../../../scripts/SharedConfig'
import { FaRocket } from 'react-icons/fa'
import { toast } from 'react-toastify'

function PlanTab (props) {
  const urlRef = useRef(ALL_AUTO_TRADE_DURATION)
  const [reload, setReload] = useState('')
  const [loading, setLoading] = useState(true)
  const [loadingError, setLoadingError] = useState('')
  const [itemId, setItemId] = useState('')
  const [showConfirmUpgrade, setShowConfirmUpgrade] = useState('')
  const [myPlan, setMyPlan] = useState('')

  const [forRenewal, setForRenewal] = useState(false)

  useEffect(() => {
    fetcher
      .fetch(USER_AUTO_TRADE_PLAN)
      .then((data) => {
        setLoading(false)
        setMyPlan(data?.data?.myPlan)
      })
      .catch((error) => {
        setLoading(false)
        setLoadingError(error.message)
      })
  }, [])

  const cardViewRef = (rowData, resultIndex) => (
    <Col xs="12" sm="6" md="6" lg="6">
      <Card className="m-1">
        <Card.Header className="text-center fw-bold text-dark h1">
          {rowData?.durationTitle}
        </Card.Header>
        <Card.Body
          dangerouslySetInnerHTML={{
            __html: rowData?.description
          }}
        ></Card.Body>
        <Card.Footer>{out(rowData, resultIndex)}</Card.Footer>
      </Card>
    </Col>
  )
  async function confirmPlan (duration) {
    const fetchData = {
      url: CREATE_AUTO_TRADE_PLAN,
      data: { duration, uid: SharedConfig.getLocalData(UID) }
    }
    let data = null
    try {
      data = await fetcher.fetch(fetchData)
    } catch (er) {
      toast.error(er.message)
    }
    if (!data?.data?.status) {
      toast.error(data.data.message)
    } else {
      setShowConfirmUpgrade(false)
      setReload(!reload)
      toast.success(data.data.message)
    }
  }
  async function renewPlan () {
    let data
    try {
      data = await fetcher.fetch(AUTO_TRADE_PLAN_RENEWAL)
    } catch (er) {
      toast.error(er.message)
    }
    if (!data?.data?.status) {
      toast.error(data.data.message)
    } else {
      setForRenewal(false)
      setReload(!reload)
      toast.success(data.data.message)
    }
  }

  function out (rowData, rowIndex) {
    return myPlan?.duration.code === rowData?.code
      ? (
      <div className="s-grid">
        <span className="text-white fw-bold badge badge-green bg-green p-2 text-center">
          Your Current Plan
        </span>
        <Button variant="danger" size="sm" onClick={() => setForRenewal(true)}>
          Renew
        </Button>
        <ModalBox
          show={forRenewal}
          onCancel={() => setForRenewal(false)}
          onAccept={renewPlan}
          header={<h1 className="text-center">Confirm Renewal</h1>}
          type="danger"
          backdrop
        >
          <span>Please confirm renewing your plan</span>
        </ModalBox>
      </div>
        )
      : myPlan?.duration?.code > rowData?.code
        ? (
      <>
        <b className="h2 fa fa-xl text-primary"><i className="fas fa-dollar"></i>{rowData?.amount}</b>
        <span className="h2 fa fa-xl text-primary">/</span>
        <span className="text-warning font-xs">
          {rowData?.durationInDays} days
        </span>
        <span className="ms-2  text-info">{rowData?.percentageOff}% Off</span>
      </>
          )
        : (
      <>
        <b className="h2 fa fa-xl text-primary"><i className="fas fa-dollar"></i>{rowData?.amount}</b>
        <span className="h2 fa fa-xl text-primary">/</span>
        <span className="text-warning font-xs">
          {rowData?.durationInDays} days
        </span>
        <span className="ms-2  text-info">{rowData?.percentageOff}% Off</span>

        <ButtonGroup size="sm" className="m-1 pull-right">
          <Button
            onClick={() => {
              setItemId(rowData._id)
              setShowConfirmUpgrade(true)
            }}
            style={{ padding: '5px' }}
            variant="success"
          >
            <FaRocket /> Activate
          </Button>
        </ButtonGroup>
      </>
          )
  }

  return (
    <>
      <ModalBox
        show={showConfirmUpgrade}
        onCancel={() => setShowConfirmUpgrade(false)}
        onAccept={() => confirmPlan(itemId)}
        header={<h1 className="text-center">Confirm Upgrading</h1>}
        type="danger"
        backdrop
      >
        <span>Confirm upgrading to plan</span>
      </ModalBox>
      {
        <Spinner
          loading={loading}
          loadingError={loadingError}
          loadingText="Loading my plan"
        >
          <PaginatedTable
            url={urlRef.current}
            dataName="autoTradeDurations"
            reload={reload}
            type="card"
            cardView={cardViewRef}
            primaryKey="code"
            searchKey="durationTitle"
            forCurrentUser={false}
            noControl
            hidePaginator
          />
        </Spinner>
      }
    </>
  )
}

export default PlanTab
