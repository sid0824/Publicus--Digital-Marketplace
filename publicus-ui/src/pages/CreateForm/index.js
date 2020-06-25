import React from 'react';
import { Button, Dropdown, Icon, Menu, Form, Input, InputNumber, message, Select } from "antd";
import CreateFormFields from "./components/CreateFormFields";
import { API } from "aws-amplify";
import {withRouter} from "react-router-dom";
import RoutePaths from "../../core/RoutePaths";
import {parse} from "query-string";
import {ApiName} from "../../core/Config";

const { TextArea } = Input;
const { Option } = Select;

export const InputTypes = {
  TextInput: 'textInput',
  NumberInput: 'numberInput',
  Select: 'select',
  Switch: 'switch',
  TimePicker: 'timePicker',
  DatePicker: 'datePicker',
  Radio: 'radio'
};

/**
 * Returns the default settings for a form item based on its type
 * @param type - Form input type
 * @returns Default Settings for the input type
 */
const getDefaultValues = (type) => {
  switch(type) {
    case InputTypes.TextInput:
      return {
      };
    case InputTypes.Select:
      return {
        options: [] // add default selected options, max options selectable
      };
    case InputTypes.NumberInput:
      return {
        incrementor: 1,
        startingNumber: 0, // change to default value
        min: 0,
        max: 100
      };
    case InputTypes.TimePicker:
      return {
        prompt: 'What time is the...?'
      };
    case InputTypes.DatePicker:
      return {
        prompt: 'What date is the...?',
        showTime: false
      };
    case InputTypes.Radio:
      return {
        radioOptions: ['Placeholder']
      };
    default:
      return {
        defaultValue: false
      }
  }
};

/**
 * Page used to create a form to then be owned by the creating user
 */
export class CreateForm extends React.Component {

  state = {
    config: {}, // The current config of the form items
    currentTagInput: '',
    initialNameValue: {},
    initialDescriptionValue: {},
    initialPriceValue: {},
    initialTagsValue: {},
    initialRedirectValue: {},
    initialInstructionsValue: {},
    saving: false
  };

  componentDidMount = async () => {
    const { location } = this.props;
    const parsed = parse(location.search);
    const { surveyId } = parsed;
    if (surveyId) {
      try {
        const editForm = await API.get(ApiName, `/survey/${surveyId}`, {});
        const { description, form, name, price, redirect, tags, instructions } = editForm;
        this.setState({
          config: JSON.parse(unescape(form)),
          initialNameValue: { initialValue: unescape(name) },
          initialDescriptionValue: { initialValue: unescape(description) },
          initialPriceValue: { initialValue: price },
          initialTagsValue: { initialValue: tags.map(tag => tag.tag) },
          initialRedirectValue: { initialValue: unescape(redirect) },
          initialInstructionsValue: { initialValue: unescape(instructions) },
        })
      } catch (err) {
        console.error(err);
        message.error('Failed to load form data');
      }
    }
  };

  /**
   * Handles adding a new item to the form with the specified type
   * @param event - Event containing the type of input type to add
   */
  handleAddNew = (event) => {
    const { config } = this.state;
    const newId = Object.keys(config).length + 1;
    const type = event.key;
    config[newId] = {
      type,
      rules: [],
      prompt: 'What is Your... ?',
      ...getDefaultValues(type)
    };
    this.setState({
      config
    })
  };

  /**
   * Handles the updating of the form config
   * @param config - New Form Config
   */
  changeConfig = (config) => {
    this.setState({
      config
    })
  };

  /**
   * Saves the generated form config and redirects to MyForms page
   */
  onSubmit = async (e) => {
    e.preventDefault();
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        this.setState({
          saving: true
        });
        try {
          const { config } = this.state;
          const { history, location } = this.props;
          const parsed = parse(location.search);
          const { surveyId } = parsed;
          if (surveyId) {
            await API.put("prod-publicus-app-api", `/survey/${surveyId}`, {
              body: {
                ...values,
                form: config,
                surveyId
              },
            });
          } else {
            await API.post("prod-publicus-app-api", "/survey", {
              body: {
                ...values,
                form: config,
              },
            });
          }
          message.success('Saved Form Successfully!');
          setTimeout(() => {
            history.push(RoutePaths.MyForms)
          }, 1000)
        } catch (err) {
          message.error(err.message);
          console.error(err);
        }
        this.setState({
          saving: false
        });
      }
    });
  };

  /**
   * Resets the value of the current tag be added to empty
   */
  resetCurrentTag = () => {
    this.setState({
      currentTagInput: ''
    })
  };

  /**
   * Updates the value of the current tag input
   * @param currentTagInput - new tag input
   */
  onChangeCurrentTag = (currentTagInput) => {
    this.setState({
      currentTagInput
    })
  };

  render() {
    const { config, currentTagInput,
      initialNameValue,
      initialDescriptionValue,
      initialPriceValue,
      initialTagsValue,
      initialRedirectValue,
      initialInstructionsValue,
      saving
    } = this.state;
    const { form } = this.props;
    const { getFieldDecorator } = form;

    const menu = (
      <Menu onClick={this.handleAddNew}>
        <Menu.Item key={InputTypes.TextInput}>Text Input</Menu.Item>
        <Menu.Item key={InputTypes.NumberInput}>Number Input</Menu.Item>
        <Menu.Item key={InputTypes.Select}>Select</Menu.Item>
        <Menu.Item key={InputTypes.Switch}>Switch</Menu.Item>
        <Menu.Item key={InputTypes.TimePicker}>Time Picker</Menu.Item>
        <Menu.Item key={InputTypes.DatePicker}>Date Picker</Menu.Item>
        <Menu.Item key={InputTypes.Radio}>Radio Button</Menu.Item>
      </Menu>
    );

    return(
      <Form onSubmit={this.onSubmit} style={{ marginLeft: 'calc(50% - 250px)', marginRight: 'calc(50% - 250px)', marginTop: 10 }}>
        <h1>Form Details</h1>
        Form Name
        <Form.Item>
          {getFieldDecorator('name', {
            rules: [{required: 'true', message: "Please Enter a form name..."}],
            ...initialNameValue
          })(
            <Input
              style={{ width: 500 }}
              placeholder={"Enter the form name"}
            />
          )}
        </Form.Item>
        Form Description
        <Form.Item>
          {getFieldDecorator('description', {
            rules: [{required: 'true', message: "Please enter a form description..."}],
            ...initialDescriptionValue
          })(
            <TextArea
              rows={3}
              style={{ width: 500 }}
              placeholder={"Enter the form description"}
            />
          )}
        </Form.Item>
        Form Price ($)
        <Form.Item>
          {getFieldDecorator('price', {
            rules: [{required: 'true', message: "Please enter a form price..."}],
            ...initialPriceValue
          })(
            <InputNumber
              style={{ width: 500 }}
              max={500}
              min={0}
            />
          )}
        </Form.Item>
        Form Tags
        <Form.Item>
          {getFieldDecorator('tags', {
            ...initialTagsValue
          })(
            <Select
              style={{ width: 500 }}
              mode="multiple"
              size="default"
              placeholder="Add tags to the form"
              onSearch={this.onChangeCurrentTag}
              onChange={this.resetCurrentTag}
              {...(!currentTagInput ? { dropdownRender: () => { return <div /> }} : {})}
            >
              {currentTagInput ? <Option key={currentTagInput}>{currentTagInput}</Option> : null}
            </Select>
          )}
        </Form.Item>
        Redirect URL (Optional)
        <Form.Item>
          {getFieldDecorator('redirect', {
            rules: [{type: 'url', message: "Enter a valid url"}],
            ...initialRedirectValue
          })(
            <Input
              style={{ width: 500 }}
              placeholder={"Enter a url to redirect on form complete"}
            />
          )}
        </Form.Item>
        User Instructions (Optional)
        <Form.Item>
          {getFieldDecorator('instructions', {
            ...initialInstructionsValue
          })(
            <TextArea
              rows={3}
              style={{ width: 500 }}
              placeholder={"Enter instructions for users at the top of the form"}
            />
          )}
        </Form.Item>
        <br />
        <CreateFormFields
          config={config}
          changeConfig={this.changeConfig}
        />
        <br />
        <br />
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              style={{ marginRight: 5 }}
              loading={saving}
            >
              Save
            </Button>
          </Form.Item>
          <Dropdown overlay={menu} trigger={["click"]}>
            <Button style={{ marginTop: 4 }}>
              Create New Field <Icon type="down" />
            </Button>
          </Dropdown>
        </div>
        <br />
        <br />
        <br />
      </Form>
    )
  }
}

export default withRouter(Form.create()(CreateForm));