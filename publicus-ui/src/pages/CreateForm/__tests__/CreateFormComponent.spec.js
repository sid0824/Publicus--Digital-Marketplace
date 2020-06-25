import toJson from 'enzyme-to-json';
import React from "react";
import {shallow, configure} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import {CreateFormComponent} from "../components/CreateFormComponent";
import FormConfig from '../../../fixtures/FormConfig';

configure({ adapter: new Adapter() });

const mockMoveFormItemUp = jest.fn();
const mockMoveFormItemDown = jest.fn();
const mockChangeConfig = jest.fn();

describe('CreateFormComponent', () => {

  beforeEach(() => {

  });

  afterEach(() => {
    mockChangeConfig.mockReset();
  });

  test('should render a create form component', () => {
    const wrapper = shallow(
      <CreateFormComponent
        form={'form'}
        config={FormConfig}
        id={1}
        moveFormItemUp={mockMoveFormItemUp}
        moveFormItemDown={mockMoveFormItemDown}
      />
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  test('should delete a create form question', () => {
    const wrapper = shallow(
      <CreateFormComponent
        form={'form'}
        config={FormConfig}
        id={1}
        moveFormItemUp={mockMoveFormItemUp}
        moveFormItemDown={mockMoveFormItemDown}
        changeConfig={mockChangeConfig}
      />
    );
    wrapper.instance().deleteQuestion(2)();
    expect(mockChangeConfig.mock.calls[0][0]).toMatchSnapshot();
  });

});