import React from 'react';
import 'antd/dist/antd.css';
import { Layout, Menu } from 'antd';
import './App.scss';
import GetAllCars from './pages/GetAllCars';
import GetCar from './pages/GetCar';
import Manage from './pages/Manage';
import AddNewCar from './pages/AddNewCar';

const { Header, Content, Footer } = Layout;

const tabList = [
  {
    title: 'Get all cars',
    display: <GetAllCars />,
  },
  {
    title: 'Query car',
    display: <GetCar />,
  },
  {
    title: 'Add New Car',
    display: <AddNewCar />,
  },
  {
    title: 'Manage',
    display: <Manage />,
  },
]

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeTab: '0',
    };
  }

  changeActiveTab = (n) => {
    this.setState({ activeTab: n });
  };

  getContent = () => {
    return tabList[this.state.activeTab].display;
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
            {tabList.map((v, i) => (
              <Menu.Item key={`${i}`} onClick={() => this.changeActiveTab(`${i}`)}>{v.title}</Menu.Item>
            ))}
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
