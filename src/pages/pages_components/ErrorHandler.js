/* eslint-disable react/prop-types */
import { Link } from 'react-router-dom'
import imgLight from '../../assets/img/illustrations/page-misc-error-light.png'
import React, { Component } from 'react'
import { Container } from 'react-bootstrap'

export default class ErrorHandler extends Component {
  constructor (props) {
    super(props)
    this.state = { hasError: false, error: 'An error just occured' }
  }

  static getDerivedStateFromError (_error) {
    return { hasError: true }
  }

  componentDidCatch (error, _errorInfo) {
    this.setState({ hasError: true, error: error.message })
  }

  render () {
    return this.state.hasError
      ? (
      <>
        <Container fluid>
          <div className="misc-wrapper">
            <h2 className="mb-2 mx-2">An Error has Occured</h2>
            <p className="mb-4 mx-2">{this.state.error}</p>
            <Link to="/" className="btn btn-primary">
              Back to home
            </Link>
            <div className="mt-3">
              <img
                src={imgLight}
                alt="Error"
                width="500"
                className="img-fluid"
                data-app-dark-img={imgLight}
                data-app-light-img={imgLight}
              />
            </div>
          </div>
        </Container>
      </>
        )
      : (
          this.props.children
        )
  }
}
