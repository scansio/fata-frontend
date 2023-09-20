import React, { useEffect, useState } from 'react'
import Main from '../layout/Main'
import { Container } from 'react-bootstrap'
import SharedConfig from '../scripts/SharedConfig'

function AboutUs (props) {
  const [about, setAbout] = useState('')

  useEffect(() => {
    setTimeout(
      () => setAbout(SharedConfig.getSessionData('ABOUT_US')),
      500
    )
  }, [])

  return (
    <>
      <Main {...props} noHeader noFooter>
        <Container fluid>
          <div
            dangerouslySetInnerHTML={{
              __html: about
            }}
          ></div>
        </Container>
      </Main>
    </>
  )
}

export default AboutUs
