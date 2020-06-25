import toJson from 'enzyme-to-json';
import React from "react";
import {shallow, configure} from 'enzyme';
import {message, Icon, Collapse} from 'antd';
import Forms from '../../../fixtures/Forms'
import {API, Auth} from "aws-amplify";
import Adapter from 'enzyme-adapter-react-16';
import MyForms from "../index";
import copy from 'copy-to-clipboard';
import axios from "axios";

const { Panel } = Collapse;

jest.mock('copy-to-clipboard');
jest.mock('axios');

configure({ adapter: new Adapter() });

describe('MyForms', () => {

  let wrapper;
  beforeEach(() => {
    message.success = jest.fn();
    Auth.currentCredentials = jest.fn();
    API.get = jest.fn().mockResolvedValue(Forms);
    API.post = jest.fn().mockResolvedValue(null);
    API.del = jest.fn().mockResolvedValue(null);
    wrapper = shallow(
      <MyForms />
    );
  });

  afterEach(() => {
    Auth.currentCredentials.mockReset();
    message.success.mockReset();
    API.get.mockReset();
    API.post.mockReset();
    API.del.mockReset();
  });

  test('should render the my forms page', (done) => {
    setTimeout(() => {
      expect(toJson(wrapper)).toMatchSnapshot();
      expect(wrapper.state()).toMatchSnapshot();
      done();
    });
  });


  test('should copy link to complete form', (done) => {
    setTimeout(async () => {
      Auth.currentCredentials.mockResolvedValue({
        params: {
          IdentityId: 'IDENTITY_ID'
        }
      });
      await shallow(wrapper.find(Panel).at(0).props().header).find(Icon).at(0).props().onClick({ stopPropagation: () => {} });
      expect(copy.mock.calls[0][0]).toMatchSnapshot();
      done();
    });
  });


  test('should change submission status of form', (done) => {
    setTimeout(async () => {
      await wrapper.instance().submitForm(Forms[0])();
      expect(API.post).toMatchSnapshot();
      expect(wrapper.state().ownedForms.find(form => form.surveyId).publishedStatus).toEqual(1);
      done();
    });
  });

  test('should delete form', (done) => {
    setTimeout(async () => {
      await wrapper.instance().deleteForm(Forms[0])();
      expect(wrapper.state().ownedForms).toHaveLength(3);
      done();
    });
  });

  test('should handle uploading of form image', (done) => {
    setTimeout(async () => {
      wrapper.instance().uploadInput = {};
      wrapper.instance().uploadInput.files = [{
        name: 'fileName.png'
      }];
      API.get.mockResolvedValue({ putUrl: 'PUT_URL' });
      axios.put.mockResolvedValue(null);
      await wrapper.instance().handleUpload(Forms[0])();
      expect(message.success.mock.calls[0][0]).toEqual('Successfully uploaded file');
      done();
    });
  });

  test('should change approval notification value of form', (done) => {
    setTimeout(async () => {
      await wrapper.instance().onChangeApprovalNotification(Forms[0])({
        target: {
          checked: true
        }
      });
      expect(API.post.mock.calls[0]).toMatchSnapshot();
      expect(wrapper.state().ownedForms.find(form => form.surveyId).receiveNotifications).toEqual(1);
      done();
    });
  });

  test('should add a rating to a form', (done) => {
    setTimeout(async () => {
      await wrapper.instance().addRating(Forms[0])(2.5);
      expect(API.post.mock.calls[0]).toMatchSnapshot();
      done();
    });
  });


});