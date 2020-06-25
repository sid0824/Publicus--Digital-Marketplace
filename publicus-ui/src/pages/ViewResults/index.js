import React from 'react';
import { API } from "aws-amplify";
import { parse } from "query-string";
import {Button, Collapse, message, Icon} from "antd";
import moment from "moment";
import { ApiName } from "../../core/Config";
import { Parser } from 'json2csv';
import download from 'js-file-download';

const { Panel } = Collapse;

/**
 * Page used to view results for a form owned or purchased by a user
 */
class ViewResults extends React.Component {

  state = {
    results: null // - The formatted results of the form
  };

  /**
   * Fetches form config and results data and formats it into answer string, prompt string and submission time
   * @returns {Promise<void>}
   */
  componentDidMount = async () => {
    const { location } = this.props;
    const parsed = parse(location.search);
    const { surveyId } = parsed;
    const promises = await Promise.all([
      API.get(ApiName, `/results/${surveyId}`, {}),
      API.get(ApiName, `/survey/${surveyId}`, {})
    ]);
    const results = promises[0];
    const survey = promises[1];
    const surveyConfig = JSON.parse(unescape(survey.form));
    this.setState({
      results: results.map(result => {
        const resultsJson = JSON.parse(unescape(result.results));
        return {
          submissionTime: result.submissionTime,
          data: Object.keys(resultsJson).map(id => {
            const answer = resultsJson[id];
            const prompt = surveyConfig[id].prompt;
            const type = surveyConfig[id].type;
            return {
              answer,
              prompt,
              type
            }
          })
        }
      })
    })
  };

  /**
   * Exports the existing data as a CSV file to the user
   */
  export = () => {
    const results = JSON.parse(JSON.stringify(this.state.results));
    if (results.length) {
      const formattedResults = results.map(result => {
        const formatted = {};
        result.data.forEach(answer => {
          formatted[answer.prompt] = answer.answer
        });
        return {
          submissionTime: result.submissionTime,
          ...formatted
        }
      });
      const parser = new Parser(Object.keys(formattedResults));
      const csv = parser.parse(formattedResults);
      download(csv, 'resultsData.csv');
    } else {
      message.error('No results to download')
    }
  };

  /**
   * Formats a response based on the variable type of the question
   * @param question - to format
   */
  formatAnswer = (question) => {
    if (question.type === 'switch') {
      const value = !!question.answer;
      return value.toString();
    }
    if (question.type === 'timePicker') {
      return question.answer
        ? moment(question.answer).format('h:mm:ss a')
        : null
    }
    if (question.type === 'datePicker') {
      return question.answer
        ? moment(question.answer).format('MMMM Do YYYY, h:mm:ss a')
        : null
    }
    return question.answer;
  };

  render() {
    const { results } = this.state;
    if (!results) {
      return <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', paddingTop: 200 }}>
        <Icon type="loading" style={{ fontSize: 70, marginTop: 8 }} />
      </div>
    }
    return (
      <div style={{ margin: 10 }}>
        <h1>Results</h1>
        <Button type="primary" onClick={this.export}>Download Results</Button>
        <br />
        <br />
        {results.length
          ? <Collapse accordion>
            {results.map((result, index) => {
              const content = result.data.map(question => {
                return (
                  <span>
                    <strong>{question.prompt}: </strong> {this.formatAnswer(question)}
                    <br />
                  </span>
                )
              });
              return (
                <Panel header={`Result Received at ${moment(result.submissionTime).format('MMMM Do YYYY, h:mm:ss a')}`} key={index}>
                  <p>{content}</p>
                </Panel>
              )
            })}
          </Collapse>
          : <strong>No Results to View</strong>
        }
      </div>
    )
  }
}

export default ViewResults;