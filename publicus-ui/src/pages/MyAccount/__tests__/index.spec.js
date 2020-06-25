import toJson from 'enzyme-to-json';
import React from "react";
import {shallow, configure} from 'enzyme';
import { message, Input } from 'antd';
import Adapter from 'enzyme-adapter-react-16';
import {MyAccount} from "../index";
import {API, Auth} from 'aws-amplify';
import axios from "axios";

configure({ adapter: new Adapter() });

describe('MyAccount', () => {

  beforeEach(() => {
    axios.put = jest.fn().mockResolvedValue(null);
    API.get = jest.fn().mockResolvedValue(null);
    Auth.changePassword = jest.fn().mockResolvedValue(null);
    Auth.currentAuthenticatedUser = jest.fn().mockResolvedValue(null);
    message.success = jest.fn();
    message.error = jest.fn();
  });

  afterEach(() => {
    axios.put.mockReset();
    API.get.mockReset();
    Auth.changePassword.mockReset();
    Auth.currentAuthenticatedUser.mockReset();
    message.success.mockReset();
    message.error.mockReset();
  });

  test('should render my account page', () => {
    const wrapper = shallow(
      <MyAccount />
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  test('should update account password', async () => {
    const wrapper = shallow(
      <MyAccount />
    );
    wrapper.find(Input.Password).at(0).props().onChange({
      target: {
        value: 'PASSWORD'
      }
    });
    wrapper.find(Input.Password).at(1).props().onChange({
      target: {
        value: 'PASSWORD'
      }
    });
    await wrapper.instance().changePassword();
    expect(Auth.changePassword.mock.calls[0]).toMatchSnapshot();
    expect(message.success).toHaveBeenCalledWith('Successfully changed password');
  });

  test('should give error msg on bad password update', async () => {
    const wrapper = shallow(
      <MyAccount />
    );
    Auth.changePassword.mockImplementation(() => {
      throw new Error('ERROR')
    });
    await wrapper.instance().changePassword();
    expect(message.error).toHaveBeenCalledWith('Failed to change password');
  });

  test('should handle uploading avatar', async () => {
    const wrapper = shallow(
      <MyAccount />
    );
    wrapper.instance().uploadInput = {};
    wrapper.instance().uploadInput.files = [{
      name: 'fileName.png'
    }];
    API.get.mockResolvedValue({ putUrl: 'PUT_URL' });
    axios.put.mockResolvedValue(null);
    await wrapper.instance().handleUpload();
    expect(message.success).toHaveBeenCalledWith('Successfully uploaded file')
  });

  test('should only allow images to be uploaded', async () => {
    const wrapper = shallow (
      <MyAccount />
    );
    wrapper.instance().uploadInput = {};
    wrapper.instance().uploadInput.files = [{
      name: 'fileName.docx'
    }];
    await wrapper.instance().handleUpload();
    expect(message.error).toHaveBeenCalledWith('Upload a valid image')
  });

});