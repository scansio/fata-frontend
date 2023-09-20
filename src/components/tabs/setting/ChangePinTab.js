/* eslint-disable react/prop-types */
/* eslint-disable require-jsdoc */
import React, { useState } from 'react'
import { toast } from 'react-toastify'
import {
  CHANGE_PIN,
  SEND_OTP,
  USER_DETAIL
} from '../../../scripts/config/RestEndpoints'
import fetcher from '../../../scripts/SharedFetcher'
import { Button, Col, Row } from 'react-bootstrap'
import Spinner from '../../general/Spinner'

function ChangePinTab ({ style, className }) {
  const [submitting, setSubmitting] = useState(false)

  const [otp, setOtp] = useState('')
  const [pin, setPin] = useState('')
  const [confirmPin, setComfirmPin] = useState('')
  const [sent, setSent] = useState(false)
  const [resend, setResend] = useState(false)
  const [email, setEmail] = useState('')

  useState(() => {
    fetcher.fetch(USER_DETAIL).then((data) => {
      setEmail(data?.data?.user?.email)
    })
  }, [])

  async function updateChangePin (e) {
    setSubmitting(true)
    e.preventDefault()
    if (pin !== confirmPin) {
      toast.error('Confirm pin mismatch')
      setSubmitting(false)
      return
    }
    const gdFetchOption = {
      url: CHANGE_PIN,
      method: 'POST',
      data: {
        pin,
        otp
      }
    }
    fetcher
      .fetch(gdFetchOption)
      .then((data) => {
        if (data) {
          if (!data?.data?.status) {
            toast.error(data?.data?.message)
          } else {
            toast.success(data.data.message)
          }
          setSubmitting(false)
        }
      })
      .catch((er) => {
        toast.error(er.message)
        setSubmitting(false)
      })
  }

  async function resendOtp (e) {
    e.preventDefault()
    setResend(true)
    const sendVerificationMail = await fetcher.fetch(SEND_OTP + email)
    if (sendVerificationMail?.data.status) {
      setTimeout(() => setResend(false), 1000 * 2)
      toast.success(sendVerificationMail.data.message)
      setSent(true)
    } else {
      toast.error(sendVerificationMail?.data.message)
      setResend(false)
    }
  }

  return (
    <form onSubmit={updateChangePin}>
      <div className={(className || '') + ''} style={style || {}}>
        <div className="card">
          <div className="card-body">
            <div className="row mt-2">
              <div className="col-md-6 px-1">
                <div className="form-group">
                  <label>OTP</label>
                  <input
                    type="password"
                    required
                    className="form-control"
                    placeholder="OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                  <Spinner loading={resend}>
                    <button
                      onClick={resendOtp}
                      className="btn btn-link"
                      disabled={resend || !email}
                    >
                      {sent ? 'Resend OTP' : 'Send OTP'}
                    </button>
                  </Spinner>
                </div>
              </div>

              <div className="col-md-6 px-1">
                <div className="form-group">
                  <label>New Pin</label>
                  <input
                    type="password"
                    required
                    className="form-control"
                    placeholder="New Pin"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                  />
                </div>
              </div>

              <div className="col-md-6 px-1">
                <div className="form-group">
                  <label>Comfirm Pin</label>
                  <input
                    type="password"
                    required
                    className="form-control"
                    placeholder="Confirm Pin"
                    value={confirmPin}
                    onChange={(e) => setComfirmPin(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <Row>
              <Col xs="12" sm="4" md="4" lg="4" className="p-1 pull-right">
                <Spinner loading={submitting} loadingText={`${'Updating'}`}>
                  <Button size="md" type="submit" className="fw-bold">
                    Update
                  </Button>
                </Spinner>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    </form>
  )
}

export default ChangePinTab
