import React, { useEffect, useState } from 'react';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  // AliwangwangOutlined,
  // BorderOutlined,
  // PieChartOutlined,
  // FileAddOutlined,
  // VideoCameraOutlined,
  FileTextOutlined,
  FileOutlined,
  // TeamOutlined,
  // VideoCameraOutlined,
  LogoutOutlined,
  // ProfileOutlined,

} from '@ant-design/icons';
import { Avatar, Layout, Menu, Button, theme, message, Row, Col, Typography, Space } from 'antd';

import '../App.css';

// import ReactDOM from "react-dom/client";
import { Routes, Route } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import Dashboard from "../pages/Dashboard";
import CreateCase from "../pages/CreateCase";
import AddVideo from "../pages/AddVideo";
import Reporting from "../pages/Reporting";
import UserManagement from '../pages/UserManagement';
import Profile from '../pages/Profile';
import AnalyzeVideo from '../pages/AnalyzeVideo';
import CaseDetails from '../pages/CaseDetails';
import VideoData from '../pages/VideoData';
import Streaming from '../pages/Streaming';
import CaseReport from '../pages/CaseReport';
import AnalyzeCase from '../pages/AnalyzeCase';
import Videos from '../pages/Videos';
import MissionDetails from '../pages/MissionDetails';
import Missions from '../pages/Missions';
import CreateMission from '../pages/CreateMission';
import MissionMapView from '../pages/MissionMapView';
import Evidence from '../pages/Evidence';
import AddCase from '../pages/AddCase';
import SelectEvidence from '../pages/SelectEvidence'
import SelectPeople from '../pages/SelectPeople'
import SelectAttribute from '../pages/SelectAttribute'
// import Report2 from '../pages/Report2'
import SelectFilterCase from '../pages/SelectFilterCase';
import Case from '../pages/Case'
import Report from '../pages/Report'

// import KorpsBrimob from '../assets/korps-brimob.png';
// import Tactical from '../assets/tactical.jpg';
import Logo from '../assets/logo.png'

import useUserStore from '../store/userStore';
import { UserStoreState } from '../type/storeTypes';

// import useForceUpdate from '../features/update';

// import * as mqtt from 'mqtt/dist/mqtt';

// import useMqttStore from '../store/mqttStore';
// import { withSuccess } from 'antd/es/modal/confirm';

// const topic = "xitappliance/frontend/status"
// const message = "haiii"

// const client = mqtt.connect('ws://broker.hivemq.com:8000/mqtt');

// client.on('connect', () => {
//   console.log('connected to MQTT broker');
//   client.subscribe(topic, { qos: 2 });
//   // client.publish(topic, message);
// });

// const mqttMessage = (message: string) => {
//   messageApi.open({
//     type: 'success',
//     content: message,
//   });
// };

// client.on('message', (topic: string, message: Buffer) => {
//   console.log(`Message received on ${topic}: ${message.toString()}`);
  // mqttMessage(message.toString())
  // if (message.toString() === 'analyze video finished') {
  //   useMqttStore.setState({ status: 'analyze video finished' });
  // }
  // else if (message.toString() === 'analyze') {
  //   useMqttStore.setState({ status: 'analyze' });
  //   // window.location.reload()
  // }
  // else if (message.toString() === 'standby') {
  //   useMqttStore.setState({ status: 'standby' });
  //   // window.location.reload()
  // }
// });

// import * as mqtt from 'mqtt/dist/mqtt.min'

// pake ini
// import * as mqtt from 'mqtt/dist/mqtt';

// import * as mqtt from 'mqtt';
// import mqtt from 'mqtt';

// import process from 'process';

// process

// const client = mqtt.connect(`mqtt://broker.emqx.io/mqtt`);
// client.subscribe("forensic/frontend/status");
// client.on("connect", () => {
//   console.log("connected");
// }
// );

//pake ini
// const topic = "yes"
// const message2 = "haiii"

// import mqtt from 'mqtt';

// const client2 = mqtt.connect('ws://127.0.0.1:8083/mqtt');

// client2.on('connect', () => {
//   console.log('connected to MQTT broker');
//   client2.subscribe(topic);
//   client2.publish(topic, message2);
// });

// client2.on('message', (topic: string, message: Buffer) => {
//   console.log(`Message received on ${topic}: ${message.toString()}`);
// });

// client2.on('error', (err: Error) => {
//   console.error('Failed to connect to MQTT broker:', err);
// });

// client.on("message", (message) => {
//   console.log(topic, message.toString());
// }
// );

// client.publish(topik, pesan);

// client.subscribe("halodronelitic/server/export_reply");
// const SendSignalToImport = () => {
//   ServerImport.publish("halodronelitic/server/export_reply", "true")
//   reveal.value = true
// }

const { Header, Sider, Content } = Layout;
const { Text } = Typography;
// function ProfileMenu ({collapsed}: {collapsed: boolean}) {
//     return (
//         <Menu 
//             className='profileMenu'
//             theme="dark"
//             >
//             <Menu.Item key="0" className='avatarDiv' style={{ paddingLeft: '18px', textAlign: collapsed ? 'center' : 'left' }}>
//             <Avatar className='avatar' src="https://xsgames.co/randomusers/assets/avatars/pixel/44.jpg" />
//                 {!collapsed && <span className="profileName">John Doe</span>}
//             </Menu.Item>
//         </Menu>
//     );
// }

const url = import.meta.env.VITE_API_URL

import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';

type UserData = {
  address: string | null,
  createdAt: string,
  email: string,
  firstName: string,
  lastName: string,
  name: string,
  phoneNumber: any,
  profilePicture: string,
  status: string,
  type: string,
  updatedAt: string,
  userId: string
}

const AppLayout: React.FC = () => {
  const navigate = useNavigate();
  const userId = (useUserStore.getState() as UserStoreState).userID;

  useEffect(() => {
    if (userId == null) {
      navigate('/auth/login')
    }
  }, [])

  // const updater = useForceUpdate()
  // const handler = () => {
  //   updater()
  // }

  const [collapsed, setCollapsed] = useState(false);
  // const [analyzeStatus, setAnalyzeStatus] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);
  // const [createCaseLoading, setCreateCaseLoading] = useState(false);

  const success = (message : string) => {
    messageApi.open({
      type: 'success',
      content: message,
      duration: 10,
    });
    // loadingPage(false)
  };

  // const progress = (message: string) => {
  //   messageApi.open({
  //     type: 'loading',
  //     content: message,
  //     duration: 0,
  //   });
  // };

  const error = (message: string) => {
    messageApi.open({
      type: 'error',
      content: message,
    });
  }

  const loadingPage = (status: boolean) => {
    setLoading(status)
  }

  // const loadingPageCreateCase = (status: boolean) => {
  //   setCreateCaseLoading(status)
  // }

  // const destroyMessage = () => {
  //   messageApi.destroy()
  // }

  // client.on('message', (topic: string, message: Buffer) => {
  //   // loadingPage(false)
  //   console.log(`Message received on ${topic}: ${message.toString()}`);
  //   // success(message.toString())
  //   if (message.toString() === 'analyze video finished') {
  //     loadingPage(false)
  //     destroyMessage()
  //     success("Analyze video finished")
  //     // useMqttStore.setState({ status: 'analyze video finished' });
  //   }
  //   else if (message.toString() === 'analyze') {
  //     loadingPage(true)
  //     destroyMessage()
  //     progress("Analyze in progress")
  //     // useMqttStore.setState({ status: 'analyze' });
  //   }
  //   // else if (message.toString() === 'create case in progress') {
  //   //   loadingPageCreateCase(true)
  //   //   destroyMessage()
  //   //   progress("Create case in progress")
  //   // }
  //   // else if (message.toString() === 'create case finished') {
  //   //   loadingPageCreateCase(false)
  //   //   destroyMessage()
  //   //   success("Create case finished")
  //   //   navigate('/caseReport/1')
  //   // }
  // });

  const logout = () => {
    // localStorage.clear();
    navigate('/auth/login');
  }

//   function handleMenuClick ({ key }) {
//     if (key) {
//       useNavigate(key);
//     }
//   }
console.log(location.pathname)

// signalR
const [connection, setConnection] = useState<HubConnection | null>(null);
useEffect(() => {
  const newConnection = new HubConnectionBuilder()
      .withUrl(url + '/ignisHub')
      .withAutomaticReconnect()
      .build();

  setConnection(newConnection);
}, []);

// useEffect(() => {
//   if (connection) {
//       connection.start()
//           .then(result => {
//               console.log('Connected!');
//               console.log(result);

//               connection.on('ReceiveMessage', message  => {
//                   // const updatedChat = [...latestChat.current];
//                   // updatedChat.push(message);
              
//                   // setChat(updatedChat);
                  
//                   messageApi.open({
//                     type: 'success',
//                     content: message,
//                     duration: 10,
//                   });
//                   location.reload()
//                   console.log(message);
//               });

//             //   connection.on('ReceiveMessage', function(message, value) {
//             //     // const updatedChat = [...latestChat.current];
//             //     // updatedChat.push(message);
            
//             //     // setChat(updatedChat);
                
//             //     messageApi.open({
//             //       type: 'success',
//             //       content: message,
//             //       duration: 10,
//             //     });
//             //     // location.reload()
//             //     console.log(message, value);
//             // });
//           })
//           .catch(e => console.log('Connection failed: ', e));
//   }
// }, [connection, messageApi]);
// const [username, setUsername] = useState<UserData>();
const [userData, setUserData] = useState<UserData>()

useEffect(() => {
  if (userId) {
    fetch (url + '/api/User?userId=' + userId, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': 'Bearer ' + localStorage.getItem('token')
      }
    }).then((response) => {
      if (response.ok) {
        // console.log(response)
        // return response.text();
        return response.json()
      }
      else {
        throw new Error("Something went wrong");
      }
    }).then((data) => {
      setUserData(data)
    }).catch((error) => {
      console.log(error);
    })
  }
}, []);


  return (
    <Layout style={{width: '100%'}}>      
    {contextHolder}
      <Sider style={{height: '100vh'}} trigger={null} collapsible collapsed={collapsed} theme="light">
        <div />
        <Space style={{ margin: 30, height: '60px', overflow: 'hidden'}}>
            {/* <AliwangwangOutlined style={{fontSize: 20, marginRight: 15}} /> */}
            {/* <BorderOutlined style={{fontSize: 20, marginRight: 15}} /> */}
            <img src={Logo} alt="Logo" style={{width: '20px'}} />
            {/* <img src="https://i.ibb.co/0jZ3Q0K/Logo-1.png" alt="Logo-1" border="0" style={{width: '100%'}} /> */}
            {/* <img src="https://www.adaptivewfs.com/wp-content/uploads/2020/07/logo-placeholder-image.png" style={{width: '25px', height: '25px', marginTop: '0px'}} /> */}
            {!collapsed && <Text>Unified Security & Surveillance Platform</Text>}
            {/* <Text>Brand Name</Text> */}
        </Space>
        {/* <ProfileMenu collapsed={collapsed} /> */}
        {/* <Link to="/">Dashboard</Link> */}
        {/* <Route path="/" element={<Dashboard />}></Route> */}
        <Menu
          theme="dark"
          mode="inline"
          style={{background: 'transparent'}}
          selectedKeys={[
            location.pathname === '/addVideo' ? '/evidence' : 
            location.pathname.includes('/caseDetails') ? '/reporting' : 
            // location.pathname === '/analyzeCase' ? '/createCase' : 
            location.pathname.includes('/missionDetails') ? '/missions' : 
            location.pathname.includes('/analyzeCase') ? '/case' : 
            location.pathname.includes('/addCase') ? '/case' : 
            location.pathname.includes('/selectFilterCase') ? '/case' :
            location.pathname.includes('/report') ? '/case' : 
            location.pathname]}
          onClick={({ key }) => {
            navigate(key) 
            }}
          items={[
            {
              key: '/profile',
              icon: <Avatar size={20} src={"data:image/png;base64," + userData?.profilePicture} />,
              label: userData?.name,
            },
            // {
            //   key: '/dashboard',
            //   icon: <PieChartOutlined />,
            //   label: 'Dashboard'
            // },
            // {
            //   key: '/createCase',
            //   icon: <FileAddOutlined />,
            //   label: 'Create Case',
            // },
            {
              key: '/case',
              icon: <FileTextOutlined />,
              label: 'Case',
            },
            {
              key: '/evidence',
              icon: <FileOutlined />,
              label: 'Evidence',
            },
            // {
            //   key: '/streaming',
            //   icon: <VideoCameraOutlined />,
            //   label: 'Streaming',
            // },
            // {
            //   key: '/createMission',
            //   icon: <FileAddOutlined />,
            //   label: 'Create Mission',
            // },
            // {
            //   key: '/missions',
            //   icon: <ProfileOutlined />,
            //   label: 'Missions',
            // }, 
            // {
            //   key: '/userManagement',
            //   icon: <TeamOutlined />,
            //   label: 'User Management',
            // },
          ]}
        />
      </Sider>
      <Layout style={{ color: 'black' }}>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <Row justify="space-between">
            <Col>
              <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                style={{
                  fontSize: '16px',
                  width: 64,
                  height: 64,
                }}
              />
            </Col>
            <Col>
              <Button
              type="text"
              icon={<LogoutOutlined />}
              onClick={logout}
              style={{
                fontSize: '16px',
                height: 64,
              }}
              >
                Logout
              </Button>
            </Col>
          </Row>
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            height: 280,
            background: colorBgContainer,
            overflow: 'auto'
          }}
        >
            <Routes>
                <Route index element={<Dashboard />} />
                <Route path ="/dashboard" element={<Dashboard />} />
                <Route path="/createCase" element={<CreateCase success={success} error={error} />} />
                <Route path="/addVideo" element={<AddVideo success={success} loadingPage={loadingPage} loading={loading} />} />
                <Route path="/reporting" element={<Reporting success={success} />} />
                <Route path="/userManagement" element={<UserManagement />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/analyzeVideo" element={<AnalyzeVideo success={success} />} />
                <Route path="/caseDetails/:caseId" element={<CaseDetails success={success} />} />
                <Route path="/videoData/:videoId" element={<VideoData />} />
                <Route path="/streaming" element={<Streaming />} />
                <Route path="/caseReport/:caseId" element={<CaseReport />} />
                <Route path="/analyzeCase" element={<AnalyzeCase success={success} connection={connection} />} />
                <Route path="/videos" element={<Videos />} />
                <Route path="/missionDetails" element={<MissionDetails />} />
                <Route path="/missions" element={<Missions />} />
                <Route path="/createMission" element={<CreateMission success={success} error={error} />} />
                <Route path="/missionMapView" element={<MissionMapView />} />
                <Route path="/evidence" element={<Evidence success={success} connection={connection} />} />
                <Route path="/selectEvidence" element={<SelectEvidence />} />
                <Route path="/selectPeople" element={<SelectPeople />} />
                <Route path="/selectAttribute" element={<SelectAttribute />} />
                <Route path="/addCase" element={<AddCase success={success} errorMessage={error} />} />
                <Route path="/report/:id" element={<Report />} />
                <Route path="/selectFilterCase" element={<SelectFilterCase success={success} errorMessage={error} />} />
                <Route path="/case" element={<Case success={success} />} />
            </Routes>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout;