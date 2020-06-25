import React from "react";
import { Select } from "antd";
import {withCreateFormContext} from "../context/CreateFormContext";

const { Option } = Select;

/**
 * Component used in form creation to select the values for which a 'select' form item
 * will be able to choose.
 */
export class SelectValuesSelector extends React.Component {

  state = {
    currentInput: ''
  };

  /**
   * Used to update the options for the select
   * @param options - The options for the select
   */
  onChange = (options) => {
    const { changeConfigValue, id } = this.props;
    changeConfigValue(id, 'options', options);
    this.setState({
      currentTagInput: ''
    })
  };

  /**
   * Used to save the value of the current select option being typed
   * @param currentInput - The value of the current selection option being typed
   */
  onSearch = (currentInput) => {
    this.setState({
      currentInput
    })
  };

  render() {
    const { id, config } = this.props;
    const { currentInput } = this.state;

    return (
      <Select
        mode="multiple"
        size="default"
        placeholder="Add values for the select"
        defaultValue={[]}
        value={config[id].options}
        onSearch={this.onSearch}
        onChange={this.onChange}
        style={{ width: '100%' }}
        {...(!currentInput ? { dropdownRender: () => { return <div /> }} : {})}
      >
        {currentInput ? <Option key={currentInput}>{currentInput}</Option> : null}
      </Select>
    )
  }
}

export default withCreateFormContext(SelectValuesSelector);