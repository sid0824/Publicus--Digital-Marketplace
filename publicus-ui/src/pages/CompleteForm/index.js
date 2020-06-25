import React from 'react';
import { parse } from 'query-string';
import {Button, Form, Icon, message} from 'antd';
import RoutePaths from "../../core/RoutePaths";
import {API} from "aws-amplify";
import FormComponent from "../../components/FormComponent";
import {withRouter} from "react-router-dom";
import {ApiName} from "../../core/Config";

/**
 * Page used to complete a form and submit the results to be saved.
 */
export class CompleteForm extends React.Component {

  state = {
    formConfig: null // The JSON config of the form being completed
  };

  /**
   * On mount, fetch the form config based on the url parameters provided. Redirect if unsuccessful
   * @returns {Promise<void>}
   */
  componentDidMount = async () => {
    const { location, history } = this.props;
    const parsed = parse(location.search);
    const { surveyId } = parsed;
    if (!surveyId) {
      message.error('Invalid Form. Redirecting');
      history.push(RoutePaths.Home)
    }
    try {
      const form = await API.get(ApiName, `/survey/${surveyId}`, {});
      this.setState({
        formConfig: form
      })
    } catch (err) {
      message.error('Invalid Form. Redirecting');
      history.push(RoutePaths.Home);
      console.error(err);
    }
  };

  /**
   * Submits the results of the form completion to the API. Returns error messages relevantly throughout the form
   * if the submitted values are invalid.
   * @param e - SubmitEvent
   */
  onSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        try {
          const { history, location } = this.props;
          const parsed = parse(location.search);
          const { creatorId } = parsed;
          const { formConfig } = this.state;
          const results = {};
          Object.keys(values).forEach(key => {
            results[key] = values[key] || null
          });
          await API.post(ApiName, `/results/${formConfig.surveyId}`, {
            body: {
              creatorId,
              results
            }
          });
          message.success('Saved Successfully');
          setTimeout(() => {
            if (formConfig.redirect) {
              window.location.href = unescape(formConfig.redirect);
            } else {
              history.push(RoutePaths.Home)
            }
          }, 1000)
        } catch (err) {
          console.error(err);
          message.error(err.message);
        }
      }
    });
  };

  render() {
    const { formConfig } = this.state;
    const { form } = this.props;
    if (!formConfig) { // Return loading symbol if still loading form config
      return <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', paddingTop: 200 }}>
        <Icon type="loading" style={{ fontSize: 70, marginTop: 8 }} />
      </div>
    }
    const config = JSON.parse(unescape(formConfig.form));
    return(
      <div style={{ marginLeft: 'calc(50% - 250px)', marginRight: 'calc(50% - 250px)', marginTop: 10 }}>
        <h1>{unescape(formConfig.name)}</h1>
        {unescape(formConfig.instructions)}
        <br />
        <br />
        <Form onSubmit={this.onSubmit}>
          {Object.keys(config).map(id => { // Render a form item for each specified in the configuration
            return(
              <React.Fragment key={id}>
                {config[id].prompt}
                <FormComponent
                  id={id}
                  question={config[id]}
                  form={form}
                />
              </React.Fragment>
            );
          })}
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ marginRight: 5 }}>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    )
  }
}

export default withRouter(Form.create()(CompleteForm));