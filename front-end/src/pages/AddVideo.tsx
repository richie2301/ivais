import React, { useEffect, useState } from 'react';
import { Input, Button, Modal, Progress, DatePicker, Select, Divider, Spin } from 'antd';
import { Space, Typography, Row, Col, List } from 'antd';
// import { useHistory } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
// import type { InputRef } from 'antd';
import { PlusOutlined, LoadingOutlined, CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons';

import useUserStore from '../store/userStore';
import UploadFile from '../components/UploadFile';

import Map from '../components/Map';
// import useMqttStore from '../store/mqttStore';

// client.on('message', (topic: string, message: Buffer) => {
  // success('Video added successfully - mqtt')
  // console.log(`Message received on ${topic}: ${message.toString()}`);
// });

// client.on('error', (err: Error) => {
//   console.error('Failed to connect to MQTT broker:', err);
// });

// client.on("message", (message) => {
//   console.log(topic, message.toString());
// }
// );

const { Text, Title } = Typography;
const { TextArea } = Input;

// const CreateButton = () => {
//     Modal.info({
//       title: 'This is a notification message',
//       content: (
//         <div>
//           <p>some messages...some messages...</p>
//           <p>some messages...some messages...</p>
//         </div>
//       ),
//       onOk() {},
//     });
//   };

// let index = 0;

interface UserStoreState {
  userID: string;
  // define other properties here
}

// interface MqttStoreState {
//   status: string;
//   // define other properties here
// }

type AddVideoProps = {
  success: (message: string) => void;
  loadingPage: (status: boolean) => void;
  // loadingPage: boolean;
  loading: boolean;
};


const AddVideo: React.FC<AddVideoProps> = ({success, loading, loadingPage}) => {
  // if ((useMqttStore.getState() as MqttStoreState).status === 'analyze video finished') {
  //   success('Video added successfully - mqtt')
  // }

  // console.log((useMqttStore.getState() as MqttStoreState).status)

  // useEffect(() => {
  //   console.log((useMqttStore.getState() as MqttStoreState).status)
  // } )

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [isAddCaseModalOpen, setIsAddCaseModalOpen] = useState(false);
  const [uploadVideoModal, setUploadVideoModal] = useState(false);
  const [uploadStatusModal, setUploadStatusModal] = useState(false);

  // const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const createdUserId = (useUserStore.getState() as UserStoreState).userID;
  
  const updateProgress = () => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      if (progress > 100) {
        clearInterval(interval);
      }
      setProgressPercentage(progress);
    }, 1000);
  };

  const showModal = () => {
    updateProgress();
    setIsModalOpen(true);
  };

//   const handleOk = () => {
//     setIsModalOpen(false);
//   };

  const handleCancel = () => {
    setIsModalOpen(false);
    setUploadVideoModal(false);
    setUploadStatusModal(false);
  };

  const handleNextClick = () => {
    navigate("/analyzeVideo")
  }

  const filterOption = (input: string, option?: { label: string; value: string }) =>
  (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

  // const [items, setItems] = useState(['jack', 'lucy']);
  // const [name, setName] = useState('');
  // const inputRef = useRef<InputRef>(null);

  // const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setName(event.target.value);
  // };

  // const addItem = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
  //   e.preventDefault();
  //   setItems([...items, name || `New item ${index++}`]);
  //   setName('');
  //   setTimeout(() => {
  //     inputRef.current?.focus();
  //   }, 0);
  // };

  const showAddCaseModal = () => {
    setIsAddCaseModalOpen(true);
  }

  const handleAddCaseModalCancel = () => {
    setIsAddCaseModalOpen(false);
  }

  const handleAddCaseModalOk = () => {
    setIsAddCaseModalOpen(false);
    success('Case added successfully')
  }

  // const createdUserId = "60ea2ba1-9f1b-4b4e-9810-e8eea3c832e5"
// const caseName = "Case 1"
// const faceFiles = [1, 2, 3]
// const faceNames = [4, 5, 6]
// const teamName = "Team A"
// const teamMemberUserId = [7, 8, 9]
// const videoName = "Video 1"
// const latitude = 100
// const longitude = 50
// const videoFile = "101010"

// const url = "http://192.168.8.124:5000/api/Video/analyze"
// const url = "http://192.168.8.221:5025/api/Video/analyze"
const url = import.meta.env.VITE_API_URL

// const [thisfile, setThisFile] = useState('');

// const handleChange = event => {
//   setThisFile(event.target.value);

//   console.log('value is:', event.target.value);
// };
// const videoData = new FormData();
// const handleChange = (event: any): void => {

//   videoData.append('file', event.target.files[0]);
//   console.log(event.target.files[0]);
// }

//   const uploadVideo = () => {
//     fetch(url, {
//         method: 'POST',
//       headers: {
//         'Content-Type': "application/json"
//       },
//       mode: 'no-cors',
//       redirect: 'follow',
//       body: JSON.stringify({
//         createdUserId: createdUserId,
//         caseName: caseName,
//         faceFiles: null,
//         teamName: null,
//         teamMemberUserId: null,
//         videoName: null,
//         latitude: latitude,
//         longitude: longitude,
//         videoFile: videoData
//       })
//     }).then((response) => {
//         navigate('/')
//         console.log(response)
//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }
//         else {
//           navigate('/')
//         }
//       })
//       .then((data) => {
//         console.log(data);
//       })
//       .catch((error) => {
//         console.error('There was a problem with the fetch operation:', error);
//       });
//   }

const videoData = new FormData();

const handleChange = (event: any): void => {
  videoData.append('file', event.target.files[0]);
  console.log(event.target.files[0]);
}

// const uploadVideo = () => {
//   videoData.append('createdUserId', createdUserId);
//   videoData.append('caseName', caseName);
//   videoData.append('latitude', latitude);
//   // append other fields as necessary

//   fetch(url + '/api/Video/analyze', {
//     method: 'POST',
//     body: videoData
//   })
//   .then(response => {
//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }
//     return response.json();
//   })
//   .then(data => {
//     console.log(data);
//   })
//   .catch(error => {
//     console.error('There was a problem with the fetch operation:', error);
//   });
// }

// const testLoadingPage = () => {
//   loadingPage(true);
//   console.log("loading page")
//   setTimeout(() => {
//     loadingPage(false);
//     console.log("loading page false")
//   }, 5000);
// }

  // const testSubmit = (event: any) => {
  //   const form = event.target;
  //   const formData = new FormData(form)
  //   const formJson = Object.fromEntries(formData.entries());
  //   console.log(formJson);
  // }

  const [latitude, setLatitude] = useState(0)
  const [longitude, setLongitude] = useState(0)
  const [source, setSource] = useState('')
  const handleSubmit = (event: any): void => {
    loadingPage(true);
    // setLoading(true);
    // loadingPage(true);
    // success("clicked handle submit")

    // if (allowAddVideo) {
    //   setLoading(false);
    //   success('You have reached your maximum video upload limit')
    //   return;
    // }
    // else {
      event.preventDefault();
      const form = event.target;
      const formData = new FormData(form)

      formData.append('evidenceSourceId', source)

      // console.log("clicked")

      // console.log(formData);

      // const formJson = Object.fromEntries(formData.entries());
      // console.log(formJson);

      // console.log(formData.get("caseName"));

      // console.log(JSON.stringify(formJson["caseName"]));

      fetch(url + '/api/Evidence/videofootage/add', { 
        method: 'POST', 
        body: formData,
      })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        else {
          // setLoading(false);
          loadingPage(false);
          success('Video added successfully')
          navigate('/evidence')
        }
        // return response.json();
      })
      .then(data => {
        console.log(data);
      })
      .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
      });

    // }

    // const formJson = Object.fromEntries(formData.entries());
    // console.log(formJson);
  };

  const data = [
    {
      id: 1,
      name: 'Video 1',
      status: 'Completed',
    },
    {
      id: 2,
      name: 'Video 2',
      status: 'Completed',
    },
    {
      id: 3,
      name: 'Video 3',
      status: 'In Progress',
    },
    {
      id: 4,
      name: 'Video 4',
      status: 'In Progress',
    },
    {
      id: 5,
      name: 'Video 5',
      status: 'Waiting',
    },
    {
      id: 6,
      name: 'Video 6',
      status: 'Waiting',
    },
    {
      id: 7,
      name: 'Video 7',
      status: 'Waiting',
    },
    {
      id: 8,
      name: 'Video 8',
      status: 'Failed',
    },
    {
      id: 9,
      name: 'Video 9',
      status: 'Failed',
    }
  ];

  // if(data.length > 5) {
  //   data = data.slice(0, 5);
  // }

  const handleCancelAddVideo = () => {
    navigate('/evidence');
  }

  const [sourceOptions, setSourceOptions] = useState([])
  useEffect(() => {
    fetch(url + '/api/Evidence/source/list', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    }
    ).then(data => {
      const transformedData = data.map((entry: any) => ({
        value: entry.evidenceSourceId,
        label: entry.name,
      }));
      setSourceOptions(transformedData);
    }).catch(error => {
      console.error('There was a problem with the fetch operation:', error);
    })
}, [])

const handleSource = (e: any) => {
  setSource(e);
}
  return (
    <>
      <Spin tip="Loading..." size="large" spinning={loading}>
      {/* <Button onClick={testLoadingPage}>Test Loading</Button> */}
        <Row justify="space-between" style={{}}>
            <Col>
              <Title level={4}>Add Evidence</Title>
            </Col>
            {/* <Col>
              <Space style={{height: '100%'}} align="center">
                <Button size="large" icon={<HistoryOutlined />} onClick={() => setUploadStatusModal(true)}></Button>
              </Space>
            </Col> */}
        </Row>
        <Modal centered open={uploadStatusModal} onCancel={handleCancel} title="Upload Status">
          <List
            bordered
            dataSource={data}
            style={{margin: '20px 0', maxHeight: '300px', overflow: 'auto'}}
            renderItem={(item) => (
              <List.Item>
                {/* <Typography.Text mark>[ITEM]</Typography.Text> {item} */}
                <Row justify="space-between" style={{width: '100%'}}>
                  <Col>
                    <Space>
                      {/* {item.status == 'In Progress' || item.status == 'Waiting' ? <Spin indicator={<LoadingOutlined style={{ fontSize: 15 }} spin />} /> : null} */}
                      {item.status == 'In Progress' || item.status == 'Waiting' ? <Text><LoadingOutlined /></Text> : null}
                      {item.status == 'Completed' ? <Text type="success"><CheckCircleFilled /></Text> : null}
                      {item.status == 'Failed' ? <Text type="danger"><CloseCircleFilled /></Text> : null}
                      <Text>{item.name}</Text>
                    </Space>
                  </Col>
                  <Col>
                    <Text>{item.status}</Text>
                  </Col>
                </Row>
              </List.Item>
            )}
          />
        </Modal>
        <Space direction="vertical" style={{width: '100%', paddingTop: '10px'}}>
          <form method="post" onSubmit={handleSubmit} style={{width: '100%'}}>
            {/* <Space direction="vertical" style={{width: '100%'}}> */}
            <Input style={{display: 'none'}} name="creatorUserId" placeholder="createdUserId" value={createdUserId} />
              <Row gutter={[20, 10]}>
                <Col flex="auto">
                  <Space direction="vertical" style={{width: '100%'}}>
                    <Text>Evidence Name</Text>
                    <Input name="name" placeholder="Enter evidence name" />
                    <Text>Address</Text>
                    <Input name="location" placeholder="Enter location address" />
                    <Text>File</Text>
                    <Input name="file" placeholder="Upload file here" type="file" onChange={handleChange} />
                    <Text>Source</Text>
                    <Select placeholder="Select source" style={{ width: '100%' }} options={sourceOptions} onChange={handleSource} />
                    <Text>Description</Text>
                    <TextArea name="description" placeholder="Enter evidence description" />
                    <Input name="latitude" value={latitude} style={{display: 'none'}} />
                    <Input name="longitude" value={longitude} style={{display: 'none'}} />
                    <Input name="recordingStartedAt" style={{display: 'none'}} />
                    <Input name="duration" style={{display: 'none'}} />
                  </Space>
                </Col>
                <Col flex="none" style={{height: '100%'}}>
                  <Space direction="vertical">
                    <Space>
                    <Text>Select Location</Text>
                    <Text style={{color: 'grey'}}>(Drag pin for more precise location)</Text>
                    </Space>
                    <Space.Compact style={{height: '350px', color: 'white'}}>
                      <Map latitude={setLatitude} longitude={setLongitude} />
                    </Space.Compact>
                  </Space>
                </Col>
              </Row>
              <Row justify="end" gutter={10} style={{padding: '10px 0'}}>
                <Col>
                  <Button onClick={handleCancelAddVideo}>
                    Cancel
                  </Button>
                </Col>
                <Col>
                  <Button type="primary" htmlType="submit">
                    Submit
                  </Button>
                </Col>
              </Row>
            {/* </Space> */}
          </form>
        </Space>
        <Modal open={uploadVideoModal} onCancel={handleCancel} title="Upload File">
          <UploadFile />
        </Modal>
        <div style={{display: 'none'}}>
            <form>
                <Space direction='vertical' style={{width: '100%'}}>
                    <Text>Video Name</Text>
                    <Input placeholder="Enter video name" />
                    <Text>Datetime</Text>
                    <DatePicker showTime style={{width: '100%'}} />
                    <Text>Location</Text>
                    <Input placeholder="Enter location" />
                    <Text>Team</Text>
                    <Select
                        placeholder="Select team"
                        style={{ width: '100%' }}
                        options={[
                            { value: 'a', label: 'Team A' },
                            { value: 'b', label: 'Team B' },
                            { value: 'c', label: 'Team C' },
                        ]}
                    />
                    <Text>Case</Text>
                    <Select
                        placeholder="Select case"
                        showSearch
                        style={{ width: '100%' }}
                        filterOption={filterOption}
                        options={[
                            { value: 'case-a', label: 'Case A' },
                            { value: 'case-b', label: 'Case B' },
                            { value: 'case-c', label: 'Case C' },
                        ]}
                        // options={items.map((item) => ({ label: item, value: item }))}
                        dropdownRender={(menu) => (
                          <>
                            {menu}
                            <Divider style={{ margin: '8px 0' }} />
                            <Space style={{ padding: '0 8px 4px' }}>
                              {/* <Input
                                placeholder="Please enter item"
                                ref={inputRef}
                                value={name}
                                onChange={onNameChange}
                              /> */}
                              <Button type="text" icon={<PlusOutlined />} onClick={showAddCaseModal}>
                                New Case
                              </Button>
                            </Space>
                          </>
                        )}
                    />
                    {/* <Text>Team</Text>
                    <Input placeholder="Enter team name" /> */}
                    <Text>Video Description</Text>
                    <TextArea placeholder="Enter video description" autoSize />
                    <Text>Upload Video</Text>
                    <Input type="file" onChange={handleChange} />
                    {/* <Text>Upload Target Photo</Text>
                    <Input type="file" /> */}
                    <div style={{textAlign: 'right', marginTop: 20}}>
                        <Button size="large" type="primary" onClick={showModal}>Next</Button>
                        <Modal centered maskClosable={false} okText={"Next"} okButtonProps={{disabled: progressPercentage < 100}} title="Load Video" open={isModalOpen} onOk={handleNextClick} onCancel={handleCancel} closeIcon={false}>
                            <Progress percent={progressPercentage} />
                        </Modal>
                        <Modal centered title="New Case" open={isAddCaseModalOpen} onCancel={handleAddCaseModalCancel} onOk={handleAddCaseModalOk}>
                          <Space direction='vertical' style={{width: '100%', padding: '30px 0'}}>
                            <Text>Case Name</Text>
                            <Input placeholder="Enter case name" />
                            <Text>Case Description</Text>
                            <TextArea placeholder="Enter case description" autoSize />
                          </Space>
                        </Modal>
                    </div>
                </Space>
            </form>
        </div>
      </Spin>
    </>
  );
}

export default AddVideo;