import toJson from 'enzyme-to-json';
import React from "react";
import {shallow, configure} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { CreateAccount } from "../index";
import { Auth, API } from 'aws-amplify';

configure({ adapter: new Adapter() });

const mockValues = {
  email: 'MOCK_EMAIL',
  password: 'MOCK_PASSWORD',
  password2: 'MOCK_PASSWORD',
  firstname: 'MOCK_FIRST',
  lastname: 'MOCK_LAST',
  confirmationCode: 'MOCK_CONF_CODE'
};

const mockGetFieldDecorator = jest.fn();
const mockForm = {
  validateFields: jest.fn().mockImplementation(async (func) => func(null, mockValues)),
  getFieldDecorator: mockGetFieldDecorator,
  getFieldsValue: () => {
    return {
      password: 'PASS',
      password2: 'PASSWORD',
    }
  }
};

const mockPush = jest.fn();
const mockSetUserHasAuthenticated = jest.fn();
const mockHistory = {
  push: mockPush
};


describe('Create Account', () => {

  beforeEach(() => {
    mockGetFieldDecorator.mockReturnValue((component) => component);
    Auth.signUp = jest.fn();
    Auth.confirmSignUp = jest.fn();
    Auth.signIn = jest.fn();
    Auth.currentCredentials = jest.fn().mockResolvedValue({
      params: {
        IdentityId: 'MOCK_ID'
      }
    });
    API.post = jest.fn().mockResolvedValue(null);
  });

  afterEach(() => {
    mockPush.mockReset();
    mockSetUserHasAuthenticated.mockReset();
    mockGetFieldDecorator.mockReset();
    Auth.signUp.mockReset();
    Auth.confirmSignUp.mockReset();
    Auth.signIn.mockReset();
    API.post.mockReset();
  });

  test('should render the create account page', () => {
    const wrapper = shallow(
      <CreateAccount
        form={mockForm}
        history={mockHistory}
      />
    );
    expect(toJson(wrapper)).toMatchSnapshot();
    wrapper.setState({
      confirmingUser: true
    });
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  test('should create and confirm an account', async() => {
    const wrapper = shallow(
      <CreateAccount
        form={mockForm}
        history={mockHistory}
        setUserHasAuthenticated={mockSetUserHasAuthenticated}
      />
    );
    await wrapper.instance().onCreateAccount({ preventDefault: () => {}});
    expect(Auth.signUp.mock.calls[0]).toMatchSnapshot();
    expect(wrapper.state()).toMatchSnapshot();
    await wrapper.instance().onConfirmAccount({ preventDefault: () => {}});
    await Promise.resolve();
    expect(API.post.mock.calls[0]).toMatchSnapshot();
    expect(mockSetUserHasAuthenticated).toHaveBeenCalledWith(true);
  });

});