/* eslint-disable require-jsdoc */
import React, { useEffect, useRef, useState } from 'react'
import Main from '../layout/Main'
import { Card, Col, Container, Nav, NavItem, Row } from 'react-bootstrap'
import { Link, useLocation } from 'react-router-dom'
import ExchangerTab from '../components/tabs/setting/ExchangerTab'
import SharedConfig from '../scripts/SharedConfig'
import { UID } from '../scripts/config/contants'
import { USER_EXCHANGERS } from '../scripts/config/RestEndpoints'
import Spinner from '../components/general/Spinner'
import { toast } from 'react-toastify'
import fetcher from '../scripts/SharedFetcher'

function Exchanger (props) {
  const location = useLocation()
  const tab = new URLSearchParams(location.search)?.get('tab')
  const [exchangers, setExchangers] = useState([])
  const [loadingExchangers, setLoadingExchangers] = useState(true)
  const [loadingError, setLoadingError] = useState(false)
  const uidRef = useRef(SharedConfig.getLocalData(UID))

  useEffect(() => {
    async function getMyExchangers () {
      setLoadingExchangers(true)
      setLoadingError(false)
      let data
      try {
        data = await fetcher.fetch(USER_EXCHANGERS + `${uidRef.current}`)
      } catch (er) {
        setLoadingError(true)
        toast.error(er.message)
      }
      if (data) {
        if (!data.data.status) {
          setLoadingError(true)
          toast.error(data.data.message)
        } else {
          setExchangers(data.data.exchangers)
        }
      }
      setLoadingExchangers(false)
    }
    getMyExchangers()
  }, [])

  return (
    <>
      <Main {...props}>
        <Container fluid>
          <Row>
            <Col xs="12" sm="12" md="12" lg="3">
              <Card>
                <Card.Header className="mb-0 pb-0">
                  <h5>Exchangers</h5>
                </Card.Header>
                <Card.Header className="mt-0 pt-0">
                  Exchangers transaction
                </Card.Header>
                <Card.Footer className="mt-0 pt-0 mx-1 px-1">
                  <Nav variant="pills" className="s-grid">
                    <Spinner
                      loading={loadingExchangers}
                      loadingText={'Loading...'}
                      loadingError={loadingError}
                    >
                      {exchangers.map((exchanger, index) => (
                        <NavItem key={exchanger.id}>
                          <Link
                            to={`../exchanger?tab=${exchanger.id}`}
                            className={`nav-link ${
                              (!tab && index == 0) || tab == exchanger.id
                                ? 'active'
                                : ''
                            }`}
                          >
                            {exchanger.name}
                          </Link>
                        </NavItem>
                      ))}
                    </Spinner>
                  </Nav>
                </Card.Footer>
              </Card>
            </Col>
            <Col xs="12" sm="12" md="12" lg="9" className="mt-3">
              <Card>
                <Card.Body>
                  {exchangers.map((exchanger, index) =>
                    (!tab && index == 0) || tab == exchanger.id
                      ? (
                      <ExchangerTab
                        key={exchanger.id}
                        exchangerId={exchanger?.id}
                      />
                        )
                      : null
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </Main>
    </>
  )
}
export default Exchanger
