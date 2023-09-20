import React, { useEffect, useState } from 'react'
import Main from '../layout/Main'
import { Container } from 'react-bootstrap'
import SharedConfig from '../scripts/SharedConfig'
import Spinner from '../components/paginating/Spinner'

function TermsAndConditions (props) {
  const [terms, setTerms] = useState('')

  useEffect(() => {
    setTimeout(
      () => setTerms(SharedConfig.getSessionData('TERMS_AND_CONDITIONS') || 'Terms and Conditions not released yet please check back tomorrow'),
      500
    )
  }, [])

  return (
    <>
      <Main {...props} noHeader noFooter>
        <Container fluid>
          <Spinner loading={!terms} loadingText="Loading Terms and Conditions">
            <div
              dangerouslySetInnerHTML={{
                __html: terms
              }}
            ></div>
          </Spinner>
        </Container>
      </Main>
    </>
  )
}

export default TermsAndConditions
