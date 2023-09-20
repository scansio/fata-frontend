/* eslint-disable require-jsdoc */
import React from 'react'
import { Route } from 'react-router-dom'
import routes from './config/routes.json'
import Authenticate from '../pages/pages_components/Authenticate'
import PageHandler from '../pages/pages_components/PageHandler'

class Routing {
  constructor () {
    this.__getRoutes = (type) => {
      switch (type) {
        case this.SECURE:
          type = 'secure'
          break

        case this.INSECURE:
        default:
          type = 'insecure'
          break
      }
      this.routers = routes[type]
      this.routeComponents = this.routers.map((prop) => {
        let Component
        try {
          Component = require(`../pages/${prop.component}`).default
        } catch (error) {
          console.log(error)
        }

        return !Component
          ? null
          : (
          <Route
            path={prop.path}
            Component={(cprops) =>
              type === 'insecure'
                ? (
                <PageHandler Component={Component} {...cprops} />
                  )
                : (
                <PageHandler Component={Authenticate} AuthPage={Component} {...cprops} />
                  )
            }
            key={prop.path}
          />
            )
      })
      return this.routeComponents
    }
  }

  INSECURE = 0
  SECURE = 1

  getSecuredRoutes () {
    return this.__getRoutes(this.SECURE)
  }

  getInSecuredRoutes () {
    return this.__getRoutes(this.INSECURE)
  }
}

export default Routing
