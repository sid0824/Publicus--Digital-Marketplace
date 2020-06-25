import toJson from 'enzyme-to-json';
import React from "react";
import {shallow, configure} from 'enzyme';
import { message } from 'antd';
import Adapter from 'enzyme-adapter-react-16';
import {Marketplace} from "../index";
import {API} from "aws-amplify";
import Forms from '../../../fixtures/Forms';

configure({ adapter: new Adapter() });

const mockLocation = {
  search: "?search=medical"
};

describe('Marketplace', () => {

  let wrapper;
  beforeEach(() => {
    API.get = jest.fn().mockResolvedValue(Forms);
    API.post = jest.fn().mockResolvedValue(null);
    message.warning = jest.fn();
    message.success = jest.fn();
    wrapper = shallow(
      <Marketplace
        location={mockLocation}
      />
    );
  });

  afterEach(() => {
    API.get.mockReset();
    API.post.mockReset();
    message.warning.mockReset();
    message.success.mockReset();
  });

  test('should render marketplace with filtered forms', (done) => {
    setTimeout(() => {
      expect(toJson(wrapper)).toMatchSnapshot();
      expect(wrapper.state()).toMatchSnapshot();
      done();
    });
  });

  test('should give error on search failure', async (done) => {
    API.get.mockImplementation(() => {
      throw new Error('ERROR');
    });
    await wrapper.instance().componentDidMount();
    setTimeout(() => {
      expect(toJson(wrapper)).toMatchSnapshot();
      expect(wrapper.state()).toMatchSnapshot();
      done();
    });
  });

  test('should filter marketplace when search prop updates', async (done) => {
    setTimeout(async () => {
      await wrapper.setProps({
        location: {
          search: "?search=new"
        }
      });
      expect(API.get).toHaveBeenCalledTimes(2);
      expect(wrapper.state().search).toEqual('new');
      done();
    });
  });

  test('should load more search data on button press', async (done) => {
    setTimeout(async () => {
      await wrapper.instance().onLoadMore();
      expect(API.get).toHaveBeenCalledTimes(2);
      expect(wrapper.state().currentPage).toEqual(1);
      done();
    });
  });

  test('should add forms to the cart', async (done) => {
    setTimeout(async () => {
      wrapper.instance().addToCart(Forms[0])({ stopPropagation: () => {}});
      expect(message.success).toHaveBeenCalledWith('Added to cart');
      wrapper.instance().addToCart(Forms[0])({ stopPropagation: () => {}});
      expect(message.warning).toHaveBeenCalledWith('Item is already in the cart');
      expect(wrapper.state().cart).toHaveLength(1);
      done();
    });
  });

  test('should checkout the cart and purchase forms', async (done) => {
    setTimeout(async () => {
      wrapper.setState({
        cart: [Forms[0]]
      });
      await wrapper.instance().checkout('TOKEN_ID');
      expect(API.post.mock.calls[0]).toMatchSnapshot();
      done();
    });
  });

  test('should handle submitting of new comments', async (done) => {
    setTimeout(async () => {
      await wrapper.instance().selectForm(Forms[0])();
      API.get.mockResolvedValue([
        {
          "commentId": 34,
          "surveyId": "13d79740-f60b-11e9-a5aa-5b08c1ff790b",
          "userId": "ap-southeast-2:91ecfa27-a7c0-45a8-9f45-c93885409ca7",
          "comment": "TEST IMAGE",
          "submissionTime": "2019-10-24T03:57:05.000Z"
        }
      ]);
      wrapper.instance().updateComment({
        target: {
          value: 'NEW_COMMENT'
        }
      });
      await wrapper.instance().handleSubmitComment();
      expect(API.post.mock.calls[0]).toMatchSnapshot();
      expect(API.get.mock.calls[1]).toMatchSnapshot();
      expect(wrapper.state()).toMatchSnapshot();
      done();
    });
  });

  test('should remove form from marketplace', async (done) => {
    setTimeout(async () => {
      await wrapper.instance().removeFromMarketplace(Forms[0])({ stopPropagation: () => {} });
      expect(API.post.mock.calls[0]).toMatchSnapshot();
      expect(wrapper.state().forms).toHaveLength(3);
      done();
    });
  });

});