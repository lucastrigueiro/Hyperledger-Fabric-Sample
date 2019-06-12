import React from 'react';
import './Styles.scss';
import { Button } from 'antd';
import axios from 'axios';
import { SERVER_URL } from '../utils/constants';

class GetCar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      car: null,
    };
  }

  fetchCar = async (id) => {
    axios.get(`${SERVER_URL}/query/${id}`)
    .then(response => {
      console.log('response.data.response ', response.data.response);
      if (response.data.response) {
        const car = JSON.parse(JSON.parse(response.data.response));
        this.setState({ car });
      }
      else {
        this.setState({ car: '' });
      }
    })
  }

  render () {
    return (
      <div className="GetAllCars">
        {/*<Input />*/}
        <Button onClick={() => this.fetchCar('CAR3')}>Buscar</Button>
        {
          !(this.state.car === null) &&
          <div>Result:
            {
              (this.state.car === "") ?
                <div>Car not Found</div>
                :
                <div>
                  <div>Color:   {this.state.car.color}</div>
                  <div>docType: {this.state.car.docType}</div>
                  <div>Make:    {this.state.car.make}</div>
                  <div>Model:   {this.state.car.model}</div>
                  <div>Owner:   {this.state.car.owner}</div>
                </div>
            }
          </div>
        }
      </div>
    );
  }
}

export default GetCar;
