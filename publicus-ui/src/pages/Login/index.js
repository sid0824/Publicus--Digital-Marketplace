import React from 'react';
import { withAuthContext } from "../../AuthContext";
import { Button, Form, Input, message } from "antd";
import { Auth } from "aws-amplify";
import {Link, withRouter} from "react-router-dom";
import RoutePaths from "../../core/RoutePaths";

/**
 * Page used to login to a user's account
 */
export class Login extends React.Component {

  state = {
    loading: false
  };

  /**
   * Attempt to login using current input values. Redirects to home page on success
   */
  onLogin = async (e) => {
    e.preventDefault();
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        try {
          this.setState({
            loading: true
          });
          const { setUserHasAuthenticated, history } = this.props;
          const { email, password } = values;
          await Auth.signIn(email, password);
          setUserHasAuthenticated(true);
          message.success('Logged In Successfully');
          this.setState({
            loading: false
          });
          setTimeout(() => {
            history.push(RoutePaths.Home)
          }, 1000)
        } catch (err) {
          console.error(err);
          message.error(err.message);
          this.setState({
            loading: false
          });
        }
      }
    });
  };

  render() {
    const { form } = this.props;
    const { loading } = this.state;
    const { getFieldDecorator } = form;
    return (
      <Form
        style={{ width: '70%', marginLeft: '15%', marginRight: '15%', marginTop: '70px' }}
        onSubmit={this.onLogin}
      >
        <h1>
          Enter Your Details
        </h1>
        Email Address
        <Form.Item>
          {getFieldDecorator('email', {
            rules: [{ required: true, message: 'Please enter your username' }],
          })(
            <Input
              placeholder="Username..."
            />,
          )}
        </Form.Item>
        Password
        <Form.Item>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: 'Please enter your password' }],
          })(
            <Input
              type="password"
              placeholder="Password..."
            />,
          )}
        </Form.Item>
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Login
            </Button>
          </Form.Item>
          <Link
            to={RoutePaths.CreateAccount}
          >
            <Button
              style={{ marginTop: 3, marginLeft: 4 }}
            >
              Create Account
            </Button>
          </Link>
        </div>
      </Form>
    )
  }
}

export default withRouter(withAuthContext(Form.create()(Login)));