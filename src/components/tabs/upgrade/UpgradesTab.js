import React, { useEffect, useRef, useState } from 'react'
import { Button, ButtonGroup, Card, Col } from 'react-bootstrap'
import PaginatedTable from '../../paginating/PaginatedTable'
import {
  ALL_PACKAGE,
  CREATE_PACKAGE_TRANSACTION,
  RENEW_PACKAGE_TRANSACTION,
  USER_PLAN
} from '../../../scripts/config/RestEndpoints'
import fetcher from '../../../scripts/SharedFetcher'
import Spinner from '../../paginating/Spinner'
import { UID } from '../../../scripts/config/contants'
import ModalBox from '../../general/Modal'
import SharedConfig from '../../../scripts/SharedConfig'
import { FaRocket } from 'react-icons/fa'
import { toast } from 'react-toastify'
import HumanizeTimestamp from '../../general/HumanizeTimestamp'

function UpgradesTab (props) {
  const urlRef = useRef(ALL_PACKAGE)
  const [reload, setReload] = useState('')
  const [loading, setLoading] = useState(true)
  const [loadingError, setLoadingError] = useState('')
  const [itemId, setItemId] = useState('')
  const [showConfirmUpgrade, setShowConfirmUpgrade] = useState('')
  const [myPlan, setMyPlan] = useState('')

  const [forRenewal, setForRenewal] = useState(false)

  useEffect(() => {
    const uid = SharedConfig.getLocalData(UID)
    fetcher
      .fetch(USER_PLAN + uid)
      .then((data) => {
        setLoading(false)
        setMyPlan(data?.data?.plan)
      })
      .catch((error) => {
        setLoading(false)
        setLoadingError(error.message)
      })
  }, [])

  const cardViewRef = (rowData, resultIndex) => (
    <Col xs="12" sm="6" lg="6">
      <Card className="m-1">
        <Card.Header className="text-center fw-bold text-dark h1">
          {rowData?.name}
        </Card.Header>
        <Card.Body
          dangerouslySetInnerHTML={{
            __html: rowData?.description || rowData?.name
          }}
        ></Card.Body>
        <Card.Footer>{out(rowData, resultIndex)}</Card.Footer>
      </Card>
    </Col>
  )
  async function confirmPackage (packageId) {
    const fetchData = {
      url: CREATE_PACKAGE_TRANSACTION,
      data: { packageId, uid: SharedConfig.getLocalData(UID) }
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
  async function renewPackage () {
    let data
    try {
      data = await fetcher.fetch(RENEW_PACKAGE_TRANSACTION)
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
    return myPlan?.packageId?.code === rowData?.code
      ? (
      <div className="s-grid">
        <span className="text-white fw-bold badge badge-primary bg-gray p-2 text-center text-capitalize">
          Expires <HumanizeTimestamp timestamp={myPlan?.expires} />
        </span>
        <span className="text-white fw-bold badge bg-green p-2 text-center mx-1">
          Your Current License
        </span>
        <Button variant="danger" size="sm" onClick={() => setForRenewal(true)}>
          Renew
        </Button>
        <ModalBox
          show={forRenewal}
          onCancel={() => setForRenewal(false)}
          onAccept={renewPackage}
          header={<h1 className="text-center">Confirm Renewal</h1>}
          type="danger"
          backdrop
        >
          <span>Please confirm renewing your license</span>
        </ModalBox>
      </div>
        )
      : myPlan?.packageId?.code > rowData?.code
        ? (
      <>
        <b className="h2 fa fa-xl text-primary">
          <i className="fas fa-dollar"></i>
          {rowData?.amount}
        </b>{' '}
      </>
          )
        : (
      <>
        <b className="h2 fa fa-xl text-primary">
          <i className="fas fa-dollar"></i>
          {rowData?.amount}
        </b>
        <ButtonGroup size="sm" className="m-1 pull-right">
          <Button
            onClick={() => {
              setShowConfirmUpgrade(true)
              setItemId(rowData._id)
            }}
            style={{ padding: '5px' }}
            variant="success"
          >
            <FaRocket /> Buy
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
        onAccept={() => confirmPackage(itemId)}
        header={<h1 className="text-center">Confirm Purchase</h1>}
        type="danger"
        backdrop
      >
        <span>Confirm purchasing license?</span>
      </ModalBox>
      {reload ? <span></span> : ''}
      <Spinner
        loading={loading}
        loadingError={loadingError}
        loadingText="Loading my package"
      >
        <PaginatedTable
          url={urlRef.current}
          dataName="packages"
          reload={reload}
          type="card"
          cardView={cardViewRef}
          primaryKey="code"
          searchKey="name"
          forCurrentUser={false}
          noControl
          hidePaginator
        />
      </Spinner>
    </>
  )
}

export default UpgradesTab
