import React from 'react';

// Context used to supply form config and altering functions to all child components of the create form page
export const CreateFormContext = React.createContext(null);

export const withCreateFormContext = (Component) => (props) =>
  <CreateFormContext.Consumer>
    {(context) =>
      <Component
        {...props}
        {...context}
      />
    }
  </CreateFormContext.Consumer>;
