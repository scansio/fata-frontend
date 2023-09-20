/* eslint-disable require-jsdoc */
import React from 'react'
import Main from '../layout/Main'
import { Card, Col, Container, Nav, NavItem, Row } from 'react-bootstrap'
import { Link, useLocation } from 'react-router-dom'
import ReferralTab from '../components/tabs/referral/ReferralTab'
import TeamSalesTab from '../components/tabs/referral/TeamSalesTab'
import NetworthTab from '../components/tabs/referral/NetworthTab'

function Referral (props) {
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
                  <h5>Referral</h5>
                </Card.Header>
                <Card.Footer className="mt-0 pt-0 mx-1 px-1">
                  <Nav variant="pills" className="s-grid">
                    <NavItem>
                      <Link
                        to="../referral?tab=referral"
                        className={`nav-link ${
                          !tab || tab === 'referral' ? 'active' : ''
                        }`}
                      >
                        <i className="me-1"></i> Referral Earning
                      </Link>
                    </NavItem>
                    <NavItem>
                      <Link
                        to="../referral?tab=team-sales"
                        className={`nav-link ${
                          tab === 'team-sales' ? 'active' : ''
                        }`}
                      >
                        <i className="me-1"></i> Team Sales
                      </Link>
                    </NavItem>
                    <NavItem>
                      <Link
                        to="../referral?tab=net-worth"
                        className={`nav-link ${
                          tab === 'net-worth' ? 'active' : ''
                        }`}
                      >
                        <i className="me-1"></i> Team
                      </Link>
                    </NavItem>
                  </Nav>
                </Card.Footer>
              </Card>
            </Col>
            <Col xs="12" sm="12" md="12" lg="9" className="mt-3">
              <Card>
                <Card.Body>
                  {tab === 'team-sales'
                    ? (
                    <TeamSalesTab />
                      )
                    : tab === 'net-worth'
                      ? (
                    <NetworthTab />
                        )
                      : (
                    <ReferralTab />
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
export default Referral
