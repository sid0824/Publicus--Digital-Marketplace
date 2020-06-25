import React from "react";
import LandingPage from './components/landingpage';
import PreRegister from "./components/preregister";
import StatsPage from "./components/statspage";
import { Switch, Route } from 'react-router-dom';


const NoMatchPage = () => {
  return (
    <h3>404 - Not found</h3>
  );
};

export default () => (
  <Switch>
    <Route exact path="/" component={LandingPage} />
    <Route exact path="/home" component={LandingPage} />
    <Route exact path="/home/preregister" component={PreRegister} />
    <Route exact path="/home/stats" component={StatsPage} />
    <Route component={NoMatchPage} />
  </Switch>
);

