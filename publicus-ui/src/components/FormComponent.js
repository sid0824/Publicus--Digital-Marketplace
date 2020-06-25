import React from "react";
import { InputTypes } from "../pages/CreateForm";
import {
  DatePicker,
  Form,
  Input,
  InputNumber,
  Radio,
  Select,
  Switch,
  TimePicker
} from "antd";
const { Option } = Select;

// The types of string inputs currently available
export const ruleTypes = ["email", "number", "url"];

// Converts the list of supplied rules into a format that the form item can understand and apply
const generateFormItemRules = rules => {
  const formattedRules = [];
  rules.forEach(rule => {
    if (ruleTypes.includes(rule)) {
      formattedRules.push({ type: rule, message: `Value must be a ${rule}` });
    }
    if (rule === "required") {
      formattedRules.push({
        required: true,
        message: `This field is compulsory`
      });
    }
  });
  return formattedRules;
};

/**
 * A generic form component used in both the complete form and create form pages. It renders a form item
 * based on the configuration given with the 'question' prop for a form belonging to the 'form' prop.
 */
class FormComponent extends React.Component {
  // Return the relevant form component based on the supplied props
  getFormComponent = () => {
    const { id, question, form } = this.props;
    const { getFieldDecorator } = form;
    switch (question.type) {
      case InputTypes.TextInput:
        return (
          <Form.Item>
            {getFieldDecorator(id, {
              rules: generateFormItemRules(question.rules)
            })(<Input style={{ width: 500 }} />)}
          </Form.Item>
        );
      case InputTypes.Select:
        return (
          <Form.Item>
            {getFieldDecorator(id, {
              rules: generateFormItemRules(question.rules)
            })(
              <Select style={{ width: 500 }}>
                {question.options.map(option => (
                  <Option key={option}>{option}</Option>
                ))}
              </Select>
            )}
          </Form.Item>
        );
      case InputTypes.NumberInput:
        return (
          <Form.Item>
            {getFieldDecorator(id, {
              rules: generateFormItemRules(question.rules),
              initialValue: question.startingNumber
            })(
              <InputNumber
                style={{ width: 500 }}
                step={question.incrementor}
                min={question.min}
                max={question.max}
              />
            )}
          </Form.Item>
        );
      case InputTypes.Switch:
        return (
          <Form.Item>
            {getFieldDecorator(id, {
              rules: generateFormItemRules(question.rules)
            })(<Switch />)}
          </Form.Item>
        );
      case InputTypes.TimePicker:
        return (
          <Form.Item>
            {getFieldDecorator(id, {
              rules: generateFormItemRules(question.rules)
            })(<TimePicker />)}
          </Form.Item>
        );
      case InputTypes.DatePicker:
        return (
          <Form.Item>
            {getFieldDecorator(id, {
              rules: generateFormItemRules(question.rules)
            })(
              <DatePicker
                {...(question.showTime
                  ? { showTime: true, format: "YYYY-MM-DD HH:mm:ss" }
                  : {})}
              />
            )}
          </Form.Item>
        );
      case InputTypes.Radio:
        return (
          <Form.Item>
            {getFieldDecorator(id, {
              rules: generateFormItemRules(question.rules)
            })(
              <Radio.Group>
                {question.radioOptions.map(option => (
                  <Radio value={option}>{option}</Radio>
                ))}
              </Radio.Group>
            )}
          </Form.Item>
        );
      default:
        return null;
    }
  };

  render() {
    return <div>{this.getFormComponent()}</div>;
  }
}

export default FormComponent;
