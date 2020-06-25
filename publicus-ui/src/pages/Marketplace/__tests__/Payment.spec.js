import toJson from 'enzyme-to-json';
import React from "react";
import {shallow, configure} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import {Payment} from "../components/Payment";
import { message } from 'antd';

configure({ adapter: new Adapter() });

const mockCreateToken = jest.fn();
const mockCheckout = jest.fn();

describe('Payment', () => {

  beforeEach(() => {
    mockCreateToken.mockReturnValue({
      token: {
        id: 'MOCK_ID'
      }
    });
    message.success = jest.fn();
    message.error = jest.fn();
  });

  afterEach(() => {
    mockCreateToken.mockReset();
    message.success.mockReset();
    message.error.mockReset();
    mockCheckout.mockReset();
  });

  test('should render marketplace payment', () => {
    const wrapper = shallow(
      <Payment
        stripe={{
          createToken: mockCreateToken
        }}
      />
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  test('should render purchase errors', () => {
    const wrapper = shallow(
      <Payment
        stripe={{
          createToken: mockCreateToken
        }}
      />
    );
    wrapper.instance().onChange({ error: { message: 'ERROR_MESSAGE' } });
    wrapper.update();
    expect(toJson(wrapper)).toMatchSnapshot();
    wrapper.instance().onChange({ error: null });
    wrapper.update();
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  test('should submit purchase', async () => {
    const wrapper = shallow(
      <Payment
        stripe={{
          createToken: mockCreateToken
        }}
        checkout={mockCheckout}
      />
    );
    await wrapper.instance().submit({ preventDefault: () => {} });
    expect(mockCheckout).toHaveBeenCalledWith('MOCK_ID');
    expect(message.success).toHaveBeenCalledWith('Successfully Purchased Surveys')
  });

  test('should give error on bad purchase', async () => {
    const wrapper = shallow(
      <Payment
        stripe={{
          createToken: mockCreateToken
        }}
        checkout={mockCheckout}
      />
    );
    mockCreateToken.mockImplementation(() => {
      throw new Error('ERROR')
    });
    await wrapper.instance().submit({ preventDefault: () => {} });
    expect(message.error).toHaveBeenCalledWith('ERROR')
  });

});