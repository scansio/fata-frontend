/* eslint-disable react/prop-types */
import React from 'react'
import { ThemeConsumer } from '../../components/context/theme'

function ThemeToggler (props) {
  const scrollUp = () => (document.documentElement.scrollTop = 0)

  return (
    <ThemeConsumer>
      {(style) => (
        <div
          className="list-group"
          style={{ position: 'fixed', right: '20px', bottom: '65px' }}
        >
          <span
            title="Refresh"
            className="list-item"
            style={{ color: style.color, cursor: 'pointer' }}
            onClick={props.refresh}
          >
            <i className="font-lg bx bx-rotate-right bx-sm align-middle" />
          </span>
          <span
            title="Scroll to top"
            className="list-item"
            style={{ color: style.color, cursor: 'pointer' }}
            onClick={scrollUp}
          >
            <i className="font-lg bx bx-chevron-up-circle bx-sm align-middle" />
          </span>
          <span
            className="list-item py-1"
            style={{ color: style.color, cursor: 'pointer' }}
            onClick={props.toggleTheme}
          >
            <i className="bx bx-moon bx-sm align-middle" />
          </span>
        </div>
      )}
    </ThemeConsumer>
  )
}

export default ThemeToggler
