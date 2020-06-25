import React from 'react';

export const AuthContext = React.createContext(null);

// Context used for storing auth values and altering functions
export const withAuthContext = (Component) => (props) =>
  <AuthContext.Consumer>
    {(context) =>
      <Component
        {...props}
        {...context}
      />
    }
  </AuthContext.Consumer>;
