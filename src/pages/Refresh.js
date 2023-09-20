/* eslint-disable react/prop-types */
/* eslint-disable require-jsdoc */
import React from 'react'
import { Navigate } from 'react-router-dom'

export default function Refresh ({ page = '/home' }) {
  return <Navigate to={page} />
}
