/* eslint-disable react/prop-types */
/* eslint-disable no-new */
import React, { useRef, useState } from 'react'
import Footer from '../layout/Footer'
import Header from '../layout/Header'
import Sidebar from '../layout/Sidebar'
import NavToggler from './layout_components/NavToggler'
import ThemeToggler from './layout_components/ThemeToggler'
import Cookie from '../scripts/Cookie'
import { ProvideTheme, theme } from '../components/context/theme'
import { ToastContainer } from 'react-toastify'

function Main (props) {
  let activeTheme = Cookie.has('theme')
  if (!activeTheme) {
    new Cookie('theme', 'light')
    activeTheme = 'light'
  }
  const [style, setStyle] = useState(theme[activeTheme])
  const mainPanel = useRef()

  const toggleTheme = () => {
    activeTheme =
      activeTheme === 'dark'
        ? 'light'
        : activeTheme === 'light'
          ? 'dark'
          : 'light'
    setStyle(theme[activeTheme])
    Cookie.replace('theme', activeTheme)
  }

  return (
    <ProvideTheme style={style}>
      <div
        className="layout-wrapper layout-content-navbar"
        style={{ backgroundColor: style.backgroundColor }}
      >
        <div className="layout-container">
          <Sidebar />
          <div className="layout-page" ref={mainPanel}>
            {props.noHeader ? null : <Header />}
            <div className="content-wrapper">
              <div className="container-xxl flex-grow-1 container-p-y mb-5">
                <ToastContainer
                  newestOnTop={true}
                  toastStyle={{ borderRadius: 20, paddding: 5 }}
                />
                {props.children}
              </div>
              {props.noFooter
                ? null
                : (
                <Footer>
                  <ThemeToggler
                    {...props}
                    toggleTheme={() => {
                      toggleTheme()
                    }}
                  />
                </Footer>
                  )}
              <div className="content-backdrop fade"></div>
            </div>
          </div>
        </div>
        <NavToggler>
          <div className="layout-overlay layout-menu-toggle"></div>
        </NavToggler>
      </div>
    </ProvideTheme>
  )
}

export default Main
