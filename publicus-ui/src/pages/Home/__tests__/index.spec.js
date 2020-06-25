import toJson from 'enzyme-to-json';
import React from "react";
import {shallow, configure} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import {Home} from "../index";

configure({ adapter: new Adapter() });


describe('Home', () => {

  beforeEach(() => {

  });

  afterEach(() => {

  });

  test('should render authenticated home page', () => {
    const wrapper = shallow(
      <Home
        authenticated
      />
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  test('should render un-authenticated home page', () => {
    const wrapper = shallow(
      <Home
        authenticated={false}
      />
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });

});