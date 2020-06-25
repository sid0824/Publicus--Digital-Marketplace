import toJson from 'enzyme-to-json';
import React from "react";
import {shallow, configure} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import {API} from "aws-amplify";
import Results from '../../../fixtures/Results'
import FormConfig from '../../../fixtures/FormConfig'
import ViewResults from "../index";
import download from 'js-file-download';

configure({ adapter: new Adapter() });

jest.mock('js-file-download');

describe('ViewResults', () => {

  beforeEach(() => {
    API.get = jest.fn().mockImplementation((name, path, options) => {
      return path.includes('results')
        ? Results
        : { form: escape(JSON.stringify(FormConfig)) }
    })
  });

  afterEach(() => {

  });

  test('should render view results page', (done) => {
    const wrapper = shallow(
      <ViewResults
        location={{
          search: 'SURVEY_ID'
        }}
      />
    );
    setTimeout(() => {
      expect(toJson(wrapper)).toMatchSnapshot();
      expect(wrapper.state()).toMatchSnapshot();
      done();
    });
  });

  test('should download results as csv', (done) => {
    const wrapper = shallow(
      <ViewResults
        location={{
          search: 'SURVEY_ID'
        }}
      />
    );
    setTimeout(() => {
      wrapper.instance().export();
      expect(download.mock.calls[0]).toMatchSnapshot();
      done();
    });
  });

});