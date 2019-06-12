import React from 'react';
import './Styles.scss';
import axios from 'axios';
import { SERVER_URL, msgDuration } from '../utils/constants';
import { Button, message } from 'antd';

class Manage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

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
  }

  registerUser = () => {
    axios.get(`${SERVER_URL}/registeruser`)
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
  }

  render () {
    return (
      <div className="Manage">
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

export default Manage;
