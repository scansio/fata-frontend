/* eslint-disable require-jsdoc */
import React, { useState } from 'react'
import Main from '../layout/Main'
import { Card, Col, Nav, NavItem, Row } from 'react-bootstrap'
import { Link, useLocation } from 'react-router-dom'
import HistoryTab from '../components/tabs/auto-trade/HistoryTab'
import SettingTab from '../components/tabs/auto-trade/SettingTab'
import PlanTab from '../components/tabs/auto-trade/PlanTab'
import SharedConfig from '../scripts/SharedConfig'

function AutoTrade (props) {
  const location = useLocation()
  const tab = new URLSearchParams(location.search)?.get('tab')

  const [noSettings, setNoSettings] = useState(false)

  return (
    <>
      <Main {...props}>
        <>
          <Row>
            <Col xs="12" sm="12" md="12" lg="4">
              <Card>
                <Card.Header className="text-center">
                  <h3>AutoTrades</h3>
                </Card.Header>

                <Card.Header
                  style={{ textAlign: 'justify' }}
                  dangerouslySetInnerHTML={{
                    __html:
                      SharedConfig.getSessionData('AUTO_TRADE_DESCRIPTION') ||
                      ''
                  }}
                ></Card.Header>
                <Card.Footer className="mx-1 px-1">
                  <Nav variant="pills" className="s-grid">
                    {noSettings
                      ? (
                      <NavItem>
                        <Link
                          to="../auto-trade?tab=plan"
                          className={`nav-link ${
                            !tab || tab === 'plan' ? 'active' : ''
                          }`}
                        >
                          <i className="fas fa-upload me-1"></i> Plan
                        </Link>
                      </NavItem>
                        )
                      : (
                      <>
                        <NavItem>
                          <Link
                            to="../auto-trade?tab=preference"
                            className={`nav-link ${
                              !tab || tab === 'preference' ? 'active' : ''
                            }`}
                          >
                            <i className="fas fa-cog me-1"></i> Preference
                          </Link>
                        </NavItem>
                        <NavItem>
                          <Link
                            to="../auto-trade?tab=plan"
                            className={`nav-link ${
                              tab === 'plan' ? 'active' : ''
                            }`}
                          >
                            <i className="fas fa-upload me-1"></i> Plan
                          </Link>
                        </NavItem>
                        <NavItem>
                          <Link
                            to="../auto-trade?tab=history"
                            className={`nav-link ${
                              tab === 'history' ? 'active' : ''
                            }`}
                          >
                            <i className="fas fa-history me-1"></i> History
                          </Link>
                        </NavItem>
                      </>
                        )}
                  </Nav>
                </Card.Footer>
              </Card>
            </Col>
            <Col xs="12" sm="12" md="12" lg="8">
              {noSettings
                ? (
                <PlanTab {...props} />
                  )
                : tab === 'history'
                  ? (
                <HistoryTab {...props} />
                    )
                  : tab === 'plan'
                    ? (
                <PlanTab {...props} />
                      )
                    : (
                <SettingTab {...props} setNoSettings={setNoSettings} />
                      )}
            </Col>
          </Row>
        </>
      </Main>
    </>
  )
}
export default AutoTrade
