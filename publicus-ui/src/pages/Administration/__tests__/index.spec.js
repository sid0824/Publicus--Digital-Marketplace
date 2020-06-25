import toJson from 'enzyme-to-json';
import React from "react";
import {shallow, configure} from 'enzyme';
import Forms from '../../../fixtures/Forms';
import Adapter from 'enzyme-adapter-react-16';
import Administration from "../index";
import {API, Auth} from "aws-amplify";
import { message } from 'antd';

configure({ adapter: new Adapter() });

jest.mock('antd');

describe('Administration', () => {

  beforeEach(() => {
    Auth.currentCredentials = jest.fn().mockResolvedValue({
      params: {
        IdentityId: 'MOCK_IDENTITY'
      }
    });
    API.get = jest.fn().mockResolvedValue(Forms);
    API.post = jest.fn();
  });

  afterEach(() => {
    Auth.currentCredentials.mockReset();
    API.get.mockReset();
    API.post.mockReset();
    message.success.mockClear();
  });

  test('should render administration page', (done) => {
    const wrapper = shallow(
      <Administration />
    );
    setTimeout(() => {
      expect(toJson(wrapper)).toMatchSnapshot();
      done();
    })
  });

  test('should approve form', async () => {
    const wrapper = shallow(
      <Administration />
    );
    await wrapper.instance().approve(Forms[0])({ stopPropagation: () => {}});
    expect(API.post.mock.calls[0]).toMatchSnapshot();
    expect(API.get.mock.calls[1]).toMatchSnapshot();
    expect(message.success.mock.calls[0]).toMatchSnapshot();
  });

  test('should reject form', async () => {
    const wrapper = shallow(
      <Administration />
    );
    await wrapper.instance().reject(Forms[0])({ stopPropagation: () => {}});
    expect(API.post.mock.calls[0]).toMatchSnapshot();
    expect(API.get.mock.calls[1]).toMatchSnapshot();
    expect(message.success.mock.calls[0]).toMatchSnapshot();
  });

  test('should add admin', async () => {
    const wrapper = shallow(
      <Administration />
    );
    wrapper.setState({
      newAdminEmail: 'MOCK_EMAIL'
    });
    await wrapper.instance().onAddAdmin();
    expect(API.post.mock.calls[0]).toMatchSnapshot();
  });

});