import React, { useEffect, useState } from 'react'
import Main from '../layout/Main'
import { Container } from 'react-bootstrap'
import SharedConfig from '../scripts/SharedConfig'
import Spinner from '../components/paginating/Spinner'

function PrivacyPolicy (props) {
  const [policy, setPolicy] = useState('')

  useEffect(() => {
    setTimeout(
      () => setPolicy(SharedConfig.getSessionData('PRIVACY_POLICY')),
      500
    )
  }, [])

  return (
    <>
      <Main {...props} noHeader noFooter>
        <Container fluid>
          <Spinner loading={!policy} loadingText="Loading Privacy Policy">
            <div
              dangerouslySetInnerHTML={{
                __html: policy
              }}
            ></div>
          </Spinner>
        </Container>
      </Main>
    </>
  )
}

export default PrivacyPolicy
