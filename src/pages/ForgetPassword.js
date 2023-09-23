/* eslint-disable react/prop-types */
/* eslint-disable require-jsdoc */
import React, { useState } from 'react'
import { Button, Card, Container } from 'react-bootstrap'
import { ToastContainer, toast } from 'react-toastify'
import {
  SEND_FORGET_PASSWORD_VERIFICATION,
  VERIFY_FORGET_PASSWORD_MAIL
} from '../scripts/config/RestEndpoints'
import fetcher from '../scripts/SharedFetcher'
import Spinner from '../components/general/Spinner'
import { Link, Navigate, useLocation } from 'react-router-dom'
import SharedConfig from '../scripts/SharedConfig'

function ForgetPassword (props) {
  const location = useLocation()
  const search = new URLSearchParams(location.search)

  const vemail = search?.get('vemail') || ''
  const vcode = search?.get('vcode') || ''
  const [email, setEmail] = useState(vemail)
  const [code, setCode] = useState(vcode)
  const [password, setPassword] = useState('')
  const [sent, setSent] = useState(false)
  const [resend, setResend] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [verified, setVerified] = useState(false)

  async function verifyCode (e) {
    e.preventDefault()
    setVerifying(true)
    const postData = {
      url: VERIFY_FORGET_PASSWORD_MAIL,
      data: { email, code, newPassword: password }
    }
    fetcher
      .fetch(postData)
      .then((verify) => {
        if (verify?.data.status) {
          toast.success(verify.data.message)
          setTimeout(() => { setVerified(true); setVerifying(false) }, 1000 * 5)
        } else {
          toast.error(verify?.data.message)
          setVerifying(false)
        }
      })
      .catch((error) => {
        toast.error(error.message)
        setVerifying(false)
      })
  }

  async function resendVerificationCode (e) {
    e.preventDefault()
    setResend(true)
    const sendVerificationMail = await fetcher.fetch(
      SEND_FORGET_PASSWORD_VERIFICATION + email
    )
    if (sendVerificationMail?.data.status) {
      setTimeout(() => setResend(false), 1000 * 2)
      toast.success(sendVerificationMail.data.message)
      setSent(true)
    } else {
      toast.error(sendVerificationMail?.data.message)
      setResend(false)
    }
  }

  return verified
    ? (
    <Navigate to="/home" />
      )
    : (
    <>
      <ToastContainer
        newestOnTop={true}
        toastStyle={{ borderRadius: 20, padding: 5 }}
      />
      <div className="authentication-wrapper authentication-basic container-p-y">
        <div className="authentication-inner">
          <div className="text-center my-3">
            <Link to='../'>
              <img
                src="../favicon.ico"
                height="100"
                width="100"
                alt={SharedConfig.getSessionData('SITE_TITLE')}
              />
            </Link>
          </div>
          <Container>
            <div className="text-center">
              <Button variant="outline-primary mb-3 text-center">
                <Link to="/login" className="">
                  Login
                </Link>
              </Button>
            </div>
            <Card>
              <Card.Title className="text-center p-2 mt-2">
                Forget Password
              </Card.Title>
              <Card.Body>
                <form
                  id="formAuthentication"
                  className="mb-3"
                  onSubmit={(e) => verifyCode(e)}
                >
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      Email
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="email"
                      name="email"
                      placeholder="Email address"
                      autoFocus={true}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <div className="mb-2">
                      <button
                        onClick={(e) => {
                          resendVerificationCode(e)
                        }}
                        className="btn btn-link"
                        disabled={resend}
                      >
                        <Spinner
                          loading={resend}
                          loadingText="Resending"
                          text={sent ? 'Resend Code' : 'Send Code'}
                        />
                      </button>
                    </div>
                  </div>
                  <div className="mb-3 form-password-toggle">
                    <div className="d-flex justify-content-between ">
                      <label className="form-label" htmlFor="code">
                        Confirmation Code
                      </label>
                    </div>
                    <div className="input-group input-group-merge">
                      <input
                        type={'text'}
                        id="code"
                        className="form-control"
                        name="code"
                        placeholder="Code"
                        aria-describedby="Code"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="mb-3 form-password-toggle">
                    <div className="d-flex justify-content-between ">
                      <label className="form-label" htmlFor="password">
                        New Password
                      </label>
                    </div>
                    <div className="input-group input-group-merge">
                      <input
                        type={'password'}
                        id="password"
                        className="form-control"
                        name="password"
                        placeholder="Password"
                        aria-describedby="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <button
                      className="btn btn-primary d-grid w-100"
                      type="submit"
                      disabled={verifying}
                    >
                      <Spinner
                        loading={verifying}
                        loadingText="Verifying"
                        text="Verify"
                      />
                    </button>
                  </div>
                </form>
              </Card.Body>
            </Card>
          </Container>
        </div>
      </div>
    </>
      )
}

export default ForgetPassword
