import toJson from 'enzyme-to-json';
import { AdministrationRoute } from "../AdministrationRoute";
import React from "react";
import {shallow, configure} from 'enzyme';
import { message } from 'antd';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

jest.mock('antd');

describe('Administration Route', () => {

  beforeEach(() => {

  });

  afterAll(() => {

  });

  test('should render authorised admin route', () => {
    const wrapper = shallow(
      <AdministrationRoute
        component={<div>Component</div>}
        authenticated
        adminUser
        other={'props'}
      />
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  test('should redirect on unauthorised admin route', () => {
    const wrapper = shallow(
      <AdministrationRoute
        component={<div>Component</div>}
        authenticated={false}
        adminUser={false}
        other={'props'}
      />
    );
    const redirect = wrapper.props().render({ other: 'value '});
    expect(message.warning).toHaveBeenCalledWith('Login With an Admin Account To Access this Page');
    expect(toJson(wrapper)).toMatchSnapshot();
    expect(toJson(shallow(redirect))).toMatchSnapshot();
  });

});