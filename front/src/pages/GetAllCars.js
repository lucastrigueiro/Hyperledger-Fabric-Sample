import React from 'react';
import './Styles.scss';
import axios from 'axios';
import { SERVER_URL, msgDuration } from '../utils/constants';
import {Table, Button, Modal, Input, message} from 'antd';

class GetAllCars extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      content: [],
      loading: false,
      visible: false,
      newOwner: '',
      carId: null,
    };
  }

  componentDidMount() {
    this.fetchAllCars();
  }

  fetchAllCars = () => {
    axios.get(`${SERVER_URL}/queryallcars`)
    .then(response => {
      const cars = JSON.parse(JSON.parse(response.data.response));
      const carsArray = cars.map((v, i) => (
        {
          key: v.Key,
          color: v.Record.color,
          docType: v.Record.docType,
          make: v.Record.make,
          model: v.Record.model,
          owner: v.Record.owner,
          action: v.Key,
        }
      ))
      this.setState({ content: carsArray});
    })
  }

  showModal = (id) => {
    this.setState({
      visible: true,
      carId: id,
      newOwner: '',
    });
  };

  handleChange = (event) => {
    this.setState({newOwner: event.target.value});
  }

  handleCancel = () => {
    this.setState({ visible: false });
  };

  handleOk = async () => {
    this.setState({ loading: true });
    await this.changeOwner();
    this.setState({ loading: false, visible: false });
  };

  changeOwner = async () => {
    await axios.put(
      `${SERVER_URL}/changeowner/${this.state.carId}`,
      { owner: this.state.newOwner }
    )
    .then(response => {
      // console.log('response ', response);
      message.success(response.data.response, msgDuration);
    })
    .catch( error => {
      console.log(error);
      message.error(Error, msgDuration);
    })
    this.fetchAllCars();
  }

  columns = [
    {
      title: 'Key',
      dataIndex: 'key',
    },
    {
      title: 'Color',
      dataIndex: 'color',
    },
    {
      title: 'DocType',
      dataIndex: 'docType',
    },
    {
      title: 'Make',
      dataIndex: 'make',
    },
    {
      title: 'Model',
      dataIndex: 'model',
    },
    {
      title: 'Owner',
      dataIndex: 'owner',
    },
    {
      title: 'Action',
      dataIndex: 'action',
      render: id => <Button onClick={() => this.showModal(id)}>Change Owner</Button>,
    },
  ];

  render () {
    return (
      <div className="GetAllCars">
        <Table columns={this.columns} dataSource={this.state.content} />
        <Modal
          visible={this.state.visible}
          title={`Change '${this.state.carId}' Owner`}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={[
            <Button key="back" onClick={this.handleCancel}>
              Cancel
            </Button>,
            <Button key="submit" type="primary" loading={this.state.loading} onClick={this.handleOk}>
              Submit
            </Button>,
          ]}
        >
          <Input
            placeholder="New Owner"
            value={this.state.newOwner}
            onChange={this.handleChange}
          />
        </Modal>
      </div>
    );
  }
}

export default GetAllCars;
