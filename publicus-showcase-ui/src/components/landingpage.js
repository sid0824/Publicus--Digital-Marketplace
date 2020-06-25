import React, { Component } from "react";
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { SocialIcon } from 'react-social-icons';
import { Link } from 'react-router-dom';
import './landingpage.css';


class LandingPage extends Component {

  constructor(props) {
    super(props);
    this.state = { apiResponse: "", data: null };
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
    console.log(data);
    return (
      <React.Fragment>
        <CssBaseline/>
        <main>
          {/* Hero unit */}
          <div className='heroContent'>
            <div className={'heroText'}>
              <Container maxWidth="sm">
                <Typography component="h1" variant="h1" align="center" color="textPrimary" gutterBottom>
                  Publicus
                </Typography>
                <Typography variant="h5" align="center" color="textSecondary" paragraph>
                  An online marketplace for surveys
                </Typography>
                <div className='heroButtons'>
                  <Grid container spacing={2} justify="center">
                    <Grid item>
                      <Button variant="contained" color="primary" href='#about'>
                        About Publicus
                      </Button>
                    </Grid>
                    <Grid item>
                      <Button variant="outlined" color="primary" component={Link} to={'/home/preregister'}>
                        Pre-Register
                      </Button>
                    </Grid>
                  </Grid>
                </div>

                <div className={'social-links'}>
                  <Typography variant="h6" align="center" gutterBottom>
                    Follow Publicus on Social Media
                  </Typography>
                  <Grid container spacing={2} justify="center">
                    <Grid item>
                      <SocialIcon url="https://www.youtube.com/channel/UCr2zkkgMzWKSSpAt5D8aIFg"/>
                    </Grid>
                    <Grid item>
                      <SocialIcon url="https://twitter.com/Publicus3801"/>
                    </Grid>
                    <Grid item>
                      <SocialIcon url="http://instagram.com"/>
                    </Grid>
                  </Grid>
                </div>
              </Container>
            </div>
          </div>
          <div className={'about-content'} id='about'>
            <Container>
              <Typography variant="h3" align="center" color="textPrimary" gutterBottom>
                What is Publicus?
              </Typography>
              <Typography variant="h5" align="center" margin="0" color="textSecondary" paragraph>
                Publicus is a digital market place for the publication of standardised surveys intended to be used by
                medical professionals.
              </Typography>
              <Typography variant="h5" align="center" margin="0" color="textSecondary" paragraph>
                Publicus aims to provide medical professionals a digital marketplace and creation tool for survey forms.
                This is designed to solve the issues of the current process of
                acquiring surveys as doctors often have to seach through non-standardised journal articles which then
                need to be collated and printed
                into individual copies fro a patient to complete.
              </Typography>

              <Typography variant="h5" align="center" margin="0" color="textSecondary" paragraph>
                Publicus does this by digitising and standardising every step of the surveying process.
              </Typography>

            </Container>
          </div>
          <hr></hr>
          <div className={'showcase-content'}>
            <Typography variant="h3" align="center" color="textPrimary" gutterBottom>
              Publicus Showcase
            </Typography>
            <div className={'video-container'}>
              <Container maxWidth="sm">
                <iframe src="https://www.youtube.com/embed/PlgyR_f7DcI" frameBorder="0"
                        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen/>
              </Container>
            </div>
          </div>
        </main>
        {/* Footer */}
        <footer className='footer'>
          <Typography variant="h6" align="center" gutterBottom>
            Follow Publicus on Social Media
          </Typography>
          <div className={'social-links'}>
            <Grid container spacing={2} justify="center">
              <Grid item>
                <SocialIcon url="https://www.youtube.com/channel/UCr2zkkgMzWKSSpAt5D8aIFg"/>
              </Grid>
              <Grid item>
                <SocialIcon url="https://twitter.com/Publicus3801"/>
              </Grid>
              <Grid item>
                <SocialIcon url="http://instagram.com"/>
              </Grid>
            </Grid>
          </div>
          <div className='stats-link' align='center'>
            <Link to={"/home/stats"}>View Website Stats (UQ Members Only)</Link>
          </div>
        </footer>
        {/* End footer */}
      </React.Fragment>
    );
  }
}

export default LandingPage;
