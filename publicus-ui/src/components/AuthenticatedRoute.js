import React from "react";
import { Route, Redirect } from "react-router-dom";
import {withAuthContext} from "../AuthContext";
import { message } from 'antd';

// Renders the redirect components that redirects to the supplied path
const redirect = (path) => {
  message.warning('Login With an Account To Access this Page');
  return <Redirect
    to={path} // TODO - make dynamic based on url parameters
  />
};

// Used to redirect the user away from pages that require an account. Redirects to the login page with a warning message
export const AuthenticatedRoute = ({ component: Component, authenticated, setUserHasAuthenticated, ...rest }) =>
  <Route
    {...rest}
    render={props =>
      authenticated
        ? <Component {...props} />
        : redirect(`/login`)
    }
  />;

export default withAuthContext(AuthenticatedRoute)
