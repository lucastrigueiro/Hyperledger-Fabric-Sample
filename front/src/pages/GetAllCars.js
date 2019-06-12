import React from 'react';
import './Styles.scss';
import axios from 'axios';
import { SERVER_URL } from '../utils/constants';
import { Table } from 'antd';

const columns = [
  {
    title: 'Key',
    dataIndex: 'key',
    key: 'key',
  },
  {
    title: 'Color',
    dataIndex: 'color',
    key: 'color',
  },
  {
    title: 'DocType',
    dataIndex: 'docType',
    key: 'docType',
  },
  {
    title: 'Make',
    dataIndex: 'make',
    key: 'make',
  },
  {
    title: 'Model',
    dataIndex: 'model',
    key: 'model',
  },
  {
    title: 'Owner',
    dataIndex: 'owner',
    key: 'owner',
  },
];

class GetAllCars extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      content: [],
    };
  }

  componentDidMount() {
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
        }
      ))
      this.setState({ content: carsArray});
    })
  }

  render () {
    return (
      <div className="GetAllCars">
        <Table columns={columns} dataSource={this.state.content} />
      </div>
    );
  }
}

export default GetAllCars;
