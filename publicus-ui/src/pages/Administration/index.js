import React from 'react';
import {Button, Collapse, Input, message} from 'antd';
import {API, Auth} from "aws-amplify";
import {ApiName} from "../../core/Config";
import {Link} from "react-router-dom";
import RoutePaths from "../../core/RoutePaths";
import FormImage from "../../components/FormImage";
import {FormPublishedStates} from "../MyForms";

const { Panel } = Collapse;

/**
 * Page for administrators to approve and reject forms along with other admin actions
 */
export default class Administration extends React.Component {

  state = {
    approving: null, // Currently approving
    rejecting: null, // Currently rejecting
    newAdminEmail: '', // Email of new admin
    loadingNewAdmin: false, // Saving the data of a new admin
    toApprove: [] // List of forms to approve
  };

  componentDidMount = async () => {
    await this.fetchData();
    const authData = await Auth.currentCredentials();
    const { IdentityId } = authData.params;
    this.setState({
      IdentityId
    })
  };

  /**
   *
   * @returns {Promise<void>}
   */
  fetchData = async () => {
    try {
      const toApprove = await API.get(ApiName, "/viewFormsForApproval", {});
      this.setState({
        toApprove
      })
    } catch (err) {
      console.error(err);
    }
  };

  /**
   * Approve a form for the marketplace
   * @param form - form to approve
   */
  approve = (form) => async (e) => {
    e.stopPropagation();
    this.setState({
      approving: form.surveyId
    });
    try {
      await API.post(ApiName, "/modifySurveyStatus", {
        body: {
          status: FormPublishedStates.PUBLISHED,
          surveyId: form.surveyId
        }
      });
      message.success('Approved form');
      await this.fetchData();
    } catch (err) {
      console.error(err);
      message.error("Failed to approve form")
    }
    this.setState({
      approving: null
    })
  };

  /**
   * Reject a form from the marketplace
   * @param form - form to reject
   */
  reject = (form) => async (e) => {
    e.stopPropagation();
    this.setState({
      rejecting: form.surveyId
    });
    try {
      await API.post(ApiName, "/modifySurveyStatus", {
        body: {
          status: FormPublishedStates.REJECTED,
          surveyId: form.surveyId
        }
      });
      message.success('Rejected form');
      this.fetchData();
    } catch (err) {
      console.error(err);
      message.error("Failed to reject form")
    }
    this.setState({
      rejecting: false
    })
  };

  /**
   * Create a list header for a form
   * @param form
   */
  getHeader = (form) => {
    const { approving, rejecting } = this.state;
    return (
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', minWidth: 170 }}>
        <span style={{ marginTop: 4 }}>{unescape(form.name)}</span>
        <div>
          <Button
            type="primary"
            onClick={this.approve(form)}
            loading={approving === form.surveyId}
          >
            Approve
          </Button>
          <Button
            type="danger"
            onClick={this.reject(form)}
            style={{ marginLeft: 4 }}
            loading={rejecting === form.surveyId}
          >
            Reject
          </Button>
        </div>
      </div>
    )
  };

  /**
   * Turn a user into an administrator
   */
  onAddAdmin = async () => {
    const { newAdminEmail } = this.state;
    this.setState({
      loadingNewAdmin: true
    });
    try {
      await API.post(ApiName, "/createAdmin", {
        body: {
          email: newAdminEmail
        }
      });
      message.success(`Successfully made ${newAdminEmail} into an administrator`);
    } catch (err) {
      console.error(err);
      message.error(`Failed to make ${newAdminEmail} into an administrator`)
    }
    this.setState({
      loadingNewAdmin: false
    });
  };

  /**
   * Update the admin email
   * @param e - change event
   */
  changeAdminEmail = (e) => {
    this.setState({
      newAdminEmail: e.target.value
    })
  };

  /**
   * Render the content of a form list
   */
  renderToApprove = () => {
    const { toApprove, IdentityId } = this.state;
    const panels = toApprove.map(survey => {
      return (
        <Panel header={this.getHeader(survey)} key={survey.surveyId}>
          <Link
            to={`${RoutePaths.CompleteForm}?surveyId=${survey.surveyId}&creatorId=${(IdentityId)}`}
          >
            View Form
          </Link>
          <br />
          <br />
          <Link
            to={`${RoutePaths.Marketplace}?search=${survey.userId}`}
          >
            View Other Forms By This User
          </Link>
          <br />
          <br />
          <strong>Form Image</strong>
          <br />
          <FormImage
            image={survey.image}
          />
        </Panel>
      )
    });
    return(
      <React.Fragment>
        {panels}
      </React.Fragment>
    )
  };

  render() {
    const { newAdminEmail, loadingNewAdmin, toApprove } = this.state;
    return(
      <div style={{ display: 'flex', flexDirection: 'row', height: '100%', marginLeft: '12%', marginRight: '12%', marginTop: 10 }}>
        <div style={{ width: '50%', marginRight: 15 }}>
          <h2>Administrator Actions</h2>
          <span>Make New Administrator</span>
          <Input
            placeholder={"Enter the email address of a new administrator"}
            value={newAdminEmail}
            onChange={this.changeAdminEmail}
            style={{ marginBottom: 3, width: 'calc(100% - 120px)'}}
          />
          <Button
            type={"primary"}
            loading={loadingNewAdmin}
            onClick={this.onAddAdmin}
          >
            Submit
          </Button>
        </div>
        <div style={{ width: '50%'}}>
          <h2>Forms To Review</h2>
          <div style={{ height: 'calc(100% - 50px)', overflowY: 'scroll' }}>
            {
              toApprove.length
                ? <Collapse accordion>
                    {this.renderToApprove()}
                  </Collapse>
                : <strong>No forms currently require approval</strong>
            }
          </div>
        </div>
      </div>
    )
  }
}