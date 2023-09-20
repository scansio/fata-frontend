/* eslint-disable react/prop-types */
/* eslint-disable require-jsdoc */
import React, { useState } from 'react'
import { toast } from 'react-toastify'
import { CHANGE_PASSWORD } from '../../../scripts/config/RestEndpoints'
import fetcher from '../../../scripts/SharedFetcher'
import { Button, Col, Row } from 'react-bootstrap'
import Spinner from '../../general/Spinner'
import SharedConfig from '../../../scripts/SharedConfig'
import { UID } from '../../../scripts/config/contants'

function ChangePasswordTab ({ style, className }) {
  const [submitting, setSubmitting] = useState(false)

  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirm, setConfirm] = useState('')

  async function updateChangePassword (e) {
    setSubmitting(true)
    e.preventDefault()
    if (newPassword !== confirm) {
      toast.error('Password Mismatch')
      setSubmitting(false)
      return
    }
    const gdFetchOption = {
      url: CHANGE_PASSWORD,
      method: 'POST',
      data: {
        uid: SharedConfig.getLocalData(UID),
        newPassword,
        oldPassword
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

  return (
    <form onSubmit={updateChangePassword}>
      <div className={(className || '') + ''} style={style || {}}>
        <div className="card">
          <div className="card-body">
            <div className="row mt-2">
              <div className="col-md-6 px-1">
                <div className="form-group">
                  <label>Old Password</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Old Password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-md-6 px-1">
                <div className="form-group">
                  <label>New Password</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-md-6 px-1">
                <div className="form-group">
                  <label>Confirm New Password</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Comfirm new Password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
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

export default ChangePasswordTab
