import React, { Component } from "react";
import {
  BarChart, Bar, Label, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';
import './statspage.css';
import {Container} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";


class StatsPage extends Component {

  constructor(props) {
    super(props);
    this.state = { apiResponse: "", data: [] };
  }

  callAPI = async () => {
    const response = await fetch('/api/statsPerDate');
    const data = await response.json();
    this.setState({
      data
    });
  };

  componentWillMount() {
    this.callAPI();
  }




  render() {
    const { data } = this.state;
    return(
      <React.Fragment>

      <div className={'header'}>
        <Container maxWidth={"sm"}>
          <Typography variant="h3" align="center" color="textPrimary" gutterBottom>
            Publicus Register Stats
          </Typography>
        </Container>
      </div>

      <div className='Chart' align={'center'}>
      <BarChart
        width={500}
        height={300}
        data={data}
        margin={{
          top: 5, right: 30, left: 20, bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="count_date"/>
        <YAxis label={{ value: 'No. Registrations Per Day', angle: -90, position: 'insideLeft', textAnchor: 'middle' }} />
        <Tooltip />
        <Legend />
        <Bar dataKey="count" fill="#8884d8" />
      </BarChart>
    </div>
      </React.Fragment>
    );
  }
}

{/*<div>*/}
{/*  {this.state.data.map((item, index) => {*/}
{/*    return <div>*/}
{/*      <h1>{item.count_date}</h1>*/}
{/*      <p>{item.count}</p>*/}
{/*    </div>*/}
{/*  })}*/}
{/*</div>*/}

export default StatsPage;
