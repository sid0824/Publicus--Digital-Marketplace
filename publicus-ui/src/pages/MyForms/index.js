import React from 'react';
import {Icon, Rate, Spin, Tooltip, message, Collapse, Button, Checkbox, Popconfirm} from "antd";
import { API, Auth } from "aws-amplify";
import RoutePaths from "../../core/RoutePaths";
import { Link } from "react-router-dom";
import copy from 'copy-to-clipboard';
import { ApiName, SiteUrl } from "../../core/Config";
import FormImage from "../../components/FormImage";
import axios from "axios";

const { Panel } = Collapse;

export const FormPublishedStates = {
  'NOT_SUBMITTED': 0,
  'SUBMITTED': 1, // cant edit anymore
  'REJECTED': 2,
  'PUBLISHED': 3
};

const FormPublishedLabels = {
  [FormPublishedStates['NOT_SUBMITTED']]: 'Not Submitted',
  [FormPublishedStates['SUBMITTED']]: 'Waiting Approval',
  [FormPublishedStates['REJECTED']]: 'Rejected',
  [FormPublishedStates['PUBLISHED']]: 'Published',
};

/**
 * Renders the item in a list for a specified form
 * @param form - The form to render
 * return - The list item
 */
const renderFormHeader = (form) =>
  <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
    <span style={{ marginTop: 5 }}>{unescape(form.name)}</span>
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <Tooltip title="Copy Link to Complete Form">
        <Icon 
          type="import" 
          style={{ color: '#6fa6ed', fontSize: 32, marginRight: 10 }}
          onClick={async (e) => {
            e.stopPropagation();
            const authData = await Auth.currentCredentials();
            const { IdentityId } = authData.params;
            copy(`${SiteUrl}${RoutePaths.CompleteForm}?surveyId=${form.surveyId}&creatorId=${(IdentityId)}`);
            message.success('Copied Link to Complete Form');
          }}
        />
      </Tooltip>
      <Tooltip title="View Results">
        <Link
          to={RoutePaths.ViewResults + `?surveyId=${form.surveyId}`}
          onClick={e => {
            e.stopPropagation()
          }}
        >
          <Icon type="table" style={{ color: '#6fa6ed', fontSize: 32 }}/>
        </Link>
      </Tooltip>
    </div>
  </div>;

/**
 * Page used to view all owned and purchased surveys
 */
export class MyForms extends React.Component {

  state = {
    ownedForms: [], // Surveys owned by the user
    purchasedForms: [], // Surveys purchased by the user
    loading: true, // If the page is loading survey data,
    submitLoading: false,
    deleteLoading: false
  };

  /**
   * Fetch the data for all form types
   */
  componentDidMount = async () => {
    this.setState({
      loading: true
    });
    const promises = await Promise.all([
      API.get(ApiName, "/survey/purchased", {}),
      API.get(ApiName, "/survey/owned", {}),
    ]);
    const purchasedForms = promises[0].sort((a, b) => a.name.localeCompare(b.name));
    const ownedForms = promises[1].sort((a, b) => a.name.localeCompare(b.name));
    this.setState({
      purchasedForms,
      ownedForms,
      loading: false,
    })
  };

  submitForm = (form) => async () => {
    this.setState({
      submitLoading: true
    });
    try {
      await API.post(ApiName, "/modifySurveyStatus", {
        body: {
          status: FormPublishedStates.SUBMITTED,
          surveyId: form.surveyId
        }
      });
      message.success('Successfully submitted the form');
      let { ownedForms } = this.state;
      ownedForms = ownedForms.map(ownedForm => {
        return ownedForm.surveyId === form.surveyId
          ? { ...ownedForm, publishedStatus: 1 }
          : ownedForm
      });
      this.setState({
        ownedForms
      })
    } catch (err) {
      console.error(err);
      message.error("Failed to submit form")
    }
    this.setState({
      submitLoading: false
    })
  };

  deleteForm = (form) => async () => {
    this.setState({
      deleteLoading: true
    });
    try {
      await API.del(ApiName, `/survey/${form.surveyId}/`, {});
      message.success('Successfully deleted form');
      let { ownedForms } = this.state;
      this.setState({
        ownedForms: ownedForms.filter(ownedForm => ownedForm.surveyId !== form.surveyId)
      })
    } catch (err) {
      console.error(err);
      message.error('Failed to delete form');
    }
    this.setState({
      deleteLoading: false
    });
  };

  handleUpload = (form) => async () => {
    try {
      let file = this.uploadInput.files[0];
      let fileType = this.uploadInput.files[0].name.split('.')[1];
      if (!['tiff', 'jpeg', 'png', 'jpg'].includes(fileType.toLowerCase())) {
        message.error('Upload a valid image');
        return;
      }
      const response = await API.get(ApiName, `/getFormImagePostUrl/${form.surveyId}?fileType=${fileType}`, {});
      const { putUrl } = response;
      await axios.put(putUrl, file, {
        headers: {
          'Content-Type': fileType
        }
      });
      message.success('Successfully uploaded file');
      const fileReader = new FileReader();
      fileReader.onload = function () {
        document.getElementById("formImage").src = fileReader.result;
      };
      fileReader.readAsDataURL(this.uploadInput.files[0]);
    } catch (err) {
      message.error('Failed to upload avatar')
    }
  };

  onChangeApprovalNotification = (form) => async (event) => {
    try {
      const { checked } = event.target;
      const newValue = checked ? 1 : 0;
      await API.post(ApiName, `/survey/${form.surveyId}/notifications`, {
        body: {
          receiveNotifications: newValue
        }
      });
      message.success('Updated notification setting');
      const { ownedForms } = this.state;
      this.setState({
        ownedForms: ownedForms.map(ownedForm => {
          return ownedForm.surveyId === form.surveyId
            ? { ...ownedForm, receiveNotifications: newValue }
            : ownedForm
        })
      })
    } catch (err) {
      console.error(err);
      message.error('Failed to update notification setting')
    }
  };

  renderOwnedFormBody = (form, index) => {
    let body = null;
    const { submitLoading, deleteLoading } = this.setState;
    if (form.publishedStatus === 0) {
      body = (
        <div>
          <br />
          <strong>Form Image</strong>
          <div style={{ height: 180, width: 270, marginBottom: 8 }}>
            <FormImage
              image={form.image}
            />
          </div>
          <input
            onChange={this.handleUpload(form)}
            ref={(ref) => { this.uploadInput = ref; }}
            type="file"
          />
          <br />
          <br />
          <Button
            type={"primary"}
            onClick={this.submitForm(form)}
            loading={submitLoading}
            style={{ marginRight: 4 }}
          >
            Submit for Approval
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this form?"
            onConfirm={this.deleteForm(form)}
            okText="Yes"
            cancelText="No"
            placement="topRight"
            icon={<Icon type="close-circle" style={{ color: 'red '}} />}
          >
            <Button
              type="danger"
              style={{ marginRight: 4 }}
              loading={deleteLoading}
            >
              Delete
            </Button>
          </Popconfirm>
          <Link
            to={`${RoutePaths.CreateForm}?surveyId=${form.surveyId}`}
          >
            <Button
              type={"primary"}
            >
              Edit
            </Button>
          </Link>
        </div>
      )
    }
    if (form.publishedStatus === 1) {
      body = (
        <div>
          <br />
          <Checkbox
            onChange={this.onChangeApprovalNotification(form)}
            checked={!!form.receiveNotifications}
          >
            Receive Approval Email Notification
          </Checkbox>
        </div>
      )
    }
    if (form.publishedStatus === 3) {
      body = (
        <div>
          <strong>Number of Purchases: </strong> {form.numPurchases || '0'}
          <br />
          <strong>Average Rating: </strong>
          {form.avgRating
            ? <React.Fragment>
                <br />
                <Rate defaultValue={form.avgRating} allowHalf disabled />
             </React.Fragment>
            : 'Currently no ratings'
          }
          <br />
          <br />
          <Checkbox
            onChange={this.onChangeApprovalNotification(form)}
            checked={!!form.receiveNotifications}
          >
            Receive Purchase Email Notifications
          </Checkbox>
        </div>
      )
    }
    return (
      <Panel header={renderFormHeader(form)} key={form.surveyId}>
        <strong>Published State: </strong>
        {FormPublishedLabels[form.publishedStatus]}
        <br />
        <strong>Number of responses: </strong> {form.numResponses || '0'}

        {body}
      </Panel>
    )
  };

  addRating = (form) => async (e) => {
    try {
      await API.post(ApiName, `/survey/${form.surveyId}/rating`, {
        body: {
          rating: e
        }
      });
      message.success('Successfully updated form rating');
    } catch (err) {
      console.error(err);
      message.error('Failed to update form rating');
    }
  };

  renderPurchasedForms = (form, index) => {
    return (
      <Panel header={renderFormHeader(form)} key={index}>
        <strong>My Rating</strong>
        <br />
        <Rate
          defaultValue={form.myRating || 0}
          allowHalf
          onChange={this.addRating(form)}
        />
        <br />
        <br />
        <strong>Number of my responses: </strong> {form.numResponses || '0'}
      </Panel>
    )
  };

  render() {
    const { purchasedForms, ownedForms, loading } = this.state;
    return (
      <div style={{ display: 'flex', flexDirection: 'row', marginLeft: '10%', marginRight: '10%', marginTop: 10, marginBottom: 100 }}>
        <div style={{ width: '50%', paddingRight: 15 }}>
          <h1>Owned Forms</h1>
          {
            loading
              ? <Spin />
              : ownedForms.length
                  ? <Collapse accordion>
                      {ownedForms.map((form, index) => {
                        return this.renderOwnedFormBody(form, index);
                      })}
                    </Collapse>
                  : 'You have no owned forms'
          }
        </div>
        <div style={{ width: '50%' }}>
          <h1>Available Forms</h1>
          {
            loading
              ? <Spin />
              :  purchasedForms.length
                  ? <Collapse accordion>
                      {purchasedForms.map((form, index) => {
                        return this.renderPurchasedForms(form, index);
                      })}
                    </Collapse>
                  : 'You have no purchased forms'
          }
        </div>
      </div>
    )
  }
}

export default MyForms;