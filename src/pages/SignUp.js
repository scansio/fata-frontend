/* eslint-disable require-jsdoc */
import { Link, Navigate, useLocation } from 'react-router-dom'
import React, { useState } from 'react'
import { Card, Col, Container, Row, Spinner } from 'react-bootstrap'
import { ToastContainer, toast } from 'react-toastify'
import fetcher from '../scripts/SharedFetcher'
import { USER_BASE } from '../scripts/config/RestEndpoints'
import SharedConfig from '../scripts/SharedConfig'

function SignUp () {
  const location = useLocation()
  const [ref, setRef] = useState(
    new URLSearchParams(location.search)?.get('ref')
  )

  const [showPassword, setShowing] = useState(false)
  const [created, setCreated] = useState(false)
  const [loading, setLoading] = useState(false)

  function togglePassword (e) {
    setShowing(!showPassword)
  }

  async function signUp (e) {
    setLoading(true)
    e.preventDefault()
    const formData = new FormData(e.target)
    if (formData.get('password') !== formData.get('comfirm_password')) {
      toast.error('Password Mismatch')
      return
    }
    const option = {
      url: USER_BASE,
      data: {
        email: formData.get('email'),
        firstname: formData.get('firstname'),
        lastname: formData.get('lastname'),
        password: formData.get('password'),
        refID: ref
      }
    }
    let returns
    try {
      returns = await fetcher.fetch(option)
    } catch (error) {
      toast.error(error.message)
      return
    }
    if (!returns?.data?.status) {
      toast.error(returns?.data?.message || 'Error')
    } else {
      toast.success(returns.data.message)
      toast.success('Please login to finish up ....')
      setTimeout(() => setCreated(true), 1000 * 5)
      SharedConfig.destroyAll()
    }
    setLoading(false)
  }

  return created
    ? (
    <Navigate to="/login" />
      )
    : (
    <>
      <Container>
        <ToastContainer
          newestOnTop={true}
          toastStyle={{ borderRadius: 20, paddding: 5 }}
        />
        <Row>
          <Col sm="12" md={{ span: 6, offset: 3 }} lg={{ span: 6, offset: 3 }}>
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
                    <form
                      id="formAuthentication"
                      className="mb-3"
                      onSubmit={(e) => signUp(e)}
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
                        />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="firstname" className="form-label">
                          First Name
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="firstname"
                          name="firstname"
                          placeholder="Given name"
                        />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="lastname" className="form-label">
                          Last Name
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="lastname"
                          name="lastname"
                          placeholder="Your family name"
                        />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="ref" className="form-label">
                          Referral Id
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          id="referral"
                          name="referral"
                          placeholder="Your Referral Id (Optional)"
                          value={typeof ref !== 'number' ? parseInt(ref) : ref}
                          onChange={(e) => setRef(e.target.value)}
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
                            id="password"
                            className="form-control"
                            name="password"
                            placeholder="&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;"
                            aria-describedby="password"
                          />
                          <span className="input-group-text cursor-pointer">
                            <i
                              className={`bx bx-${
                                showPassword ? 'show' : 'hide'
                              }`}
                              onClick={togglePassword}
                            ></i>
                          </span>
                        </div>
                      </div>
                      <div className="mb-3 form-password-toggle">
                        <div className="d-flex justify-content-between">
                          <label
                            className="form-label"
                            htmlFor="comfirm_password"
                          >
                            Comfirm Password
                          </label>
                        </div>
                        <div className="input-group input-group-merge password">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            className="form-control"
                            name="comfirm_password"
                            id="comfirm_password"
                            placeholder="&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;"
                            aria-describedby="password"
                          />
                          <span className="input-group-text cursor-pointer">
                            <i
                              className={`bx bx-${
                                showPassword ? 'show' : 'hide'
                              }`}
                              onClick={togglePassword}
                            ></i>
                          </span>
                        </div>
                      </div>
                      <div className="mb-3">
                        {loading
                          ? (
                          <Spinner />
                            )
                          : (
                          <button
                            className="btn btn-primary d-grid w-100"
                            type="submit"
                          >
                            Sign Up
                          </button>
                            )}
                      </div>
                    </form>

                    <p className="text-center">
                      <span>Alreaady Had An Account </span>
                      <Link to="/login">
                        <span>Login</span>
                      </Link>
                    </p>
                  </Card.Body>
                </Card>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </>
      )
}

export default SignUp
