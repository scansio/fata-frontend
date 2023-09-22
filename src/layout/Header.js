/* eslint-disable max-len */
/* eslint-disable require-jsdoc */
/* !

=========================================================
* Light Bootstrap Dashboard React - v2.0.1
=========================================================

* Product Page: https://www.creative-tim.com/product/light-bootstrap-dashboard-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/light-bootstrap-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import NavToggler from './layout_components/NavToggler.js'
import { ThemeConsumer } from '../components/context/theme.js'
import LogOut from '../pages/pages_components/LogOut.js'
import TradeView from '../components/tabs/trade/trade_tab_components/TradeView.js'
import fetcher from '../scripts/SharedFetcher.js'
import { USER_DETAIL, USER_PLAN } from '../scripts/config/RestEndpoints.js'
import { toast } from 'react-toastify'
import { useGetDataUri } from '../scripts/hooks/hookCollection.js'
import { Button } from 'react-bootstrap'

function Header () {
  const [inputValue, setInputValue] = useState('')
  const [search, setSearch] = useState(null)
  const [display, setDisplay] = useState(false)
  const [avatar, setFilename] = useGetDataUri()
  const [details, setDetails] = useState({})
  const [myPackage, setMyPackage] = useState(null)

  useEffect(() => {
    const getProfile = async () => {
      let data = null
      try {
        data = await fetcher.fetch(USER_DETAIL)
      } catch (er) {
        toast.error(er.message)
      }
      if (!data?.data?.status) {
        toast.error(data?.data?.message)
      } else {
        setDetails(data?.data?.user)
        data?.data?.user?.avatar && setFilename(data?.data?.user?.avatar)
      }
    }

    fetcher
      .fetch(USER_PLAN)
      .then((data) => {
        setMyPackage(data?.data?.plan?.packageId)
      })
      .catch((_error) => {})

    getProfile()
  }, [])

  const searchTimeoutRef = useRef(null)

  const handleSearch = (iv) => {
    clearTimeout(searchTimeoutRef.current)
    setSearch(iv)
    showTradeView()
  }

  const handleInputChange = (e) => {
    setInputValue(e.target.value)
    clearTimeout(searchTimeoutRef.current)
    searchTimeoutRef.current = setTimeout(() => {
      handleSearch(e.target.value)
    }, 500)
  }
  function showTradeView () {
    if (display) return
    setDisplay(true)
  }

  function hideTradeView () {
    setDisplay(false)
  }

  return (
    <ThemeConsumer>
      {(style) => (
        <div
          style={{
            position: `${display ? 'sticky' : 'initial'}`,
            top: 0,
            zIndex: display ? 1087 : 'inital',
            width: '100%'
          }}
        >
          <nav
            className="layout-navbar container-xxl navbar navbar-expand-xl navbar-detached align-items-center bg-navbar-theme"
            id="layout-navbar"
            style={style}
          >
            <NavToggler>
              <span href="/" className="nav-item nav-link px-0 me-xl-4">
                <i className="bx bx-menu bx-sm"></i>
              </span>
            </NavToggler>

            <div
              className="navbar-nav-right align-items-center row"
              id="navbar-collapse"
            >
              <div className="navbar-nav align-items-center col-10">
                <div className="nav-item d-flex align-items-center s-100w-p">
                  <>
                    <i className="bx bx-search fs-4 lh-0"></i>
                    <input
                      type="text"
                      className={'form-control border-1 shadow-none'}
                      placeholder="Search signal"
                      aria-label="Search..."
                      value={inputValue}
                      onChange={handleInputChange}
                    />
                  </>
                </div>
              </div>
              <ul className="navbar-nav flex-row align-items-center col-2">
                <li className="nav-item navbar-dropdown dropdown-user dropdown">
                  <Link
                    className="nav-link dropdown-toggle hide-arrow"
                    to="/"
                    data-bs-toggle="dropdown"
                  >
                    <div className="avatar avatar-online">
                      <img
                        src={avatar}
                        alt="Avatar"
                        className="w-px-40 h-auto rounded-circle"
                      />
                    </div>
                  </Link>
                  <ul className="dropdown-menu dropdown-menu-end">
                    <li>
                      <Link className="dropdown-item" to="/setting">
                        <div className="d-flex">
                          <div className="flex-shrink-0 me-3">
                            <div className="avatar avatar-online">
                              <img
                                src={avatar}
                                alt="Avatar"
                                className="w-px-40 h-auto rounded-circle"
                              />
                            </div>
                          </div>
                          <div className="flex-grow-1">
                            <span className="fw-semibold d-block">
                              {details?.firstname}&nbsp;{details?.lastname}
                              <div>
                                <small className="text-muted">
                                  User Id: <b>{details?.uid}</b>
                                </small>
                              </div>
                            </span>
                          </div>
                        </div>
                        <div className="fw-bold text-center text-blue font-xl mt-2">
                          {myPackage?.name}
                        </div>
                      </Link>
                    </li>
                    <li>
                      <div className="dropdown-divider"></div>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/license">
                        <i className="fas fa-rocket me-2"></i>
                        <span className="align-middle">License</span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="dropdown-item"
                        to="/setting?tab=preferences"
                      >
                        <i className="bx bx-cog me-2"></i>
                        <span className="align-middle">Settings</span>
                      </Link>
                    </li>
                    {/* <li>
                      <Link className="dropdown-item" to="/">
                        <span className="d-flex align-items-center align-middle">
                          <i className="flex-shrink-0 bx bx-credit-card me-2"></i>
                          <span className="flex-grow-1 align-middle">
                            Billing
                          </span>
                          <span className="flex-shrink-0 badge badge-center rounded-pill bg-danger w-px-20 h-px-20">
                            4
                          </span>
                        </span>
                      </Link>
                    </li> */}
                    <li>
                      <div className="dropdown-divider"></div>
                    </li>
                    <li>
                      <div className="dropdown-item">
                        <LogOut />
                      </div>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </nav>
          {display
            ? (
            <div
              style={{
                ...style,
                backgroundColor: 'black',
                color: 'white',
                margin: '15px',
                borderRadius: '20px',
                boxShadow: '0px 0px 15px 0px',
                transition: 'all 50ms cubic-bezier(0, 0, 0.2, 1) 10ms',
                zIndex: '12321'
              }}
            >
              <Button
                size="sm"
                variant="warning"
                onClick={hideTradeView}
                style={{
                  position: 'absolute',
                  right: '0px',
                  margin: '10px',
                  marginTop: '-10px',
                  zIndex: '100000'
                }}
                className="utilityLink rounded"
              >
                <i className="fa fa-times" aria-hidden="true"></i>
              </Button>
              <TradeView className="gain-header" search={search} />
            </div>
              )
            : null}
        </div>
      )}
    </ThemeConsumer>
  )
}

export default Header
