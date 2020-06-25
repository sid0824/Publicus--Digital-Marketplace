import React from 'react'
import { message, Button, Input } from 'antd';
import { API } from "aws-amplify";
import { ApiName } from "../../core/Config";
import axios from 'axios';
import { withAuthContext } from "../../AuthContext";
import UserAvatar from "../../components/UserAvatar";
import { Auth } from 'aws-amplify';

export class MyAccount extends React.Component {

  state = {
    password1: '',
    password2: '',
  };

  handleUpload = async () => {
    let file = this.uploadInput.files[0];
    let fileType = this.uploadInput.files[0].name.split('.')[1];
    if (!['tiff', 'jpeg', 'png', 'jpg'].includes(fileType)) {
      message.error('Upload a valid image');
      return;
    }
    const response = await API.get(ApiName, `/getUserAvatarPostUrl?fileType=${fileType}`, {});
    const { putUrl } = response;
    try {
      await axios.put(putUrl, file, {
        headers: {
          'Content-Type': fileType
        }
      });
      message.success('Successfully uploaded file');
      const fileReader = new FileReader();
      fileReader.onload = () => {
        document.getElementById("avatar").src = fileReader.result;
      };
      fileReader.readAsDataURL(this.uploadInput.files[0]);
    } catch (err) {
      message.error('Failed to upload avatar')
    }
  };

  changePassword = async () => {
    const { password1, password2 } = this.state;
    try {
      const user = await Auth.currentAuthenticatedUser();
      await Auth.changePassword(user, password1, password2);
      message.success('Successfully changed password')
    } catch (err) {
      console.error(err);
      message.error('Failed to change password');
    }
  };

  render() {
    const { password1, password2 } = this.state;
    return (
      <div style={{ marginLeft: 'calc(50% - 300px)', marginRight: 'calc(50% - 300px)', marginTop: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ marginRight: 50 }}>User Avatar</h2>
            <div style={{ height: 200, width: 200, marginBottom: 12 }}>
              <UserAvatar
                height={200}
                width={200}
              />
            </div>
            <input
              onChange={this.handleUpload}
              ref={(ref) => { this.uploadInput = ref; }}
              type="file"
            />
          </div>
        </div>
        <br/>
        <br/>
        <br/>
        <h2>Change Password</h2>
        Current Password
        <br />
        <Input.Password
          placeholder="Enter your current password"
          style={{ width: 600 }}
          onChange={e => this.setState({ password1: e.target.value })}
          value={password1}
        />
        <br />
        <br />
        New Password
        <br />
        <Input.Password
          placeholder="Enter your new password"
          style={{ width: 600 }}
          onChange={e => this.setState({ password2: e.target.value })}
          value={password2}
        />
        <br />
        <br />
        <Button
          type="primary"
          onClick={this.changePassword}
        >
          Submit
        </Button>
      </div>
    );
  }
}

export default withAuthContext(MyAccount)
