import toJson from 'enzyme-to-json';
import React from "react";
import {shallow, configure} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { CreateFormFields } from "../components/CreateFormFields";
import FormConfig from '../../../fixtures/FormConfig';

configure({ adapter: new Adapter() });

const mockChangeConfig = jest.fn();

describe('CreateFormFields', () => {

  let wrapper;
  beforeEach(() => {
    wrapper = shallow(
      <CreateFormFields
        config={FormConfig}
        form={'MOCK_FORM'}
        changeConfig={mockChangeConfig}
      />
    );
  });

  afterEach(() => {
    mockChangeConfig.mockReset();
  });

  test('should render create form fields', () => {
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  test('should move form item up', () => {
    wrapper.instance().moveFormItemUp("2")();
    expect(mockChangeConfig.mock.calls[0][0]).toMatchSnapshot();
  });

  test('should move form item down', () => {
    wrapper.instance().moveFormItemDown("4")();
    expect(mockChangeConfig.mock.calls[0][0]).toMatchSnapshot();
  });

  test('should change create form config value', () => {
    wrapper.instance().changeConfigValue(1, "type", "NEW_TYPE");
    expect(mockChangeConfig.mock.calls[0][0][1]).toMatchSnapshot();
  });

});