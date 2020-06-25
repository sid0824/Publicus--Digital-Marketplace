import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Home from "../pages/Home";
import RoutePaths from "./RoutePaths";
import HomeRedirect from "../components/HomeRedirect";
import CreateAccount from "../pages/CreateAccount";
import CreateForm from "../pages/CreateForm";
import Login from "../pages/Login";
import MyForms from "../pages/MyForms";
import Marketplace from "../pages/Marketplace";
import AuthenticatedRoute from "../components/AuthenticatedRoute";
import ViewResults from "../pages/ViewResults";
import CompleteForm from "../pages/CompleteForm";
import MyAccount from "../pages/MyAccount";
import Administration from "../pages/Administration";
import AdministrationRoute from "../components/AdministrationRoute";

// All pages in the site require a Route to be rendered. Pages that require an account to view use the AuthenticatedRoute
// component
export default () =>
  <Switch>
    <Route path={RoutePaths.Home} exact component={Home} />
    <Route path={RoutePaths.CreateAccount} exact component={CreateAccount} />
    <Route path={RoutePaths.Login} exact component={Login} />
    <Route path={RoutePaths.CompleteForm} exact component={CompleteForm} />
    <AuthenticatedRoute path={RoutePaths.CreateForm} exact component={CreateForm} />
    <AuthenticatedRoute path={RoutePaths.MyForms} exact component={MyForms} />
    <AuthenticatedRoute path={RoutePaths.Marketplace} exact component={Marketplace} />
    <AuthenticatedRoute path={RoutePaths.ViewResults} exact component={ViewResults} />
    <AuthenticatedRoute path={RoutePaths.MyAccount} exact component={MyAccount} />
    <AdministrationRoute path={RoutePaths.Administration} exact component={Administration} />
    <Route component={HomeRedirect} />
  </Switch>