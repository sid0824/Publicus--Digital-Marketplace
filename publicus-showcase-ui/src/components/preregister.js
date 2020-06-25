import './preregister.css';
import React, { Component } from "react";
import MenuItem from '@material-ui/core/MenuItem';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import {Container} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import { Redirect } from 'react-router-dom';
import moment from "moment";

class PreRegister extends Component {
  constructor(props) {
    super(props);
    this.state = {
        Date: moment().format("MMM Do YY"),
        FirstName: '',
        LastName: '',
        Email: '',
        MedicalProfessional: false,
    };
    this.errors = {
      email: false,
    };
    this.data = {
      data: [],
    };
    this.redirect = {
      redirectToHome: false,
    }
  }

  callAPI = async () => {
    const response = await fetch('/api/addReg', {
                                                            method: 'post',
                                                            body: JSON.stringify(this.state),
                                                            headers: {'Content-Type': 'application/json'},});
    const data = await response.json();
    this.data = data;
    console.log(data)
  };

  handleChange = name => event => {
    this.setState({ ...this.state, [name]: event.target.value });
  };

  handleEmailChange = name => event => {
    this.setState({ ...this.state, [name]: event.target.value });
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (this.state.Email && !re.test(String(this.state.Email).toLowerCase())) {
      this.errors.email = true;
      //console.log(this.errors.email);
    } else {
      this.errors.email = false;
    }
  };


  handleCheckChange = name => event => {
    this.setState({ ...this.state, [name]: event.target.checked });
  };

  handleSubmit = event => {
    event.preventDefault();
    console.log(this.state);
    this.callAPI();
    this.redirect.redirectToHome = true;
    this.forceUpdate();
  };
  render() {
    const redirectToReferrer = this.redirect.redirectToHome;
    console.log(this.redirect.redirectToHome);
    if (redirectToReferrer === true) {
      console.log("REDIRECT");
      return <Redirect to="/home" />
    }
    return (
      <React.Fragment>
        <div className={'header'}>
          <Container maxWidth={"sm"}>
            <Typography variant="h3" align="center" color="textPrimary" gutterBottom>
              Pre-register for Publicus
            </Typography>
          </Container>
        </div>

        <div className={'sub-header'}>
          <Typography variant="h5" align="center" color="textSecondary" gutterBottom>
            Input your contact details and we will let you know when Publicus goes live
          </Typography>
        </div>

        <div className={'form-content'}>
          <Container>
            <Grid container justify="center" direction="row" spacing={10}>
              <form onSubmit={this.handleSubmit} autoComplete="off">
                <Grid item>
                  <TextField
                    required
                    id="outlined-name"
                    label="First Name"
                    value={this.state.FirstName}
                    onChange={this.handleChange('FirstName')}
                    margin="normal"
                    variant="outlined"
                    fullWidth="true"
                  />
                </Grid>
                <Grid item>
                  <TextField
                    required
                    id="outlined-name"
                    label="Last Name"
                    value={this.state.LastName}
                    onChange={this.handleChange('LastName')}
                    margin="normal"
                    variant="outlined"
                    fullWidth="true"
                  />
                </Grid>
                <Grid item>
                  <TextField
                    required
                    error={this.errors.email}
                    helperText={this.errors.email ? "Invalid E-mail":""}
                    id="outlined-name"
                    label="E-mail"
                    value={this.state.Email}
                    onChange={this.handleEmailChange('Email')}
                    margin="normal"
                    variant="outlined"
                    fullWidth="true"
                  />
                </Grid>
                <Grid item>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={this.state.MedicalProfessional}
                        onChange={this.handleCheckChange('MedicalProfessional')}
                        value= {this.state.MedicalProfessional}
                        color="primary"
                      />
                    }
                    label="I am a medical professional"
                    labelPlacement="end"
                  />
                </Grid>
                <Grid container spacing={2} justify="center">
                  <Grid item>
                    <Button type="submit" variant="contained" color="primary" justify="center" disabled={this.errors.email}>Submit</Button>
                  </Grid>
                </Grid>

              </form>
            </Grid>
          </Container>
        </div>
      </React.Fragment>

    );
  }
}
export default PreRegister;