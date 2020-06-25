import toJson from 'enzyme-to-json';
import React from "react";
import {shallow, configure} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import {App} from "./App";
import {API, Auth} from "aws-amplify";

configure({ adapter: new Adapter() });

const userValues = {
  "userId": "ap-southeast-2:91ecfa27-a7c0-45a8-9f45-c93885409ca7",
  "email": "publicusnoreply@gmail.com",
  "admin": 1,
  "avatar": "https://publicus-file-uploads.s3.amazonaws.com/avatar/9b82dbf0-f47b-11e9-a70a-e16b9b703746",
  "firstname": "Admin",
  "lastname": "Account"
};

describe('App', () => {

  let wrapper;
  beforeEach(() => {
    Auth.currentSession = jest.fn().mockResolvedValue(null);
    Auth.signOut = jest.fn().mockResolvedValue(null);
    API.get = jest.fn().mockResolvedValue(userValues);
    wrapper = shallow(
      <App
        location={{
          pathName: 'myForms'
        }}
      />
    );
  });

  test('should render authorised admin route', (done) => {
    setTimeout(() => {
      expect(toJson(wrapper)).toMatchSnapshot();
      done();
    })
  });


  test('should log out of the site', (done) => {
    setTimeout(async () => {
      await wrapper.instance().signOut();
      expect(wrapper.state()).toMatchSnapshot();
      done();
    })
  });

});