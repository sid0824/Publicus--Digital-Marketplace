import React from "react";
import { withCreateFormContext } from "../context/CreateFormContext";
import { Icon, Popover } from "antd";
import QuestionSettings from "./QuestionSettings";
import FormComponent from "../../../components/FormComponent";

/**
 * Used for displaying form fields whilst creating a form. Allows for deleting of fields and altering of
 * settings.
 */
export class CreateFormComponent extends React.Component {

  /**
   * Delete the given question from the form
   * @param id of the question
   */
  deleteQuestion = (id) => () => {
    const { config, changeConfig } = this.props;
    delete config[id];
    changeConfig(config);
  };

  render() {
    const { config, id, form, moveFormItemUp, moveFormItemDown } = this.props;
    const question = config[id];
    let component = <FormComponent
      id={id}
      question={question}
      form={form}
    />;

    return (
      <div key={id}>
        <strong>{id}. </strong>
        {question.prompt}
        <br />
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <div style={{ minWidth: 500 }}>
            {component}
          </div>
          <Icon
            style={{ fontSize: 20, color: 'red', marginLeft: 10, marginTop: 10 }}
            type="delete"
            onClick={this.deleteQuestion(id)}
          />
          <Icon
            style={{ fontSize: 20, color: '#4296f5', marginLeft: 10, marginTop: 10 }}
            onClick={moveFormItemUp(id)}
            type="up"
          />
          <Icon
            style={{ fontSize: 20, color: '#4296f5', marginLeft: 10, marginTop: 10 }}
            onClick={moveFormItemDown(id)}
            type="down"
          />
          <Popover placement="right" trigger="click" content={<QuestionSettings id={id} />} title={`Settings`}>
            <Icon
              style={{ fontSize: 20, color: 'grey', marginLeft: 10, marginTop: 10  }}
              type="setting"
            />
          </Popover>
        </div>
      </div>
    );
  }
}
export default withCreateFormContext(CreateFormComponent);