/* eslint-disable multiline-ternary */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react'
import fetcher from '../../scripts/SharedFetcher'
import { PUBLIC_OPTIONS } from '../../scripts/config/RestEndpoints'
import SharedConfig from '../../scripts/SharedConfig'
import { SITE_TITLE } from '../../scripts/config/contants'
import Refresh from '../Refresh'
import ErrorHandler from './ErrorHandler'
import { getCurrentUrl } from '../../scripts/misc'
import { Spinner } from 'react-bootstrap'

const PageHandler = (props) => {
  const [toRefresh, setToRefresh] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  const r = SharedConfig.getSessionData('refresh')

  const Component = props.Component

  const componentProps = {
    ...props,
    Component: undefined,
    refresh
  }

  useEffect(() => {
    fetcher.fetch(PUBLIC_OPTIONS).then((res) => {
      if (res?.data?.options) {
        for (const option of res?.data?.options) {
          SharedConfig.setSessionData(option.name, option.value)
        }
        document.title =
          (SharedConfig.getSessionData('SITE_TITLE') || SITE_TITLE) +
          (SharedConfig.getSessionData('SITE_TAGLINE')
            ? ` - ${SharedConfig.getSessionData('SITE_TAGLINE')}`
            : '')

        if (SharedConfig.getSessionData('SITE_DESCRIPTION')) {
          const metaDescription = document.createElement('meta')
          metaDescription.name = 'description'
          metaDescription.content =
            SharedConfig.getSessionData('SITE_DESCRIPTION')

          const charsetMeta = document.querySelector('meta[charset="utf-8"]')
          if (charsetMeta) {
            charsetMeta.insertAdjacentElement('afterend', metaDescription)
          }
        }
      }
    })
  }, [])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress)
    return () => {
      window.removeEventListener('keydown', handleKeyPress)
    }
  }, [])

  function refresh (time = 1000) {
    setRefreshing(true)
    setTimeout(() => {
      SharedConfig.setSessionData('refresh', true)
      setToRefresh(true)
      setRefreshing(false)
    }, time)
  }

  function handleKeyPress (event) {
    if (event.key === 'F5') {
      event.preventDefault() // Prevent the default F5 behavior
      refresh()
    }
  }

  useEffect(() => {
    if (toRefresh) {
      SharedConfig.removeSessionData('refresh')
      setToRefresh(false)
    }
  }, [toRefresh])

  return toRefresh && r ? (
    <Refresh page={getCurrentUrl()} />
  ) : (
    <>
      {refreshing ? (
        <Spinner
          variant="warning"
          size="sm"
          style={{
            margin: '5px',
            position: 'fixed',
            top: '0',
            right: '0'
          }}
        ></Spinner>
      ) : null}
      <ErrorHandler>
        <Component {...componentProps} />
      </ErrorHandler>
    </>
  )
}

export default PageHandler
