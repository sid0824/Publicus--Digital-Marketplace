import React from 'react';
import {Redirect} from "react-router-dom";
import RoutePaths from "../core/RoutePaths";

// The component used to redirect to the home page when a url was given that does not match
// any existing page
export default () => (
  <Redirect
    to={RoutePaths.Home}
  />
)