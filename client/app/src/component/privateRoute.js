import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import logic from '../logic'

export const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={props => (

    logic.localStorageGetItem("token")
      ? <Component {...props} />
      : <Redirect to={'/'} />
  )} />
)

