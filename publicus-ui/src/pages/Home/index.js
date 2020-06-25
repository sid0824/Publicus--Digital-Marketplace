import React from 'react';
import {Icon} from "antd";
import {Link} from "react-router-dom";
import RoutePaths from "../../core/RoutePaths";
import {withAuthContext} from "../../AuthContext";

const getAuthorisedText = () => (
  <React.Fragment>
    <br />
    Begin by <Link to={RoutePaths.CreateForm}>creating a form</Link>
    <br />
    Or <Link to={RoutePaths.Marketplace}>visiting the marketplace</Link>
  </React.Fragment>
);

const getUnauthorisedText = () => (
  <React.Fragment>
    <br />
    <Link to={RoutePaths.CreateAccount}>Create an account</Link> or <Link to={RoutePaths.Login}>login</Link> to begin
  </React.Fragment>
);

/**
 * Home page of the site
 */
export class Home extends React.Component {
  render() {
    const { authenticated } = this.props;
    return (
      <div style={{  margin: 'auto', width: '100%', height: '100%', alignItems: 'center', display: 'flex', flexDirection: 'row', justifyContent: 'center', paddingBottom: 200 }}>

        <div style={{ marginRight: 50 }}>
          <Icon type="yuque" style={{ color: '#1890ff', fontSize: 200, marginTop: 15 }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center' }}>
          <div style={{ fontSize: 60, }}>
            Welcome to Publicus!
          </div>
          <div style={{ fontSize: 20, }}>
            An online tool for creating and publishing forms
            {authenticated ? getAuthorisedText() : getUnauthorisedText()}
          </div>
        </div>
      </div>
    )
  }
}

export default withAuthContext(Home);