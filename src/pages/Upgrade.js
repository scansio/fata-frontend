/* eslint-disable require-jsdoc */
import React from 'react'
import Main from '../layout/Main'
import { Card, Col, Container, Nav, NavItem, Row } from 'react-bootstrap'
import { Link, useLocation } from 'react-router-dom'
import UpgradesTab from '../components/tabs/upgrade/UpgradesTab'
import UpgradeHistoryTab from '../components/tabs/upgrade/UpgradeHistoryTab'

function Upgrade (props) {
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
                  <h5>License</h5>
                </Card.Header>
                <Card.Header className="mt-0 pt-0">
                  Purchase a License
                </Card.Header>
                <Card.Footer className="mt-0 pt-0 mx-1 px-1">
                  <Nav variant="pills" className="s-grid">
                    <NavItem>
                      <Link
                        to="../license?tab=upgrades"
                        className={`nav-link ${
                          !tab || tab === 'upgrades' ? 'active' : ''
                        }`}
                      >
                        <i className="fas fa-rocket me-1"></i> License
                        Packages
                      </Link>
                    </NavItem>{' '}
                    <NavItem>
                      <Link
                        to="../license?tab=history"
                        className={`nav-link ${
                          tab === 'history' ? 'active' : ''
                        }`}
                      >
                        <i className="fas fa-exchange me-1"></i> License History
                      </Link>
                    </NavItem>
                  </Nav>
                </Card.Footer>
              </Card>
            </Col>
            <Col xs="12" sm="12" md="12" lg="9" className="mt-3">
              {tab === 'history' ? <UpgradeHistoryTab {...props}/> : <UpgradesTab {...props}/>}
            </Col>
          </Row>
        </Container>
      </Main>
    </>
  )
}
export default Upgrade
