import React from "react";
import {withAuthContext} from "../AuthContext";

const defaultAvatar = 'http://s3.amazonaws.com/37assets/svn/765-default-avatar.png';

// Component used for rendering the avatar for a user
export class UserAvatar extends React.Component {

  state = {
    url: ''
  };

  // Use the supplied props url or default to the current users avatar
  componentDidMount = async () => {
    const { image, avatar } = this.props;
    this.setState({
      url: image || avatar
    })
  };

  // Default avatar on error
  onError = () => {
    this.setState({
      url: defaultAvatar
    })
  };

  render() {
    const { url } = this.state;
    const { height, width } = this.props;
    return (
      <img
        id={"avatar"}
        alt={"avatar"}
        width={height || 32}
        height={width || 32}
        style={{ borderRadius: '30%' }}
        src={url || defaultAvatar}
        onError={this.onError}
      />
    )
  }
}

export default withAuthContext(UserAvatar);