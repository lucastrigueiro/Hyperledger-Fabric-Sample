import React from 'react';
import './Styles.scss';
import {Button, Input, Card, message} from 'antd';
import axios from 'axios';
import {msgDuration, SERVER_URL} from '../utils/constants';

class GetCar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      car: null,
      carId: '',
    };
  }

  handleFind = async () => {
    if (!this.state.carId) {
      message.error('The Car ID is empty!', msgDuration);
      return
    }
    this.setState({ loading: true });
    await this.fetchCar();
    this.setState({ loading: false, visible: false });
  };

  fetchCar = async () => {
    const { carId } = this.state;
    await axios.get(`${SERVER_URL}/query/${carId}`)
    .then(response => {

      if (response.data.response) {
        const car = JSON.parse(JSON.parse(response.data.response));
        this.setState({ car: {...car, carId} });
      }
      else {
        this.setState({ car: null });
        message.warning('Car not found!', msgDuration);
      }
    })
    .catch( error => {
      this.setState({ car: null });
      console.log(error);
      message.error(Error, msgDuration);
    })
  }

  handleChange = (event) => {
    this.setState({carId: event.target.value});
  }

  render () {
    return (
      <div className="GetCar">
        <div className="query-container">
          <Input
            placeholder="Car ID"
            value={this.state.carId}
            onChange={this.handleChange}
          />
          <Button loading={this.state.loading} onClick={this.handleFind}>Find car</Button>
        </div>
        {
          !(this.state.car === null) &&
          <Card className="result-card" title={<b>{this.state.car.carId}</b>} style={{ width: 300 }}>
            <table>
              <tbody>
                <tr>
                  <td>Color:</td>
                  <td>{this.state.car.color}</td>
                </tr>
                <tr>
                  <td>docType:</td>
                  <td>{this.state.car.docType}</td>
                </tr>
                <tr>
                  <td>Make:</td>
                  <td>{this.state.car.make}</td>
                </tr>
                <tr>
                  <td>Model:</td>
                  <td>{this.state.car.model}</td>
                </tr>
                <tr>
                  <td>Owner:</td>
                  <td>{this.state.car.owner}</td>
                </tr>
              </tbody>
            </table>
          </Card>
        }
      </div>
    );
  }
}

export default GetCar;
