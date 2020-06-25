import toJson from 'enzyme-to-json';
import React from "react";
import {shallow, configure} from 'enzyme';
import { message, Form } from 'antd';
import Adapter from 'enzyme-adapter-react-16';
import { CompleteForm } from "../index";
import {API} from "aws-amplify";
import Forms from '../../../fixtures/Forms';

configure({ adapter: new Adapter() });


const mockValues = {
  1: 'VALUE_1',
  2: 'VALUE_2'
};

const mockForm = {
  validateFields: jest.fn().mockImplementation(async (func) => func(null, mockValues))
};

const mockLocation = {
  search: "?surveyId=4fe4b2c0-f4a5-11e9-87b0-6785951dc893&creatorId=ap-southeast-2:91ecfa27-a7c0-45a8-9f45-c93885409ca7"
};

const mockPush = jest.fn();
const mockHistory = {
  push: mockPush
};

describe('Complete Form', () => {

  beforeEach(() => {
    API.get = jest.fn().mockResolvedValue(Forms[2]);
    API.post = jest.fn().mockResolvedValue(null);
    message.success = jest.fn()
    message.error = jest.fn()
  });

  afterEach(() => {
    API.get.mockReset();
    API.post.mockReset();
    message.success.mockReset();
    message.error.mockReset();
    mockPush.mockReset();
  });

  test('should render complete form page', (done) => {
    const wrapper = shallow(
      <CompleteForm
        form={mockForm}
        location={mockLocation}
        history={mockHistory}
      />
    );
    expect(toJson(wrapper)).toMatchSnapshot();
    setTimeout(() => {
      expect(toJson(wrapper)).toMatchSnapshot();
      done();
    })
  });

  test('should give error and redirect on invalid form', async (done) => {
    API.get.mockImplementation(() => {
      throw new Error()
    });
    shallow(
      <CompleteForm
        form={mockForm}
        location={{
          search: "?invalid=url"
        }}
        history={mockHistory}
      />
    );
    setTimeout(() => {
      expect(message.error).toHaveBeenCalledTimes(2);
      expect(message.error.mock.calls[0]).toMatchSnapshot();
      expect(mockPush.mock.calls[0][0]).toMatchSnapshot();
      done();
    })
  });

  test('should submit results of complete form and redirect', async (done) => {
    const wrapper = shallow(
      <CompleteForm
        form={mockForm}
        location={mockLocation}
        history={mockHistory}
      />
    );
    setTimeout(async () => {
      await wrapper.instance().onSubmit({ preventDefault: () => {}});
      setTimeout(() => {
        expect(message.success.mock.calls[0]).toMatchSnapshot();
        expect(mockPush.mock.calls[0][0]).toMatchSnapshot();
        expect(API.post.mock.calls[0]).toMatchSnapshot();
        done();
      }, 1100)
    })
  });


});