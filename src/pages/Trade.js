/* eslint-disable require-jsdoc */
import React from 'react'
import Main from '../layout/Main'
import { Card, Col, Container, Nav, NavItem, Row } from 'react-bootstrap'
import { Link, useLocation } from 'react-router-dom'
import TradesTab from '../components/tabs/trade/TradesTab'
import SignalTab from '../components/tabs/trade/SignalTab'

function Trade (props) {
  const location = useLocation()
  const tab = new URLSearchParams(location.search)?.get('tab')

  return (
    <>
      <Main {...props}>
        <Container fluid>
          <Row>
            <Col xs="12" sm="12" md="12" lg="3">
              <Card>
                <Card.Header className="mb-0 pb-0">
                  <h5>Trade</h5>
                </Card.Header>
                <Card.Header className="mt-0 pt-0">Trade</Card.Header>
                <Card.Footer className="mt-0 pt-0 mx-1 px-1">
                  <Nav variant="pills" className="s-grid">
                    <NavItem>
                      <Link
                        to="../trade?tab=signal"
                        className={`nav-link ${
                          !tab || tab === 'signal' ? 'active' : ''
                        }`}
                      >
                        <i className="fas fa-line-chart me-1"></i> Signal
                      </Link>
                    </NavItem>

                    <NavItem>
                      <Link
                        to="../trade?tab=trades"
                        className={`nav-link ${
                          tab === 'trades' ? 'active' : ''
                        }`}
                      >
                        <i className="fas fa-history me-1"></i> Trades
                      </Link>
                    </NavItem>
                  </Nav>
                </Card.Footer>
              </Card>
            </Col>
            <Col xs="12" sm="12" md="12" lg="9" className="mt-3">
              <Card>
                <Card.Body>
                  {tab === 'trades'
                    ? (
                    <TradesTab {...props} />
                      )
                    : (
                    <SignalTab {...props} />
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
export default Trade
