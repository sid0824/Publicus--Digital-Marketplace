import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Amplify from "aws-amplify";
import { Router } from "react-router-dom";
import history from './core/History';
import { ApiId, ApiName, AwsRegion, ClientId, IdentityPoolId, UserPoolId } from "./core/Config";

Amplify.configure({
    Auth: {
        mandatorySignIn: true,
        region: AwsRegion,
        userPoolId: UserPoolId,
        identityPoolId: IdentityPoolId,
        userPoolWebClientId: ClientId
    },
    API: {
        endpoints: [
          {
            name: ApiName,
            endpoint: `https://${ApiId}.execute-api.${AwsRegion}.amazonaws.com/prod`,
            region: AwsRegion,
          }
        ],
    }
});

// Render the React DOM on the 'root' div
ReactDOM.render(<Router history={history}><App /></Router>, document.getElementById('root'));
