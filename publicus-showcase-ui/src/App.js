import React, { Component } from "react";
import './App.css';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import Routes from "./routes";


class App extends Component  {

  render() {
    return (
      <div className={'root'}>
        <AppBar position="relative">
          <Toolbar>
            <Typography variant="h6" className={'title'} component={Link} to={'/home'}
                        style={{textDecoration: 'none', color: 'white'}}>
              Publicus
            </Typography>
            <Button color="inherit" component={Link} to={'/home/preregister'}>Pre-register</Button>

          </Toolbar>
        </AppBar>
        <Routes/>
      </div>
    );
  }
}


export default App;
