import toJson from 'enzyme-to-json';
import React from "react";
import {shallow, configure} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { SelectValuesSelector } from "../components/SelectValuesSelector";
import FormConfig from '../../../fixtures/FormConfig';

configure({ adapter: new Adapter() });

const mockChangeConfigValue = jest.fn();

describe('SelectValuesSelector', () => {

  beforeEach(() => {

  });

  afterEach(() => {

  });

  test('should render select values selector', () => {
    const wrapper = shallow(
      <SelectValuesSelector
        id={3}
        config={FormConfig}
      />
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  test('should add new select value option', () => {
    const wrapper = shallow(
      <SelectValuesSelector
        id={3}
        config={FormConfig}
        changeConfigValue={mockChangeConfigValue}
      />
    );
    wrapper.instance().onChange(['option1', 'option2']);
    expect(mockChangeConfigValue.mock.calls[0]).toMatchSnapshot();
    expect(wrapper.state()).toMatchSnapshot();
  });

  test('should update current select value option', () => {
    const wrapper = shallow(
      <SelectValuesSelector
        id={3}
        config={FormConfig}
        changeConfigValue={mockChangeConfigValue}
      />
    );
    wrapper.instance().onSearch('option1');
    expect(mockChangeConfigValue.mock.calls[0]).toMatchSnapshot();
    expect(wrapper.state()).toMatchSnapshot();
  });

});