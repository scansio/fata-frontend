/* eslint-disable require-jsdoc */
import { Link } from 'react-router-dom'
import imgLight from '../assets/img/illustrations/page-misc-error-light.png'
import React from 'react'
import { Container } from 'react-bootstrap'

export default function ComingSoon (props) {
  return (
    <>
      <Container fluid>
        <div className='misc-wrapper'>
          <h2 className='mb-2 mx-2'>Coming Soon</h2>
          <Link to='/' className='btn btn-primary'>
            Back to home
          </Link>
          <div className='mt-3'>
            <img
              src={imgLight}
              alt='Error'
              width='500'
              className='img-fluid'
              data-app-dark-img={imgLight}
              data-app-light-img={imgLight}
            />
          </div>
        </div>
      </Container>
    </>
  )
}
