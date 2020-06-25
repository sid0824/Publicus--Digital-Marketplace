import React from "react";
import { withCreateFormContext } from "../context/CreateFormContext";
import {Checkbox, Input, InputNumber, Select} from "antd";
import SelectValuesSelector from "./SelectValuesSelector";
import { capitaliseFirstLetter } from "../../../util/GeneralUtil";
import { InputTypes } from "../index";
import { ruleTypes } from '../../../components/FormComponent';

const { Option } = Select;

/**
 * Component to render the settings for each form item in the create form page
 */
export class QuestionSettings extends React.Component {

  getValues = () => {
    const { config, id } = this.props;
    let selectedInputRule = '';
    const question = config[id];
    question.rules.forEach(rule => {
      if (ruleTypes.includes(rule)) {
        selectedInputRule = rule
      }
    });
    return {
      selectedInputRule, //The value of the text input type rule
      currentRadioInput: ''
    }
  };

  state = this.getValues();

  /**
   * Changes the currently selected input rule for a text input. Only allows one to be selected at a time
   * @param newInputRule - the new rule to be selected
   */
  changeSelectedInputRule = (newInputRule) => () => {
    const { config, changeConfigValue, id } = this.props;
    const { selectedInputRule } = this.state;
    const rules = config[id].rules.filter(rule => rule !== selectedInputRule);
    if (newInputRule !== selectedInputRule) {
      rules.push(newInputRule);
      this.setState({
        selectedInputRule: newInputRule
      })
    } else {
      this.setState({
        selectedInputRule: null
      })
    }
    changeConfigValue(id, 'rules', rules);
  };

  /**
   * Resets the value of the current tag be added to empty
   */
  addRadioOption = (id) => (e) => {
    const { changeConfigValue } = this.props;
    changeConfigValue(id, 'radioOptions', e);
    this.setState({
      currentRadioInput: ''
    })
  };

  /**
   * Updates the value of the current tag input
   * @param currentTagInput - new tag input
   */
  changeRadioOption = (currentRadioInput) => {
    this.setState({
      currentRadioInput
    })
  };

  /**
   * Returns the settings for a form item based on its configuration and input type
   * @returns Form Item Settings
   */
  getInputTypeSpecificSettings = () => {
    const { id , config, changeConfigValue } = this.props;
    const { selectedInputRule, currentRadioInput } =  this.state;
    const question = config[id];
    switch(question.type) {
      case InputTypes.TextInput:
        return <React.Fragment>
          <strong>Input Type</strong>
          <br />
          {ruleTypes.map((type, index) =>
            <React.Fragment key={index}>
              <Checkbox
                style={{width: 100}}
                checked={selectedInputRule === type}
                onChange={this.changeSelectedInputRule(type)}
              >
                {capitaliseFirstLetter(type)}
              </Checkbox>
              {index && index % 2 === 1 ? <br /> : null}
            </React.Fragment>
          )}
          <br />
        </React.Fragment>;
      case InputTypes.Select:
        return <React.Fragment>
          <strong>Possible Values <span style={{ color: 'red' }}>*</span></strong>
          <SelectValuesSelector
            id={id}
          />
        </React.Fragment>;
      case InputTypes.NumberInput:
        return <React.Fragment>
          <strong>Starting Number</strong>
          <br />
          <InputNumber
            style={{ width: 223 }}
            value={question.startingNumber}
            onChange={(e) => changeConfigValue(id, 'startingNumber', e)} // TODO - also set form value to update input
            min={question.min}
            max={question.max}
          />
          <br />
          <br />
          <strong>Minimum Value</strong>
          <br />
          <InputNumber
            style={{ width: 223 }}
            value={question.min}
            onChange={(e) => changeConfigValue(id, 'min', e)}
          />
          <br />
          <br />
          <strong>Maximum Value</strong>
          <br />
          <InputNumber
            style={{ width: 223 }}
            value={question.max}
            onChange={(e) => changeConfigValue(id, 'max', e)}
          />
        </React.Fragment>;
      case InputTypes.Switch:
        return <React.Fragment>
        </React.Fragment>;
      case InputTypes.DatePicker:
        return <React.Fragment>
          <Checkbox
            style={{width: 200}}
            checked={question.showTime}
            onChange={(e) => changeConfigValue(id, 'showTime', e.target.checked)}
          >
            <strong>Show Time</strong>
          </Checkbox>
        </React.Fragment>;
      case InputTypes.Radio:
        return <React.Fragment>
          <strong>Options</strong>
          <br />
          <Select
            style={{ width: 200 }}
            mode="multiple"
            size="default"
            value={question.radioOptions}
            placeholder="Add radio button options"
            onSearch={this.changeRadioOption}
            onChange={this.addRadioOption(id)}
            {...(!currentRadioInput ? { dropdownRender: () => { return <div /> }} : {})}
          >
            {currentRadioInput ? <Option key={currentRadioInput}>{currentRadioInput}</Option> : null}
          </Select>
        </React.Fragment>;
      default:
        return null;
    }
  };

  /**
   * Changes the value of the required rule for a form item
   * @param event - ChangeEvent
   */
  changeRequiredValue = (event) => {
    const { config, changeConfigValue, id } = this.props;
    const newRules =  event.target.checked
      ? [...config[id].rules, 'required']
      : config[id].rules.filter(rule => rule !== 'required');
    changeConfigValue(id, 'rules', newRules)
  };

  render() {
    const { id , config, changeConfigValue } = this.props;
    let content = this.getInputTypeSpecificSettings();
    return (
      <div>
        {
          config[id].type !== 'switch' && config[id].type !== 'radio'
            && <React.Fragment>
            <Checkbox
              checked={config[id].rules.includes('required')}
              onChange={this.changeRequiredValue}
            >
              <strong>Required Field</strong>
            </Checkbox>
            <br />
            <br />
          </React.Fragment>
        }
        <strong>Prompt</strong>
        <Input
          value={config[id].prompt}
          onChange={(e) => changeConfigValue(id, 'prompt', e.target.value)}
        />
        <br />
        <br />
        {content}
      </div>
    )
  }
}

export default withCreateFormContext(QuestionSettings);