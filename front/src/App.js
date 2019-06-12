import React from 'react';
import 'antd/dist/antd.css';
import { Layout, Menu, Breadcrumb } from 'antd';
import './App.scss';
import GetAllCars from './pages/GetAllCars';
import GetCar from './pages/GetCar';

const { Header, Content, Footer } = Layout;

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeTab: '2',
    };
  }

  changeActiveTab = (n) => {
    this.setState({ activeTab: n });
  };

  getContent = () => {
    switch (this.state.activeTab) {
      case '1':
        return <GetAllCars />
      case '2':
        return <GetCar />
      case '3':
        return '33333'
      case '4':
        return '44444'
      default:
        console.log('Sorry');
    }
  };

  render () {
    return (
      <Layout className="App">
        <Header style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
          <div className="logo" />
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={[this.state.activeTab]}
            style={{ lineHeight: '64px' }}
          >
            <Menu.Item key="1" onClick={() => this.changeActiveTab('1')}>Get all cars</Menu.Item>
            <Menu.Item key="2" onClick={() => this.changeActiveTab('2')}>nav 2</Menu.Item>
            <Menu.Item key="3" onClick={() => this.changeActiveTab('3')}>nav 3</Menu.Item>
            <Menu.Item key="4" onClick={() => this.changeActiveTab('4')}>nav 4</Menu.Item>
          </Menu>
        </Header>
        <Content style={{ padding: '50px 50px 0 50px', marginTop: 64 }}>
          <div style={{ background: '#fff', padding: 24, minHeight: 380 }}>
            {this.getContent()}
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>My Custom Blockchain</Footer>
      </Layout>
    );
  }
}


export default App;
