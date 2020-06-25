import 'antd/dist/antd.css';
import React from 'react'
import {Layout, Menu, Icon, message, Button} from 'antd';
import {Link, withRouter} from "react-router-dom";
import RoutePaths from "./core/RoutePaths";
import Routes from "./core/Routes";
import {API, Auth} from "aws-amplify";
import { AuthContext } from './AuthContext';
import {ApiName, StripeKey} from "./core/Config";
import {Elements, StripeProvider} from 'react-stripe-elements';

const { Content, Sider } = Layout;

const content = {
  flexGrow: 1,
  minHeight: 360,
  overflow: 'auto',
};

const styles = {
  root: { flexGrow: 1, zIndex: 1, overflow: 'hidden', position: 'relative', display: 'flex', minHeight: '100vh' },
  titleContainer: { margin: '5px', whiteSpace: 'nowrap', textAlign: 'center', height: '50px', lineHeight: '50px', display: 'flex', flexDirection: 'row', justifyContent: 'center' },
  title: { marginLeft: 10 , color: 'white', fontSize: '15px', fontWeight: 'bold', marginRight: '14px' },
  sider: { height: '100vh', position: 'fixed', left: 0 },
  contentExpanded: { ...content, marginLeft: '200px', height: '100vh' },
  contentRetracted: { ...content, marginLeft: '80px', height: '100vh'  }
};

// Display titles for each site path
const titles = {
  [RoutePaths.Home]: 'Home',
  [RoutePaths.CreateAccount]: 'Create Account',
  [RoutePaths.CreateForm]: 'Create Form',
  [RoutePaths.Login]: 'Login',
  [RoutePaths.MyForms]: 'My Forms',
  [RoutePaths.Marketplace]: 'Marketplace',
  [RoutePaths.CompleteForm]: 'Complete Form',
  [RoutePaths.ViewResults]: 'Results',
  [RoutePaths.MyAccount]: 'My Account',
  [RoutePaths.Administration]: 'Administration',
};

/**
 * Provides navigation bar and authentication logic. Provides authentication values to all children
 * through context
 */
export class App extends React.Component {

  state = {
    adminUser: false,
    collapsed: false, // Is the navigation bar collapsed
    authenticated: false, // Is the current user authenticated
    loading: true,// Is the current user still authenticated,
    userId: ''
  };

  componentDidMount = async () => {
    try {
      this.setState({
        loading: true
      });
      await Auth.currentSession();
      await this.setUserHasAuthenticated(true);
      this.setState({
        loading: false
      });
    } catch (err) {
      console.error(err.message);
      this.setState({
        loading: false
      });
    }
  };

  /**
   * Set the collapsed value of the navigation bar
   * @param collapsed - new value
   */
  collapseSlider = (collapsed) => {
    this.setState({
      collapsed
    })
  };

  /**
   * Signout the current user
   */
  signOut = async () => {
    try {
      await Auth.signOut();
      this.setState({
        authenticated: false,
        adminUser: false
      })
    } catch (err) {
      message.error(err.message);
    }
  };

  /**
   * Set the new value of the user being authenticated
   * @param authenticated - new value
   */
  setUserHasAuthenticated = async (authenticated) => {
    let adminUser = false;
    let userId = '';
    let avatar = '';
    if (authenticated) {
      const userValues = await API.get(ApiName, "/getUserValues", {}); // change to get use values
      adminUser = !!userValues.admin;
      userId = userValues.userId;
      avatar = userValues.avatar;
    }
    this.setState({
      authenticated,
      adminUser,
      userId,
      avatar
    })
  };

  render() {
    const { collapsed, authenticated, loading, adminUser, userId, avatar } = this.state;
    const { location } = this.props;

    const authContext = {
      authenticated,
      setUserHasAuthenticated: this.setUserHasAuthenticated,
      adminUser,
      userId,
      avatar
    };

    const title = titles[location.pathname] || '';

    return (
      <StripeProvider apiKey={StripeKey}>
        <Elements>
          <Layout style={styles.root}>
            <Sider
              collapsed={collapsed}
              collapsible
              onCollapse={this.collapseSlider}
              style={styles.sider}
            >
              <div style={styles.titleContainer}>
                {
                  !collapsed && <div>
                    <Icon type="yuque" style={{ color: 'white', fontSize: 22, marginTop: 15, marginRight: 4 }} />
                  </div>
                }
                <div style={styles.title}>
                  Publicus
                </div>
              </div>
              <Menu
                theme="dark"
                defaultSelectedKeys={[RoutePaths.Home]}
                mode="inline"
                selectedKeys={[location.pathname]}
              >
                <Menu.Item key={RoutePaths.Home}>
                  <Link to={RoutePaths.Home}>
                    <Icon type="home" />
                    <span>
                      Home
                    </span>
                  </Link>
                </Menu.Item>
                <Menu.Item key={RoutePaths.CreateForm}>
                  <Link to={RoutePaths.CreateForm}>
                    <Icon type="form"/>
                    <span>Create Form</span>
                  </Link>
                </Menu.Item>
                <Menu.Item key={RoutePaths.Marketplace}>
                  <Link to={RoutePaths.Marketplace}>
                    <Icon type="pay-circle"/>
                    <span>Marketplace</span>
                  </Link>
                </Menu.Item>
                <Menu.Item key={RoutePaths.MyForms}>
                  <Link to={RoutePaths.MyForms}>
                    <Icon type="align-left"/>
                    <span>View My Forms</span>
                  </Link>
                </Menu.Item>
                  <Menu.Item key={RoutePaths.MyAccount}>
                    <Link to={RoutePaths.MyAccount}>
                      <Icon type="profile" />
                      <span>My Account</span>
                    </Link>
                  </Menu.Item>
                {
                  authenticated && adminUser &&
                    <Menu.Item key={RoutePaths.Administration}>
                      <Link to={RoutePaths.Administration}>
                        <Icon type="build" />
                        <span>Administration</span>
                      </Link>
                    </Menu.Item>
                }
              </Menu>
            </Sider>
            <Content style={collapsed ? styles.contentRetracted : styles.contentExpanded}>
              <div style={{
                backgroundColor: '#6fa6ed', height: '60px', display: 'flex', flexDirection: 'row', justifyContent: 'space-between',
              }}
              >
                <div style={{  height: '100%', marginLeft: '15px' }}>
                  <h1 style={{ lineHeight: '60px', fontSize: 30 }}>
                    {title}
                  </h1>
                </div>
                <div style={{  height: '100%', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginRight: 10 }}>
                  {authenticated
                    ? <Button
                        onClick={this.signOut}
                        style={{ marginRight: 10 }}
                        type={"primary"}
                      >
                        Sign Out
                      </Button>
                    : <div>
                        <Link
                          to={RoutePaths.CreateAccount}
                          style={{ height: '100%', marginRight: 6 }}
                        >
                          <Button
                            style={{ marginRight: 0 }}
                            type={"primary"}
                          >
                            Create Account
                          </Button>
                        </Link>
                        <Link
                          to={RoutePaths.Login}
                          style={{ height: '100%', marginRight: 3 }}
                        >
                          <Button
                            style={{ marginRight: 0 }}
                            type={"primary"}
                          >
                            Login
                          </Button>
                      </Link>
                      </div>
                  }
                </div>
              </div>
              <div style={{ padding: '10px', height: 'calc(100% - 84px)' }}>
                <AuthContext.Provider value={authContext}>
                  {loading ?  <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', paddingTop: 200 }}>
                    <Icon type="loading" style={{ fontSize: 70, marginTop: 8 }} />
                  </div> : <Routes />}
                </AuthContext.Provider>
              </div>
            </Content>
          </Layout>
        </Elements>
      </StripeProvider>
    );
  }
}

export default withRouter(App);
