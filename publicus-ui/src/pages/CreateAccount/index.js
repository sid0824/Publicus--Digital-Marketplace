import React from 'react';
import { Button, Form, Input, message } from 'antd';
import { API, Auth } from "aws-amplify";
import { withAuthContext } from "../../AuthContext";
import { withRouter } from "react-router-dom";
import RoutePaths from "../../core/RoutePaths";
import { ApiName } from "../../core/Config";

/**
 * Page for creating new accounts for the site
 */
export class CreateAccount extends React.Component {

  state = {
    confirmingUser: false, // Whether the page is currently confirming a user, or initially creating one
    username: null, // The inputted username for the new account
    password: null, // The inputted password for the new account
    firstname: null, // First name of the user
    lastname: null, // Last name of the user
    creating: false, // Currently creating an account
    confirming: false // Currently confirming an account
  };

  /***
   * Called when submitted the fields for creating an account. Signs-up the user through Cognito and
   * emails them a conformation code.
   * @param e - SubmitEvent
   */
  onCreateAccount = async (e) => {
    e.preventDefault();
    this.props.form.validateFields(async (err, values) => {
      if (!err && values.password === values.password2) {
        this.setState({
          creating: true
        });
        try {
          const { email, password, firstname, lastname } = values;
          await Auth.signUp({
            username: email,
            password
          });
          this.setState({
            confirmingUser: true,
            username: email,
            password,
            firstname,
            lastname
          })
        } catch (err) {
          message.error(err.message);
        }
        this.setState({
          creating: false
        });
      }
    });
  };

  /**
   * Called when confirming a code with the sent code. If successful, logs the user in with the given values
   * and redirects them to the home page.
   * @param e - SubmitEvent
   */
  onConfirmAccount = async (e) => {
    e.preventDefault();
    return this.props.form.validateFields(async (err, values) => {
      if (!err) {
        this.setState({
          confirming: true
        });
        try {
          const { username, password, firstname, lastname } = this.state;
          const { setUserHasAuthenticated, history } = this.props;
          await Auth.confirmSignUp(username, values.confirmationCode);
          await Auth.signIn(username, password);
          const authData = await Auth.currentCredentials();
          await API.post(ApiName, `/user`, {
            body: {
              email: username,
              cognitoId: authData.params.IdentityId,
              firstname,
              lastname
            }
          });
          message.success('Successfully Created an Account');
          setUserHasAuthenticated(true);
          setTimeout(async () => {
            history.push(RoutePaths.Home)
          }, 1000)
        } catch (err) {
          console.error(err);
        }
        this.setState({
          confirming: false
        });
      }
    });
  };

  /**
   * Renders the form fields required for creating an account
   * @returns Create Account Form Fields
   */
  renderCreateAccountFields = () => {
    const { form } = this.props;
    const { creating } = this.state;
    const { getFieldDecorator } = form;
    const values = form.getFieldsValue();
    const { password, password2 } = values;
    return (
      <Form onSubmit={this.onCreateAccount}>
        Email Address
        <Form.Item>
          {getFieldDecorator('email', {
            rules: [{ required: true, message: 'Please enter your email address' },
              { type: 'email', message: 'Enter a valid email address' }],
          })(
            <Input
              placeholder="Enter your email address..."
            />,
          )}
        </Form.Item>
        First Name
        <Form.Item>
          {getFieldDecorator('firstname', {
            rules: [{ required: true, message: 'Please enter your first name' }],
          })(
            <Input
              placeholder="Enter your first name..."
            />,
          )}
        </Form.Item>
        Last Name
        <Form.Item>
          {getFieldDecorator('lastname', {
            rules: [{ required: true, message: 'Please enter your last name' }],
          })(
            <Input
              placeholder="Enter your last name..."
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
              placeholder="Enter your password..."
            />,
          )}
        </Form.Item>
        Confirm Your Password
        <Form.Item
          validateStatus={password && password2 && password !== password2
            ? "error"
            : null
          }
          help={password && password2 && password !== password2
            ? "Passwords Should Match"
            : null
          }
        >
          {getFieldDecorator('password2', {
            rules: [{ required: true, message: 'Please confirm your password' }],
          })(
            <Input
              type="password"
              placeholder="Confirm your Password..."
            />,
          )}
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={creating}
          >
            Submit
          </Button>
        </Form.Item>
      </Form>
    )
  };

  /**
   * Renders the fields necessary for confirming an account
   * @returns Confirm Account Form Fields
   */
  renderConfirmAccountFields = () => {
    const { getFieldDecorator } = this.props.form;
    const { confirming } = this.state;
    return (
      <Form onSubmit={this.onConfirmAccount}>
        Check your email for the confirmation code
        <Form.Item>
          {getFieldDecorator('confirmationCode', {
            rules: [{ required: true, message: 'Please enter the confirmation code...' }],
          })(
            <Input
              placeholder="Confirmation Code..."
            />,
          )}
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={confirming}
          >
            Submit
          </Button>
        </Form.Item>
      </Form>
    )
  };

  render() {
    const { confirmingUser } = this.state;
    return (
      <div style={{ width: '70%', marginLeft: '15%', marginRight: '15%', marginTop: '70px' }}>
        <h1>
          Enter Your Details
        </h1>
        {confirmingUser ? this.renderConfirmAccountFields() : this.renderCreateAccountFields()}
      </div>
    )
  }
}

export default withRouter(withAuthContext(Form.create()(CreateAccount)));