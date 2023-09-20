/* eslint-disable require-jsdoc */
import React from 'react'
import Main from '../layout/Main'
import { Card, Col, Container, Nav, NavItem, Row } from 'react-bootstrap'
import { Link, useLocation } from 'react-router-dom'
import ChangePinTab from '../components/tabs/setting/ChangePinTab'
import PreferencesTab from '../components/tabs/setting/PreferencesTab'
import ProfileTab from '../components/tabs/setting/ProfileTab'
import ExchangerTab from '../components/tabs/setting/ExchangerTab'
import ChangePasswordTab from '../components/tabs/setting/ChangePasswordTab'

function Setting (props) {
  const location = useLocation()
  const urlObj = new URLSearchParams(location.search)
  const tab = urlObj?.get('tab')
  const category = urlObj?.get('category')

  return (
    <>
      <Main {...props}>
        <Container fluid>
          <Row>
            <Col xs="12">
              <Card>
                <Card.Header className="mb-0 pb-0">
                  <h5>Setting</h5>
                </Card.Header>
                <Card.Header className="mt-0 pt-0">Setting</Card.Header>
                <Card.Footer className="mt-0 pt-0 mx-1 px-1">
                  <Nav variant="pills" className="s-grid">
                    <NavItem>
                      <Link
                        to="../setting?tab=profile"
                        className={`nav-link ${
                          !tab || tab === 'profile' ? 'active' : ''
                        }`}
                      >
                        <i className="fas fa-user-gear me-1"></i> Profile
                      </Link>
                    </NavItem>

                    <NavItem>
                      <Link
                        to="../setting?tab=preferences"
                        className={`nav-link ${
                          tab === 'preferences' ? 'active' : ''
                        }`}
                      >
                        <i className="fas fa-gears me-1"></i> Preferences
                      </Link>
                    </NavItem>
                    <NavItem>
                      <Link
                        to="../setting?tab=change-pin"
                        className={`nav-link ${
                          tab === 'change-pin' ? 'active' : ''
                        }`}
                      >
                        <i className="fas fa-lock me-1"></i> Change Pin
                      </Link>
                    </NavItem>
                    <NavItem>
                      <Link
                        to="../setting?tab=change-password"
                        className={`nav-link ${
                          tab === 'change-password' ? 'active' : ''
                        }`}
                      >
                        <i className="fas fa-lock me-1"></i> Change Password
                      </Link>
                    </NavItem>
                    <NavItem>
                      <Link
                        to="../setting?tab=exchangers"
                        className={`nav-link ${
                          tab === 'exchangers' ? 'active' : ''
                        }`}
                      >
                        <i className="fas fa-exchange me-1"></i> My Exchangers
                      </Link>
                    </NavItem>
                  </Nav>
                </Card.Footer>
              </Card>
            </Col>
            <Col xs="12" className="mt-3">
              {tab === 'preferences'
                ? (
                <PreferencesTab category={category} {...props}/>
                  )
                : tab === 'change-pin'
                  ? (
                <ChangePinTab {...props}/>
                    )
                  : tab === 'change-password'
                    ? (
                <ChangePasswordTab {...props}/>
                      )
                    : tab === 'exchangers'
                      ? (
                <ExchangerTab {...props}/>
                        )
                      : (
                <ProfileTab {...props}/>
                        )}
            </Col>
          </Row>
        </Container>
      </Main>
    </>
  )
}
export default Setting
