import React from 'react';
import './Styles.scss';
import axios from 'axios';
import { SERVER_URL, msgDuration } from '../utils/constants';
import {Button, Input, message} from 'antd';

class RegisterUser extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      userId: '',
    };
  }

  handleRegister = async () => {
    if (!this.state.userId) {
      message.error('The User ID is empty!', msgDuration);
      return
    }
    this.setState({ loading: true });
    await this.registerUser();
    this.setState({ loading: false, visible: false });
  };

  handleChange = (event) => {
    this.setState({userId: event.target.value});
  };

  registerUser = async () => {
    await axios.post(
      `${SERVER_URL}/registeruser`,
      { user: this.state.userId },
    )
      .then(response => {
        console.log(response);
        if (response.data.created){
          message.success(response.data.response, msgDuration);
          this.setState({ userId: '' })
        } else {
          message.warning(response.data.response, msgDuration);
        }
      })
      .catch( err => {
        console.log(err);
        message.error('Error', msgDuration)
      })
  };

  enrollAdmin = () => {
    axios.get(`${SERVER_URL}/enrolladmin`)
    .then(response => {
      console.log(response);
      if (response.data.created){
        message.success(response.data.response, msgDuration)
      } else {
        message.warning(response.data.response, msgDuration)
      }
    })
    .catch( err => {
      console.log(err);
      message.error('Error', msgDuration)
    })
  };

  render () {
    return (
      <div className="RegisterUser">
        <div className="register-container">
          <Input
            placeholder="User ID"
            value={this.state.userId}
            onChange={this.handleChange}
          />
          <Button loading={this.state.loading} onClick={this.handleRegister}>RegisterUser</Button>
        </div>

        <div>
          <Button onClick={this.enrollAdmin}>Enroll Admin</Button>
        </div>
        <div>
          <Button onClick={this.registerUser}>Register User</Button>
        </div>
      </div>
    );
  }
}

export default RegisterUser;
