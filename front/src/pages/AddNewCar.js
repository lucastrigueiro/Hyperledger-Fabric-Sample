import React from 'react';
import './Styles.scss';
import axios from 'axios';
import { SERVER_URL, msgDuration } from '../utils/constants';
import {
  Form,
  Input,
  Button,
  message,
} from 'antd';



class AddNewCar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  addCar = async (values) => {
    await axios.post(
      `${SERVER_URL}/addcar/`,
      values
    )
    .then(response => {
      // console.log('response ', response);
      message.success(response.data.response, msgDuration);
    })
    .catch( error => {
      console.log(error);
      message.error(Error, msgDuration);
    })
  }

  handleSubmit = async () => {
    // carid, make, model, colour, owner
    const { form } = this.props; // insert react router
    form.validateFields(async (err, values) => {
      if (!err) {
        console.log('values ', values);
        this.addCar(values);
      } else {
        message.error('There are empty fields!');
      }
    });
  }


  render () {
    const { getFieldDecorator } = this.props.form;

    return (
      <div className="AddNewCar">
        <Form>

          <Form.Item label="Car ID">
            {getFieldDecorator('carid', {
              rules: [{
                required: true, message: 'Insert the Car ID!',
              }],
            })(
              <Input
                name="carid"
                placeholder="Car ID"
              />,
            )}
          </Form.Item>

          <Form.Item label="Make">
            {getFieldDecorator('make', {
              rules: [{
                required: true, message: 'Insert the Make!',
              }],
            })(
              <Input
                name="make"
                placeholder="Make"
              />,
            )}
          </Form.Item>

          <Form.Item label="Model">
            {getFieldDecorator('model', {
              rules: [{
                required: true, message: 'Insert the Model!',
              }],
            })(
              <Input
                name="model"
                placeholder="Model"
              />,
            )}
          </Form.Item>

          <Form.Item label="Color">
            {getFieldDecorator('color', {
              rules: [{
                required: true, message: 'Insert the Color!',
              }],
            })(
              <Input
                name="color"
                placeholder="Color"
              />,
            )}
          </Form.Item>

          <Form.Item label="Owner">
            {getFieldDecorator('owner', {
              rules: [{
                required: true, message: 'Insert the Owner!',
              }],
            })(
              <Input
                name="owner"
                placeholder="Owner"
              />,
            )}
          </Form.Item>

          <Form.Item>
            <Button
              style={{ float: 'right' }}
              type="primary"
              loading={this.state.loading}
              onClick={() => this.handleSubmit()}
            >
              Add
            </Button>
          </Form.Item>

        </Form>
      </div>
    );
  }
}

const WrappedRegistrationForm = Form.create()(AddNewCar);

export default WrappedRegistrationForm;
