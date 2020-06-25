import toJson from 'enzyme-to-json';
import React from "react";
import {shallow, configure} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { UserAvatar } from "../UserAvatar";

configure({ adapter: new Adapter() });

describe('User Avatar', () => {

  beforeEach(() => {

  });

  afterAll(() => {

  });

  test('should render current user avatar', () => {
    const wrapper = shallow(
      <UserAvatar
        height={100}
        width={100}
        avatar={"https://mock-path.png"}
      />
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });


  test('should default form url on error', () => {
    const wrapper = shallow(
      <UserAvatar
        height={100}
        width={100}
        avatar={"https://mock-path.png"}
      />
    );
    wrapper.instance().onError();
    expect(wrapper.state()).toMatchSnapshot();
  });


});