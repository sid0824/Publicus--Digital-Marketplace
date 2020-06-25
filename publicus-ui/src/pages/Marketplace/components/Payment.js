import React, {Component} from 'react';
import {CardElement, injectStripe} from 'react-stripe-elements';
import {Button, message} from "antd";

const options = {
  style: {
    base: {
      fontSize: '16px',
      color: '#424770',
      fontFamily: 'Open Sans, sans-serif',
      letterSpacing: '0.025em',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      color: '#c23d4b',
    },
  }
};

export class Payment extends Component {

  state = {
    purchasing: false,
    error: null
  };

  submit = async (e) => {
    e.preventDefault();
    const { error } = this.state;
    if (!error) {
      this.setState({
        purchasing: true
      });
      try {
        const { stripe, checkout } = this.props;
        let { token } = await stripe.createToken({name: "surveyPurchase"});
        await checkout(token.id);
        message.success('Successfully Purchased Surveys');
      } catch (err) {
        console.error(err);
        message.error(err.message)
      }
      this.setState({
        purchasing: false
      });
    }
  };

  onChange = ({ error }) => {
    if (error) {
      this.setState({
        error: error.message
      })
    } else {
      this.setState({
        error: null
      })
    }
  };

  render() {
    const { purchasing, error } = this.state;
    return (
      <div>
        <br />
        <h2 style={{ marginBottom: 12 }}>Card Details</h2>
        <CardElement onChange={this.onChange} {...options} />
        <div style={{ height: 20, marginTop: 4, color: 'red' }}>
          {!!error && error}
        </div>
        <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
          <Button
            type={"primary"}
            onClick={this.submit}
            loading={purchasing}
          >
            Purchase
          </Button>
        </div>
      </div>
    );
  }
}

export default injectStripe(Payment);