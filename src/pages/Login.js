/* eslint-disable react/prop-types */
/* eslint-disable require-jsdoc */
import { Link } from 'react-router-dom'
import React, { useState } from 'react'
import { Card } from 'react-bootstrap'
import { ToastContainer, toast } from 'react-toastify'
import RestCode from '../scripts/config/RestApiConstants.json'
import ModalBox from '../components/general/Modal'
import SendVerificationLink from './pages_components/SendVerificationLink'
import Spinner from '../components/general/Spinner'
import SharedConfig from '../scripts/SharedConfig'

function Login ({ setActive = () => {}, authenticate = () => {} }) {
  const [showPassword, setShowing] = useState(false)
  const [logging, setLogging] = useState(false)

  const [unverified, setUnverified] = useState(false)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  function togglePassword (e) {
    setShowing((previous) => !previous)
  }

  async function login (e) {
    setLogging(true)
    e.preventDefault()
    const data = {
      email,
      password
    }
    let returns
    try {
      returns = await authenticate(data.email, data.password)
    } catch (error) {
      toast.error(error.message)
      setLogging(false)
      return
    }
    if (!returns?.status) {
      toast.error(returns?.message || 'Error')
      if (returns?.code === RestCode.EMAIL_UNV.code) {
        /*  const sendVerificationMail = await fetcher.fetch(
          SEND_VERIFICATION + data.email
        );
        if (sendVerificationMail?.data.status) {
          toast.success(sendVerificationMail.data.message);
        } else {
          toast.error(sendVerificationMail?.data.message);
        } */
        setUnverified(true)
      }
    } else {
      setActive(true)
    }
    setLogging(false)
  }

  return (
    <>
      <ModalBox
        show={unverified}
        onAccept={() => setUnverified(false)}
        noControl
        noHeader
        backdrop
      >
        <SendVerificationLink email={email} setShowModal={setUnverified} />
      </ModalBox>
      <ToastContainer
        newestOnTop={true}
        toastStyle={{ borderRadius: 20, paddding: 5 }}
      />
      <div className="authentication-wrapper authentication-basic container-p-y">
        <div className="authentication-inner">
          <div className="text-center my-3">
            <img
              src="../favicon.ico"
              height="100"
              width="100"
              alt={SharedConfig.getSessionData('SITE_TITLE')}
            />
          </div>
          <Card>
            <Card.Body>
              <form className="mb-3" onSubmit={login}>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3 form-password-toggle">
                  <div className="d-flex justify-content-between">
                    <label className="form-label" htmlFor="password">
                      Password
                    </label>
                  </div>
                  <div className="input-group input-group-merge">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="form-control"
                      placeholder="&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <span className="input-group-text cursor-pointer">
                      <i
                        className={`bx bx-${showPassword ? 'show' : 'hide'}`}
                        onClick={(e) => {
                          togglePassword(e)
                        }}
                      ></i>
                    </span>
                  </div>
                </div>
                <div className="mb-3">
                  <button
                    className="btn btn-primary d-grid w-100"
                    type="submit"
                    disabled={logging}
                  >
                    <Spinner
                      loading={logging}
                      loadingText="Logging in ..."
                      text="Sign in"
                    />
                  </button>
                </div>
                {/*
                <p className="text-bold text-center">OR</p>
                <div className="mt-3">
                  <Link
                    to={"https://google.com"}
                    className="btn btn-primary d-grid w-100"
                  >
                    Google
                  </Link>
                </div> */}
              </form>

              <p className="text-center">
                <span>New on our platform? </span>
                <Link to="/signup">
                  <span>Create an account</span>
                </Link>
                <hr />
                <Link to="/forget-password">
                  <small>Forgot Password?</small>
                </Link>
              </p>
            </Card.Body>
          </Card>
        </div>
      </div>
    </>
  )
}

export default Login
