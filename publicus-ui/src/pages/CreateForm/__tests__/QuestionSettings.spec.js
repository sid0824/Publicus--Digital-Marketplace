import toJson from 'enzyme-to-json';
import React from "react";
import {shallow, configure} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { QuestionSettings } from "../components/QuestionSettings";
import FormConfig from '../../../fixtures/FormConfig';

configure({ adapter: new Adapter() });

const mockChangeConfigValue = jest.fn();

describe('QuestionSettings', () => {

  beforeEach(() => {

  });

  afterEach(() => {
    mockChangeConfigValue.mockReset();
  });

  test('should render text input question settings', () => {
    const wrapper = shallow(
      <QuestionSettings
        id={1}
        config={FormConfig}
        changeConfigValue={mockChangeConfigValue}
      />
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  test('should render number input question settings', () => {
    const wrapper = shallow(
      <QuestionSettings
        id={2}
        config={FormConfig}
        changeConfigValue={mockChangeConfigValue}
      />
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  test('should render select question settings', () => {
    const wrapper = shallow(
      <QuestionSettings
        id={3}
        config={FormConfig}
        changeConfigValue={mockChangeConfigValue}
      />
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  test('should render switch question settings', () => {
    const wrapper = shallow(
      <QuestionSettings
        id={4}
        config={FormConfig}
        changeConfigValue={mockChangeConfigValue}
      />
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  test('should render time picker question settings', () => {
    const wrapper = shallow(
      <QuestionSettings
        id={5}
        config={FormConfig}
        changeConfigValue={mockChangeConfigValue}
      />
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  test('should render date picker question settings', () => {
    const wrapper = shallow(
      <QuestionSettings
        id={6}
        config={FormConfig}
        changeConfigValue={mockChangeConfigValue}
      />
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  test('should render radio question settings', () => {
    const wrapper = shallow(
      <QuestionSettings
        id={7}
        config={FormConfig}
        changeConfigValue={mockChangeConfigValue}
      />
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });


  test('should change the required boolean for a form question', () => {
    const wrapper = shallow(
      <QuestionSettings
        id={1}
        config={FormConfig}
        changeConfigValue={mockChangeConfigValue}
      />
    );
    wrapper.instance().changeRequiredValue({
      target: {
        checked: true
      }
    });
    expect(mockChangeConfigValue.mock.calls[0]).toMatchSnapshot();
    wrapper.instance().changeRequiredValue({
      target: {
        checked: false
      }
    });
    expect(mockChangeConfigValue.mock.calls[1]).toMatchSnapshot();
  });

  test('should change the required boolean for a form question', () => {
    const wrapper = shallow(
      <QuestionSettings
        id={1}
        config={FormConfig}
        changeConfigValue={mockChangeConfigValue}
      />
    );
    wrapper.setState({
      selectedInputRule: 'email'
    });
    wrapper.instance().changeSelectedInputRule('url')();
    expect(mockChangeConfigValue.mock.calls[0]).toMatchSnapshot();
  });

  test('should change and add an option in radio button settings', () => {
    const wrapper = shallow(
      <QuestionSettings
        id={1}
        config={FormConfig}
        changeConfigValue={mockChangeConfigValue}
      />
    );
    wrapper.instance().changeRadioOption("NEW_OPTION");
    expect(wrapper.state().currentRadioInput).toEqual('NEW_OPTION');
    wrapper.instance().addRadioOption(1)('NEW_OPTION');
    expect(mockChangeConfigValue.mock.calls[0]).toMatchSnapshot();
  });

});