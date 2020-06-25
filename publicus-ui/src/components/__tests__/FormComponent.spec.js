import toJson from 'enzyme-to-json';
import React from "react";
import {shallow, configure} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import FormComponent from "../FormComponent";
import FormConfig from '../../fixtures/FormConfig';

configure({ adapter: new Adapter() });

const mockGetFieldDecorator = jest.fn();

const mockForm = {
  getFieldDecorator: mockGetFieldDecorator
};

describe('Form Component', () => {

  beforeEach(() => {
    mockGetFieldDecorator.mockReset();
    mockGetFieldDecorator.mockReturnValue(component => component);
  });

  afterAll(() => {

  });

  test('should render text input form component', () => {
    const wrapper = shallow(
      <FormComponent
        id={1}
        question={FormConfig[1]}
        form={mockForm}
      />
    );
    expect(mockGetFieldDecorator.mock.calls[0]).toMatchSnapshot();
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  test('should render number input form component', () => {
    const wrapper = shallow(
      <FormComponent
        id={1}
        question={FormConfig[2]}
        form={mockForm}
      />
    );
    expect(mockGetFieldDecorator.mock.calls[0]).toMatchSnapshot();
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  test('should render select form component', () => {
    const wrapper = shallow(
      <FormComponent
        id={1}
        question={FormConfig[3]}
        form={mockForm}
      />
    );
    expect(mockGetFieldDecorator.mock.calls[0]).toMatchSnapshot();
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  test('should render switch form component', () => {
    const wrapper = shallow(
      <FormComponent
        id={1}
        question={FormConfig[4]}
        form={mockForm}
      />
    );
    expect(mockGetFieldDecorator.mock.calls[0]).toMatchSnapshot();
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  test('should render time picker form component', () => {
    const wrapper = shallow(
      <FormComponent
        id={1}
        question={FormConfig[5]}
        form={mockForm}
      />
    );
    expect(mockGetFieldDecorator.mock.calls[0]).toMatchSnapshot();
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  test('should render date picker form component', () => {
    const wrapper = shallow(
      <FormComponent
        id={1}
        question={FormConfig[6]}
        form={mockForm}
      />
    );
    expect(mockGetFieldDecorator.mock.calls[0]).toMatchSnapshot();
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  test('should render radio form component', () => {
    const wrapper = shallow(
      <FormComponent
        id={1}
        question={FormConfig[7]}
        form={mockForm}
      />
    );
    expect(mockGetFieldDecorator.mock.calls[0]).toMatchSnapshot();
    expect(toJson(wrapper)).toMatchSnapshot();
  });

});