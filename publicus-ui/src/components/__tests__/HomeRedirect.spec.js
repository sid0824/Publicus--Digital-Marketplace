import toJson from 'enzyme-to-json';
import React from "react";
import {shallow, configure} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import HomeRedirect from "../HomeRedirect";

configure({ adapter: new Adapter() });

describe('Home Redirect', () => {

  beforeEach(() => {

  });

  afterAll(() => {

  });

  test('should render home redirect', () => {
    const wrapper = shallow(
      <HomeRedirect />
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });

});