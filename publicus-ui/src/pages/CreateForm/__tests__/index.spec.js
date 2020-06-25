import toJson from 'enzyme-to-json';
import React from "react";
import {shallow, configure} from 'enzyme';
import { message } from 'antd';
import Adapter from 'enzyme-adapter-react-16';
import {CreateForm, InputTypes} from "../index";
import {API} from "aws-amplify";
import Forms from '../../../fixtures/Forms';
import RoutePaths from "../../../core/RoutePaths";

configure({ adapter: new Adapter() });

const mockValues = {
  MOCK: 'VALUE',
};

const mockGetFieldDecorator = jest.fn();
const mockForm = {
  validateFields: jest.fn().mockImplementation(async (func) => func(null, mockValues)),
  getFieldDecorator: mockGetFieldDecorator,
};

const mockLocation = {
  search: "?surveyId=4fe4b2c0-f4a5-11e9-87b0-6785951dc893"
};

const mockPush = jest.fn();
const mockHistory = {
  push: mockPush
};

describe('Create Form', () => {

  beforeEach(() => {
    message.success = jest.fn();
    message.error = jest.fn();
    API.get = jest.fn().mockResolvedValue(Forms[2]);
    API.put = jest.fn().mockResolvedValue(null);
    API.post = jest.fn().mockResolvedValue(null);
    mockGetFieldDecorator.mockReturnValue((component) => component);
  });

  afterEach(() => {
    API.get.mockReset();
    API.put.mockReset();
    API.post.mockReset();
    message.error.mockReset();
    message.success.mockReset();
  });

  test('should render the create form page', (done) => {
    const wrapper = shallow(
      <CreateForm
        form={mockForm}
        location={mockLocation}
        history={mockHistory}
      />
    );
    setTimeout(() => {
      expect(toJson(wrapper)).toMatchSnapshot();
      done();
    });
  });

  test('should give error message on invalid form loaded', () => {
    API.get = jest.fn().mockImplementation(() => {
      throw new Error();
    });
    shallow(
      <CreateForm
        form={mockForm}
        location={mockLocation}
        history={mockHistory}
      />
    );
    expect(message.error).toHaveBeenCalledWith('Failed to load form data');
  });

  test('should generate initial configs for all input types', () => {
    const wrapper = shallow(
      <CreateForm
        form={mockForm}
        location={{
          search: ''
        }}
        history={mockHistory}
      />
    );
    wrapper.instance().handleAddNew({ key: InputTypes.TextInput });
    wrapper.instance().handleAddNew({ key: InputTypes.Select });
    wrapper.instance().handleAddNew({ key: InputTypes.NumberInput });
    wrapper.instance().handleAddNew({ key: InputTypes.TimePicker });
    wrapper.instance().handleAddNew({ key: InputTypes.DatePicker });
    wrapper.instance().handleAddNew({ key: InputTypes.Radio });
    wrapper.instance().handleAddNew({ key: InputTypes.Switch });
    expect(wrapper.state().config).toMatchSnapshot();
  });

  test('should update create form page config values', () => {
    const wrapper = shallow(
      <CreateForm
        form={mockForm}
        location={mockLocation}
        history={mockHistory}
      />
    );
    wrapper.instance().onChangeCurrentTag('NEW_TAG');
    expect(wrapper.state().currentTagInput).toEqual('NEW_TAG');
    wrapper.instance().resetCurrentTag();
    expect(wrapper.state().currentTagInput).toEqual('');
    wrapper.instance().changeConfig('NEW_CONFIG');
    expect(wrapper.state().config).toEqual('NEW_CONFIG');
  });

  test('should save new form', async (done) => {
    const wrapper = shallow(
      <CreateForm
        form={mockForm}
        location={{
          search: ''
        }}
        history={mockHistory}
      />
    );
    setTimeout(async () => {
      await wrapper.instance().onSubmit({ preventDefault: () => {} });
      setTimeout(() => {
        expect(message.success).toHaveBeenCalledWith('Saved Form Successfully!');
        expect(mockPush).toHaveBeenCalledWith(RoutePaths.MyForms);
        expect(API.post.mock.calls[0]).toMatchSnapshot(0);
        done();
      }, 1100);
    });
  });

  test('should update current form', async (done) => {
    const wrapper = shallow(
      <CreateForm
        form={mockForm}
        location={mockLocation}
        history={mockHistory}
      />
    );
    setTimeout(async () => {
      await wrapper.instance().onSubmit({ preventDefault: () => {} });
      setTimeout(() => {
        expect(message.success).toHaveBeenCalledWith('Saved Form Successfully!');
        expect(mockPush).toHaveBeenCalledWith(RoutePaths.MyForms);
        expect(API.put.mock.calls[0]).toMatchSnapshot(0);
        done();
      }, 1100);
    });
  });

});