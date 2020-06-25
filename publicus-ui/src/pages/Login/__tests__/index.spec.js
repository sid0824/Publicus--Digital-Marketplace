import toJson from 'enzyme-to-json';
import React from "react";
import {shallow, configure} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import {Login} from "../index";
import {Auth} from "aws-amplify";
import { message } from 'antd';
import RoutePaths from "../../../core/RoutePaths";
configure({ adapter: new Adapter() });

const mockValues = {
  email: 'EMAIL',
  password: 'PASSWORD'
};

const mockGetFieldDecorator = jest.fn();
const mockForm = {
  validateFields: jest.fn().mockImplementation(async (func) => func(null, mockValues)),
  getFieldDecorator: mockGetFieldDecorator,
};

const mockSetUserHasAuthenticated = jest.fn();
const mockPush = jest.fn();
const mockHistory = {
  push: mockPush
};

describe('Login', () => {

  beforeEach(() => {
    mockGetFieldDecorator.mockReturnValue((component) => component);
    Auth.signIn = jest.fn();
    message.success = jest.fn();
    message.error = jest.fn();
  });

  afterEach(() => {
    mockSetUserHasAuthenticated.mockReset();
    Auth.signIn.mockReset();
    message.success.mockReset();
    message.error.mockReset();
  });

  test('should render the login page', () => {
    const wrapper = shallow(
      <Login
        form={mockForm}
      />
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  test('should login', async (done) => {
    const wrapper = shallow(
      <Login
        form={mockForm}
        history={mockHistory}
        setUserHasAuthenticated={mockSetUserHasAuthenticated}
      />
    );
    await wrapper.instance().onLogin({ preventDefault: () => {} });
    setTimeout(() => {
      expect(message.success).toHaveBeenCalledWith('Logged In Successfully');
      expect(mockSetUserHasAuthenticated).toHaveBeenCalledWith(true);
      expect(Auth.signIn.mock.calls[0]).toMatchSnapshot();
      expect(mockPush.mock.calls[0][0]).toEqual(RoutePaths.Home);
      done();
    }, 1100);
  });

  test('should give error on failing to login', async (done) => {
    const wrapper = shallow(
      <Login
        form={mockForm}
        history={mockHistory}
        setUserHasAuthenticated={mockSetUserHasAuthenticated}
      />
    );
    Auth.signIn.mockImplementation(() => {
      throw new Error("ERROR");
    });
    await wrapper.instance().onLogin({ preventDefault: () => {} });
    setTimeout(() => {
      expect(message.error).toHaveBeenCalledWith('ERROR');
      done();
    }, 1100);
  });

});