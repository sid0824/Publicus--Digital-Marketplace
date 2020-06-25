import React from 'react';
import {CreateFormContext} from "../context/CreateFormContext";
import {Form} from "antd";
import CreateFormComponent from "./CreateFormComponent";

/**
 * Component used to wrap all form fields in the create form page. Provides form config and altering functions
 * through context to all children components.
 */
export class CreateFormFields extends React.Component {

  /**
   * Alter a specific field in the config of the form being created
   * @param id - the id of the form item being altered
   * @param field - the field on the form item being altered
   * @param value - the new value of the field being altered
   */
  changeConfigValue = (id, field, value) => {
    const { config, changeConfig } = this.props;
    config[id][field] = value;
    changeConfig(config);
  };

  /**
   * Moves a form item up in the list
   * @param stringId - id of form component to move
   */
  moveFormItemUp = (stringId) => () => {
    const { config, changeConfig } = this.props;
    const id = parseInt(stringId);
    if (id !== 1) {
      const upper = Object.assign({}, config[id - 1]);
      config[id - 1] = Object.assign({}, config[id]);
      config[id] = upper;
      changeConfig(config);
    }
  };

  /**
   * Moves a form item down in the list
   * @param stringId - id of form component to move
   */
  moveFormItemDown = (stringId) => () => {
    const { config, changeConfig } = this.props;
    const id = parseInt(stringId);
    if (id !== Object.keys(config).length) {
      const upper = Object.assign({}, config[id]);
      config[id] = Object.assign({}, config[id + 1]);
      config[id + 1] = upper;
      changeConfig(config);
    }
  };

  render() {
    const { form, changeConfig, config } = this.props;
    const context = {
      config,
      form,
      changeConfig,
      changeConfigValue: this.changeConfigValue,
      moveFormItemUp: this.moveFormItemUp,
      moveFormItemDown: this.moveFormItemDown
    };

    return (
      <CreateFormContext.Provider value={context}>
        <h1>Form Fields</h1>
        <Form onSubmit={() => {}}>
          {Object.keys(config).length
            ? Object.keys(config)
            .sort((a, b) => {
              return (a-b <= 0)
            }).map(id => <CreateFormComponent key={id} id={id} />)
            : 'Select "Create New Field" to begin adding form fields'
          }
        </Form>
      </CreateFormContext.Provider>
    )
  }
}


export default Form.create()(CreateFormFields);