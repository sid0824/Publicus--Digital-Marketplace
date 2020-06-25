import toJson from 'enzyme-to-json';
import React from "react";
import {shallow, configure} from 'enzyme';
import { message } from 'antd';
import Adapter from 'enzyme-adapter-react-16';
import { AuthenticatedRoute } from "../AuthenticatedRoute";

configure({ adapter: new Adapter() });

jest.mock('antd');

describe('Authenticated Route', () => {

  beforeEach(() => {

  });

  afterAll(() => {

  });

  test('should render authorised authenticated route', () => {
    const wrapper = shallow(
      <AuthenticatedRoute
        component={<div>Component</div>}
        authenticated
        other={'props'}
      />
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  test('should redirect on un-authorised authenticated route', () => {
    const wrapper = shallow(
      <AuthenticatedRoute
        component={<div>Component</div>}
        authenticated={false}
        other={'props'}
      />
    );
    const redirect = wrapper.props().render({ other: 'value '});
    expect(message.warning).toHaveBeenCalledWith('Login With an Account To Access this Page');
    expect(toJson(wrapper)).toMatchSnapshot();
    expect(toJson(shallow(redirect))).toMatchSnapshot();
  });


});