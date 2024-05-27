import React, { useState } from 'react';
import { Typography, Space, Input, Card, Button, Layout, Tabs, Col, Row, Modal, Select, Switch, Checkbox } from 'antd';
import { useNavigate } from 'react-router-dom';
import { MenuFoldOutlined, MenuUnfoldOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { CollapseProps } from 'antd';
import { Collapse } from 'antd';

import useUserStore from '../store/userStore';

const { Title, Text } = Typography;
const { Sider } = Layout;

const text = `Sample text`;

const url = import.meta.env.VITE_API_URL;

interface UserStoreState {
  userID: string;
  // define other properties here
}

const Streaming: React.FC = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [addInput, setAddInput] = useState(false);
    const [addVideo, setAddVideo] = useState(false);
    const [selectInputType, setSelectInputType] = useState(false);
    const [inputType, setInputType] = useState<string>('streaming');

    const [startRecording, setStartRecording] = useState(false);
    const [saveRecording, setSaveRecording] = useState(false);
    
    const [fileBased, setFileBased] = useState(true);

    // const createdUserId = useUserStore(state => state.userID);
    const createdUserId = (useUserStore.getState() as UserStoreState).userID;
    const [cameraType, setCameraType] = useState<string>('');
    const [cameraName, setCameraName] = useState<string>('');
    const [location, setLocation] = useState<string>('');
    const [latitude, setLatitude] = useState<number | null>(null);
    const [longitude, setLongitude] = useState<number | null>(null);
    const [cameraUrl, setCameraUrl] = useState<string>('');
    const [username, setUsername] = useState<string | null>(null);
    const [password, setPassword] = useState<string  | null>(null);

    // console.log(createdUserId)

    const navigate = useNavigate();

    // const userID = useUserStore(state => state.userID);

    const handleAddInput = () => {
      // if (username === '') {
      //   setUsername(null)
      // }
      // if (password === '') {
      //   setPassword(null)
      // }
      setFileBased(true);
      console.log(createdUserId, cameraType, cameraName, location, latitude, longitude, cameraUrl, username, password)
      fetch(url + '/api/Camera/add', {
        method: 'POST',
        headers: {
          'Content-Type': "application/json"
        },
        body: JSON.stringify({
          createdUserId: createdUserId,
          cameraType: cameraType,
          cameraName: cameraName,
          location: location,
          latitude: latitude,
          longitude: longitude,
          cameraUrl: cameraUrl,
          username: username,
          password: password
        })
      }).then((response) => {
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        else {
          setAddInput(false);
          
          console.log("Succesfully added input")
        }
      })
      .catch((error) => {
        console.error('There was a problem with the fetch operation:', error);
      });
    }

      const handleCameraType = (event: any): void => {
        setCameraType(event.target.value)
      }

      const handleCameraName = (event: any): void => {
        setCameraName(event.target.value)
      }

      const handleLocation = (event: any): void => {
        setLocation(event.target.value)
      }

      const handleLatitude = (event: any): void => {
        if (event.target.value === '') {
          setLatitude(null)
        }
        else {
          setLatitude(event.target.value)
        }
      }

      const handleLongitude = (event: any): void => {
        if (event.target.value === '') {
          setLongitude(null)
        }
        else {
          setLongitude(event.target.value)
        }
      }

      const handleCameraUrl = (event: any): void => {
        setCameraUrl(event.target.value)
      }

      const handleUsername = (event: any): void => {
        if (event.target.value === '') {
          setUsername(null)
        }
        else {
          setUsername(event.target.value)
        }
      }

      const handlePassword = (event: any): void => {
        if (event.target.value === '') {
          setPassword(null)
        }
        else {
          setPassword(event.target.value)
        }
      }

      const handleSelect = (value: string): void => {
        // if (value === 'streaming') {
        //   setFileBased(false)
        // }
        // else {
        //   setFileBased(true)
        // }
        setInputType(value)
      }

      const handleAddVideo = () => {
        setAddVideo(false);
      }

      const handleStartRecording = () => {
        if (startRecording) {
          setSaveRecording(true);
        }
        setStartRecording(!startRecording);
      }

    const handleAddInput2 = (event: any): void => {
      event.preventDefault();
      const form = event.target;
      console.log(form)
      const data = new FormData(form);

      console.log(data)

      const formJson = Object.fromEntries(data.entries());
      console.log(formJson);

      fetch (url + '/api/Camera/add', {
        method: 'POST',
        body: data,
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      else {
        navigate('/videoData')
      }
      return response.json();
    })
    .then(data => {
      console.log(data);
    })
    .catch(error => {
      console.error('There was a problem with the fetch operation:', error);
    });
  }

    const handleCancel = () => {
      setAddInput(false);
      setAddVideo(false);
      setSelectInputType(false);
      setSaveRecording(false);
    }

    const handleSelectInput = () => {
      setSelectInputType(false);
      console.log(inputType)
      // setAddInput(true);
      if (inputType === 'streaming') {
        // setFileBased(false)
        setAddInput(true);
      }
      else {
        // setFileBased(true)
        setAddVideo(true);
      }
    }

    const items: CollapseProps['items'] = [
        {
          key: '1',
          label: 
          <>
            <Space align="center">
            <div style={{background: 'green', width: '10px', height: '10px', borderRadius: '5px'}}></div>
            <Text>Camera 1</Text>
            </Space>
          </>,
          children:
            <>
                <Space direction="vertical" style={{width: '100%'}}>
                    <Text>Type: Streaming</Text>
                    <Text>Camera Type: CCTV 1234</Text>
                    <Text>Link: http://abc.def</Text>
                    <Text>Location: Main Building</Text>
                    {/* <Row justify="space-between">
                      <Col>
                        <Text>Connect</Text>
                      </Col>
                      <Col>
                        <Switch defaultChecked />
                      </Col>
                    </Row> */}
                    <Row justify="space-between">
                      <Col>
                        <Text>Show</Text>
                      </Col>
                      <Col>
                        <Switch defaultChecked />
                      </Col>
                    </Row>
                    {/* <Space>
                        <Button type="primary">Start Recording</Button>
                        <Button icon={<EditOutlined />} />
                        <Button icon={<DeleteOutlined />} />
                    </Space> */}
                    <Row gutter={5}>
                      <Col flex="auto"><Button type={startRecording ? 'default' : 'primary'} block onClick={handleStartRecording}>
                        {startRecording && <div>Stop Recording</div>}
                        {!startRecording && <div>Start Recording</div>}
                        </Button></Col>
                      <Col><Button icon={<EditOutlined />} /></Col>
                      <Col><Button icon={<DeleteOutlined />} /></Col>
                    </Row>

                    {/* <Space>
                        <Button type="primary">Connect</Button>
                        <Button type="primary">Edit</Button>
                        <Button type="primary">Delete</Button>
                    </Space> */}
                </Space>
            </>
          ,
        },
        {
          key: '2',
          label: 
          <>
            <Space align="center">
            <div style={{background: 'red', width: '10px', height: '10px', borderRadius: '5px'}}></div>
            <Text>Camera 2</Text>
            </Space>
          </>
          ,
          children: 
            <>
                <Space direction="vertical">
                    <Text>Type: Streaming</Text>
                    <Text>Camera Type: CCTV 5678</Text>
                    <Text>Link: http://ghi.def</Text>
                    <Text>Location: West Building</Text>
                    <Space>
                        <Button type="primary">Connect</Button>
                        <Button type="primary">Edit</Button>
                        <Button type="primary">Delete</Button>
                    </Space>
                </Space>
            </>
            ,
        },
        {
          key: '3',
          label: 
          <>
            <Space align="center">
            <div style={{background: 'grey', width: '10px', height: '10px', borderRadius: '5px'}}></div>
            <Text>Video A</Text>
            </Space>
          </>
          ,
          children: 
            <>
                <Space direction="vertical" style={{width: '100%'}}>
                    <Text>Type: Video</Text>
                    <Text>Camera Type: CCTV 5678</Text>
                    <Text>Link: http://ghi.def</Text>
                    <Text>Location: West Building</Text>
                    <Row justify="space-between">
                      <Col>
                        <Text>Show</Text>
                      </Col>
                      <Col>
                        <Switch defaultChecked />
                      </Col>
                    </Row>
                    <Row gutter={5}>
                      <Col flex="auto"><Button type="primary" block>Play Video</Button></Col>
                      <Col><Button icon={<EditOutlined />} /></Col>
                      <Col><Button icon={<DeleteOutlined />} /></Col>
                    </Row>
                </Space>
            </>,
        },
        {
          key: '4',
          label: 
          <>
            <Space align="center">
            <div style={{background: 'grey', width: '10px', height: '10px', borderRadius: '5px'}}></div>
            <Text>Input 4</Text>
            </Space>
          </>
          ,
          children: <p>{text}</p>,
        },
        {
          key: '5',
          label: 
          <>
            <Space align="center">
            <div style={{background: 'grey', width: '10px', height: '10px', borderRadius: '5px'}}></div>
            <Text>Input 5</Text>
            </Space>
          </>
          ,
          children: <p>{text}</p>,
        },
      ];
      
    return (
      <>
        <Layout style={{height: '100%'}}>
            <Sider collapsible collapsed={collapsed} trigger={null} collapsedWidth={0} width={300} style={{height: '100%'}} theme="light">
                {/* <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
                    <Menu.Item key="1" icon={<PieChartOutlined />}>
                    Option 1
                    </Menu.Item>
                    <Menu.Item key="2" icon={<DesktopOutlined />}>
                    Option 2
                    </Menu.Item>
                    <SubMenu key="sub1" icon={<UserOutlined />} title="User">
                    <Menu.Item key="3">Tom</Menu.Item>
                    <Menu.Item key="4">Bill</Menu.Item>
                    <Menu.Item key="5">Alex</Menu.Item>
                    </SubMenu>
                    <SubMenu key="sub2" icon={<TeamOutlined />} title="Team">
                    <Menu.Item key="6">Team 1</Menu.Item>
                    <Menu.Item key="8">Team 2</Menu.Item>
                    </SubMenu>
                    <Menu.Item key="9" icon={<FileOutlined />} />
                </Menu> */}
                {/* <Layout style={{height: '100%', overflow: 'auto'}}> */}
                <Tabs
                    defaultActiveKey="1"
                    tabPosition="top"
                    style={{ height: '100%', marginRight: '10px' }}
                    items={
                        [
                            {
                                label: 'Inputs',
                                key: '1',
                                children:
                                    <>
                                        {/* <Space style={{width: '100%'}} direction="vertical" align="end">
                                          <Button type="primary" onClick={() => setAddInput(true)} style={{marginBottom: '10px'}} icon={<PlusOutlined />}>Add Input</Button>
                                        </Space> */}
                                        <Row justify="space-between">
                                          <Col>
                                            <Title level={5} style={{margin : 0}}>Input List</Title>
                                          </Col>
                                          <Col>
                                          {fileBased && <Button type="primary" onClick={() => setSelectInputType(true)} style={{marginBottom: '10px'}} icon={<PlusOutlined />}>Add Input</Button>}
                                          {!fileBased && <Button type="primary" onClick={() => setAddInput(true)} style={{marginBottom: '10px'}} icon={<PlusOutlined />}>Add Input</Button>}
                                          </Col>
                                        </Row>
                                        <Collapse defaultActiveKey={['1']} bordered={false} items={items} style={{maxHeight: '450px', overflow: 'auto'}} />
                                    </>
                                ,
                            },
                            {
                                label: 'View',
                                key: '2',
                                children: 'Content of Tab 2',
                            },
                            {
                                label: 'Info',
                                key: '3',
                                children: 'Content of Tab 3',
                            }
                        ]
                    }
                />
                {/* </Layout> */}
            </Sider>
            <Layout>
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
              <Layout style={{padding: '10px'}}>
                {/* <Space style={{height: '100%', padding: '20px'}}> */}
                <Row justify="center" gutter={[10, 10]} style={{overflow: 'auto'}}>
                    <Col>
                    <Card size="small">
                      <Space direction="vertical">
                      <Title level={5} style={{margin: 0}}>Input 1</Title>
                      <img src="https://www.marineinsight.com/wp-content/uploads/2021/04/Black-sea-1.png" width="100%" height="100%" style={{maxHeight: '150px'}} />
                      </Space>
                    </Card>
                    </Col>
                    <Col>
                    <Card size="small">
                      <Space direction="vertical">
                      <Title level={5} style={{margin: 0}}>Input 2</Title>
                      <img src="https://www.marineinsight.com/wp-content/uploads/2021/04/Black-sea-1.png" width="100%" height="100%" style={{maxHeight: '150px'}} />
                      </Space>
                    </Card>
                    </Col>
                    <Col>
                    <Card size="small">
                      <Space direction="vertical">
                      <Title level={5} style={{margin: 0}}>Input 3</Title>
                      <img src="https://www.marineinsight.com/wp-content/uploads/2021/04/Black-sea-1.png" width="100%" height="100%" style={{maxHeight: '150px'}} />
                      </Space>
                    </Card>
                    </Col>
                    <Col>
                    <Card size="small">
                      <Space direction="vertical">
                      <Title level={5} style={{margin: 0}}>Input 4</Title>
                      <img src="https://www.marineinsight.com/wp-content/uploads/2021/04/Black-sea-1.png" width="100%" height="100%" style={{maxHeight: '150px'}} />
                      </Space>
                    </Card>
                    </Col>
                    <Col>
                    <Card size="small">
                      <Space direction="vertical">
                      <Title level={5} style={{margin: 0}}>Input 5</Title>
                      <img src="https://www.marineinsight.com/wp-content/uploads/2021/04/Black-sea-1.png" width="100%" height="100%" style={{maxHeight: '150px'}} />
                      </Space>
                    </Card>
                    </Col>
                    {/* <Col>
                    <Card size="small">
                      <Space direction="vertical">
                      <Title level={5} style={{margin: 0}}>Input 1</Title>
                      <img src="https://www.marineinsight.com/wp-content/uploads/2021/04/Black-sea-1.png" width="100%" height="100%" style={{maxHeight: '150px'}} />
                      </Space>
                    </Card>
                    </Col>
                    <Col>
                    <Card size="small">
                      <Space direction="vertical">
                      <Title level={5} style={{margin: 0}}>Input 1</Title>
                      <img src="https://www.marineinsight.com/wp-content/uploads/2021/04/Black-sea-1.png" width="100%" height="100%" style={{maxHeight: '150px'}} />
                      </Space>
                    </Card>
                    </Col>
                    <Col>
                    <Card size="small">
                      <Space direction="vertical">
                      <Title level={5} style={{margin: 0}}>Input 1</Title>
                      <img src="https://www.marineinsight.com/wp-content/uploads/2021/04/Black-sea-1.png" width="100%" height="100%" style={{maxHeight: '150px'}} />
                      </Space>
                    </Card>
                    </Col>
                    <Col>
                    <Card size="small">
                      <Space direction="vertical">
                      <Title level={5} style={{margin: 0}}>Input 1</Title>
                      <img src="https://www.marineinsight.com/wp-content/uploads/2021/04/Black-sea-1.png" width="100%" height="100%" style={{maxHeight: '150px'}} />
                      </Space>
                    </Card>
                    </Col>
                    <Col>
                    <Card size="small">
                      <Space direction="vertical">
                      <Title level={5} style={{margin: 0}}>Input 1</Title>
                      <img src="https://www.marineinsight.com/wp-content/uploads/2021/04/Black-sea-1.png" width="100%" height="100%" style={{maxHeight: '150px'}} />
                      </Space>
                    </Card>
                    </Col>
                    <Col>
                    <Card size="small">
                      <Space direction="vertical">
                      <Title level={5} style={{margin: 0}}>Input 1</Title>
                      <img src="https://www.marineinsight.com/wp-content/uploads/2021/04/Black-sea-1.png" width="100%" height="100%" style={{maxHeight: '150px'}} />
                      </Space>
                    </Card>
                    </Col> */}
                </Row>
                {/* </Space> */}
              </Layout>
            </Layout>
        </Layout>
        <Modal open={saveRecording} centered okText={"Save"} title="Save Recording" onOk={handleAddInput} onCancel={handleCancel}>
          <Space direction="vertical" style={{width: '100%', padding: '20px 0'}}>
            <Text>Recording Name</Text>
            <Input placeholder="Enter recording name" />
            <Text>Location</Text>
            <Input placeholder="Enter recording location" />
          </Space>
        </Modal>
        <Modal open={selectInputType} centered okText={"Select"} title="Select Input Type" onOk={handleSelectInput} onCancel={handleCancel}>
          <Space direction="vertical" style={{width: '100%', padding: '30px 0'}}>
            <Select
              placeholder="Select input type"
              defaultValue={inputType}
              onChange={handleSelect}
              style={{width: '100%'}}
              options={[
                { value: 'streaming', label: 'Streaming' },
                { value: 'video', label: 'Video' }
              ]}
            />
          </Space>
        </Modal>
        <Modal open={addVideo} centered okText={"Add"} title="Add Video" onOk={handleAddVideo} onCancel={handleCancel}>
          <form onSubmit={handleAddInput2}>
            <Space direction="vertical" style={{width: '100%', padding: '20px 0'}}>
              {/* <Input name="createdUserId" value={userID} style={{display: 'none'}} /> */}
              <Text>Camera Name</Text>
              <Input placeholder="Enter camera name" name="cameraName" onChange={handleCameraName} />
              <Text>Camera Type</Text>
              <Input placeholder="Enter camera type" name="cameraType" onChange={handleCameraType} />
              <Text>Camera URL</Text>
              <Input placeholder="Enter camera URL" name="cameraUrl" onChange={handleCameraUrl} />
              <Row gutter={10}>
                <Col span={12}>
                  <Space direction="vertical" style={{width: '100%'}}>
                    <Text>Username</Text>
                    <Input placeholder="Enter username" name="username" onChange={handleUsername} />
                  </Space>
                </Col>
                <Col span={12}>
                  <Space direction="vertical" style={{width: '100%'}}>
                    <Text>Password</Text>
                    <Input.Password placeholder="Enter password" name="password" onChange={handlePassword} />
                  </Space>
                </Col>
              </Row>
              <Text>Location</Text>
              <Input placeholder="Enter camera location" name="location" onChange={handleLocation} />
              <Row gutter={10}>
                <Col span={12}>
                  <Space direction="vertical" style={{width: '100%'}}>
                    <Text>Latitude</Text>
                    <Input placeholder="Enter camera latitude" name="latitude" onChange={handleLatitude} />
                  </Space>
                </Col>
                <Col span={12}>
                  <Space direction="vertical" style={{width: '100%'}}>
                    <Text>Longitude</Text>
                    <Input placeholder="Enter camera longitude" name="longitude" onChange={handleLongitude} />
                  </Space>
                </Col>
              </Row>
              {/* <Text>Latitude</Text>
              <Input placeholder="Enter camera latitude" name="latitude" onChange={handleLatitude} />
              <Text>Longitude</Text>
              <Input placeholder="Enter camera longitude" name="longitude" onChange={handleLongitude} /> */}
              {/* <Text>Camera URL</Text>
              <Input placeholder="Enter camera URL" name="cameraUrl" onChange={handleCameraUrl} />
              <Text>Username</Text>
              <Input placeholder="Enter username" name="username" onChange={handleUsername} />
              <Text>Password</Text>
              <Input.Password placeholder="Enter password" name="password" onChange={handlePassword} /> */}
              {/* <Button htmlType="submit">Add</Button> */}
            </Space>
          </form>
        </Modal>
        <Modal open={addInput} centered okText={"Add"} title="Add Input" onOk={handleAddInput} onCancel={handleCancel}>
          <form onSubmit={handleAddInput2}>
            <Space direction="vertical" style={{width: '100%', padding: '20px 0'}}>
              {/* <Input name="createdUserId" value={userID} style={{display: 'none'}} /> */}
              <Text>Camera Name</Text>
              <Input placeholder="Enter camera name" name="cameraName" onChange={handleCameraName} />
              <Text>Camera Type</Text>
              <Input placeholder="Enter camera type" name="cameraType" onChange={handleCameraType} />
              <Text>Camera URL</Text>
              <Input placeholder="Enter camera URL" name="cameraUrl" onChange={handleCameraUrl} />
              <Row gutter={10}>
                <Col span={12}>
                  <Space direction="vertical" style={{width: '100%'}}>
                    <Text>Username</Text>
                    <Input placeholder="Enter username" name="username" onChange={handleUsername} />
                  </Space>
                </Col>
                <Col span={12}>
                  <Space direction="vertical" style={{width: '100%'}}>
                    <Text>Password</Text>
                    <Input.Password placeholder="Enter password" name="password" onChange={handlePassword} />
                  </Space>
                </Col>
              </Row>
              <Text>Location</Text>
              <Input placeholder="Enter camera location" name="location" onChange={handleLocation} />
              <Row gutter={10}>
                <Col span={12}>
                  <Space direction="vertical" style={{width: '100%'}}>
                    <Text>Latitude</Text>
                    <Input placeholder="Enter camera latitude" name="latitude" onChange={handleLatitude} />
                  </Space>
                </Col>
                <Col span={12}>
                  <Space direction="vertical" style={{width: '100%'}}>
                    <Text>Longitude</Text>
                    <Input placeholder="Enter camera longitude" name="longitude" onChange={handleLongitude} />
                  </Space>
                </Col>
                <Col>
                  <Space style={{paddingTop: '20px'}}>
                    <Checkbox />
                    <Text>Start Recording</Text>
                  </Space>
                </Col>
              </Row>
              {/* <Text>Latitude</Text>
              <Input placeholder="Enter camera latitude" name="latitude" onChange={handleLatitude} />
              <Text>Longitude</Text>
              <Input placeholder="Enter camera longitude" name="longitude" onChange={handleLongitude} /> */}
              {/* <Text>Camera URL</Text>
              <Input placeholder="Enter camera URL" name="cameraUrl" onChange={handleCameraUrl} />
              <Text>Username</Text>
              <Input placeholder="Enter username" name="username" onChange={handleUsername} />
              <Text>Password</Text>
              <Input.Password placeholder="Enter password" name="password" onChange={handlePassword} /> */}
              {/* <Button htmlType="submit">Add</Button> */}
            </Space>
          </form>
        </Modal>
      </>
    );
}

export default Streaming;