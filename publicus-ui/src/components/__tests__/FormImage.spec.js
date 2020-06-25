import toJson from 'enzyme-to-json';
import React from "react";
import {shallow, configure} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import FormImage from "../FormImage";

configure({ adapter: new Adapter() });

describe('Form Image', () => {

  beforeEach(() => {

  });

  afterAll(() => {

  });

  test('should render form image', () => {
    const wrapper = shallow(
      <FormImage
        image={"https://mock-path.png"}
      />
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  test('should use default form image on error', () => {
    const wrapper = shallow(
      <FormImage
        image={"https://mock-path.png"}
      />
    );
    wrapper.instance().onError();
    expect(wrapper.state()).toMatchSnapshot();
  });


});