import React, { useEffect, useState } from 'react';
import { Input, Button, Select, Divider, Modal, Row, Col, DatePicker, Tag, Checkbox, Spin, Avatar } from 'antd';
import { Space, Typography } from 'antd';
// import { useHistory } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import type { SelectProps } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { DatePickerProps, RangePickerProps } from 'antd/es/date-picker';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';

import useUserStore from '../store/userStore';
import useCreateCaseStore from '../store/createCaseStore';
// import start from 'mqtt/bin/pub';

const { Text, Title } = Typography;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

const url = import.meta.env.VITE_API_URL;

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

type CreateCaseProps = {
    success: (message: string) => void;
    error: (message: string) => void;
    // loadingPage: (status: boolean) => void;
    // loading: boolean;
}

interface UserStoreState {
    userID: string;
    // define other properties here
  }

const CreateCase: React.FC<CreateCaseProps> = ({success, error}) => {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [progressPercentage, setProgressPercentage] = useState(0);
    const [personModal, setPersonModal] = useState(false);

  const navigate = useNavigate();

  const [caseName, setCaseName] = useState("");
  // const [cameraIds, setCameraIds] = useState<string[]>([]);
    const [videoIds, setVideoIds] = useState<string[]>([]);
    // const [selectedVideos, setSelectedVideos] = useState<string[]>([]);
    const [startTime, setStartTime] = useState(0);
    const [endTime, setEndTime] = useState(0);
    const [personIds, setPersonIds] = useState<string[]>([]);
    // const [location, setLocation] = useState("");
    // const [videos, setVideos] = useState<string[]>([]); // [video1, video2, video3
    // const [caseDescription, setCaseDescription] = useState("");
    // const [team, setTeam] = useState("");
    // const [people, setPeople] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    const handleCaseName = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCaseName(e.target.value);
    }

    // const handleLocation = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     setLocation(e.target.value);
    // }

    // const handleSelectCamera = (value: string[]) => {
    //     // setVideos(value);
    //     setCameraIds(value);
    // }

    const handleSelectVideo = (value: string[]) => {
        // setVideos(value);
        setVideoIds(value);
    }

    // const handleCaseDescription = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    //     setCaseDescription(e.target.value);
    // }

    // const handleTeamChange = (value: string) => {
    //     setTeam(value);
    // }

    const handleSelectPeople = (value: string[]) => {
        // setPeople(value);
        setPersonIds(value);
    }

    const [addCameraModal, setAddCameraModal] = useState(false);
    // const showAddCameraModal = () => {
    //     setAddCameraModal(true);
    // }

    // const [fileBased, setFileBased] = useState(true);
    const [cameraType, setCameraType] = useState<string>('');
    const [cameraName, setCameraName] = useState<string>('');
    const [location, setLocation] = useState<string>('');
    const [latitude, setLatitude] = useState<number | null>(null);
    const [longitude, setLongitude] = useState<number | null>(null);
    const [cameraUrl, setCameraUrl] = useState<string>('');
    const [username, setUsername] = useState<string | null>(null);
    const [password, setPassword] = useState<string  | null>(null);

    const handleAddCamera = () => {
        // if (username === '') {
        //   setUsername(null)
        // }
        // if (password === '') {
        //   setPassword(null)
        // }
        // setFileBased(true);
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
            setAddCameraModal(false);
            // fetchCamera();
            success("Successfully added camera!")
            // console.log("Succesfully added input")
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

      const handleCancel = () => {
        setAddCameraModal(false);
        setPersonModal(false);
      }

      const submitAddCamera = (event: any): void => {
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

    // const [addCamera, setAddCamera] = useState(false);

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [personID, setPersonID] = useState("");
    const [jobPosition, setJobPosition] = useState("");
    // const [image, setImage] = useState("");
    const [images, setImages] = useState<string[]>([]);

    // const [checkAllVideos, setCheckAllVideos] = useState(false);

    const handleFirstName = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFirstName(e.target.value);
    }

    const handleLastName = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLastName(e.target.value);
    }

    const handlePersonID = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPersonID(e.target.value);
    }

    const handleJobPosition = (e: React.ChangeEvent<HTMLInputElement>) => {
        setJobPosition(e.target.value);
    }

    const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        // setImage(e.target.value);
        // const fileList = e.target.files;
        // const file = fileList[0];
        // const reader = new FileReader();
        // reader.readAsDataURL(file);
        // reader.onload = () => {
        //     setImage(reader.result as string);
        //     setImages([...images, reader.result as string]);
        // }
        
        //get file name
        const fileList = e.target.files;
        if (fileList === null) {
            return;
        }
        const tempImages: string[] = [];
        Array.from(fileList).forEach((file) => {
            // const reader = new FileReader();
            // reader.readAsDataURL(file);
            // reader.onload = () => {
            //     setImages([...images, reader.result as string]);
            // }
            console.log(file.name);
            // setImages([...images, file.name]);
            tempImages.push(file.name);
          });
        setImages(tempImages);
    }

    // const [name, setName] = useState("");
    // const [email, setEmail] = useState("");
    const [group, setGroup] = useState("");
    // const [company, setCompany] = useState("");
    // const [role, setRole] = useState("");
    // const [notes, setNotes] = useState("");
    // const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);
    const [faceFiles, setFaceFiles] = useState<File[]>([]);

    // const handleName = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     setName(e.target.value);
    // }

    // const handleEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     setEmail(e.target.value);
    // }

    const handleGroup = (e: any) => {
        setGroup(e);
    }

    // const handleCompany = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     setCompany(e.target.value);
    // }

    // const handleRole = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     setRole(e.target.value);
    // }

    // const handleNotes = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    //     setNotes(e.target.value);
    // }

    // const handleProfilePicture = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     const fileList = e.target.files;
    //     if (fileList === null) {
    //         return;
    //     }
    //     setProfilePictureFile(fileList[0]);
    // }

    const handleFace = (e: React.ChangeEvent<HTMLInputElement>) => {
        const fileList = e.target.files;
        if (fileList === null) {
            return;
        }
        const tempFaceFiles: File[] = [];
        Array.from(fileList).forEach((file) => {
            tempFaceFiles.push(file);
          });
        setFaceFiles(tempFaceFiles);
    }

    // const roleOptions: SelectProps['options'] = [
    //   // {
    //   //   value: 'VIP',
    //   //   label: 'VIP',
    //   // },
    //   // {
    //   //   value: 'EMPLOYEE',
    //   //   label: 'Employee',
    //   // },
    //   // {
    //   //   value: 'BLOCKLIST',
    //   //   label: 'Blocklist',
    //   // }
    // ];

    const [groupOptions, setGroupOptions] = useState<SelectProps['options']>([]);

    useEffect(() => {
      fetch (url + '/api/Person/group/list', {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json'
              }
            })
            .then((response) => {
              if (response.ok) {
                  return response.json();
              }
              else {
                  throw new Error("Something went wrong");
              }
            })
            .then((data) => {
              console.log(data);
              setGroupOptions(data.map((a: any) => ({
                value: a,
                label: a
              })))
            })
          }, []);

    const addVideo = () => {
        navigate("/addVideo")
    }

    const addPerson = () => {
        fetch (url + '/person/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                firstName: firstName,
                lastName: lastName,
                personID: personID,
                jobPosition: jobPosition,
                image: images
            })
        })
        success("Successfully added person!")
        setPersonModal(false);
    }

//   const updateProgress = () => {
//     let progress = 0;
//     const interval = setInterval(() => {
//       progress += 10;
//       if (progress > 100) {
//         clearInterval(interval);
//       }
//       setProgressPercentage(progress);
//     }, 1000);
//   };

//   const showModal = () => {
//     updateProgress();
//     setIsModalOpen(true);
//   };

//   const handleOk = () => {
//     setIsModalOpen(false);
//   };

//   const handleCancel = () => {
//     setIsModalOpen(false);
//   };
const createdUserId = (useUserStore.getState() as UserStoreState).userID;

  const handleNextClick = () => {
    // success("Successfully created case!")
    // navigate("/addVideo")

    // loadingPage(true);
    setLoading(true);

    const data = {
        createdUserId: createdUserId,
        caseName: caseName,
        // cameraIds: cameraIds,
        videoIds: videoIds,
        startTime: startTime,
        endTime: endTime,
        personIds: personIds,
        // location: location,
        // videos: videos,
        // caseDescription: caseDescription,
        // team: team,
        // people: people
    };
    console.log(data);

    // const data = {
    //     caseName: caseName,
    //     location: location,
    //     videos: videos,
    //     // caseDescription: caseDescription,
    //     // team: team,
    //     people: people
    // };
    // console.log(data);
    fetch (url + '/api/Case/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            createdUserId: createdUserId,
            caseName: caseName,
            // cameraIds: cameraIds,
            videoIds: videoIds,
            startTime: startTime,
            endTime: endTime,
            personIds: personIds,
            // location: location,
            // videos: videos,
            // caseDescription: caseDescription,
            // team: team,
            // people: people
        })
    })
    .then((response) => {
        if (response.ok) {
            setLoading(false);
            return response.json();
        }
        else {
            throw new Error("Something went wrong");
        }
    })
    .then((data) => {
        console.log(data);
        useCreateCaseStore.setState({data: data});
        success("Successfully created case!")
        navigate("/analyzeCase")
    })
    .catch((error) => {
        console.log(error);
    })
  }

//   const videoOptions: SelectProps['options'] = [
//     {
//         value: 'Video 1',
//         label: 'Video 1',
//     },
//     {
//         value: 'Video 2',
//         label: 'Video 2',
//     },
//   ];
const [videoOptions, setVideoOptions] = useState<SelectProps['options']>([]);

useEffect(() => {
    fetch (url + '/api/Video/list', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then((response) => {
        if (response.ok) {
            return response.json();
        }
        else {
            throw new Error("Something went wrong");
        }
    })
    .then((data) => {
        console.log(data);
        
        // data.map((a: any) => {
        //     videoOptions.push({
        //         value: a.videoId,
        //         label: a.videoName
        //     })
        // })
        setVideoOptions(data.map((a: any) => ({
            value: a.videoId,
            label: a.videoName
        })))
        // console.log(videoOptions);
        // for (let i = 0; i < data.length; i++) {
        //     videoOptions.push({
        //         value: data[i].videoId,
        //         label: data[i].videoName
        //     })
        //     console.log(data[i].videoId);
        // }
    })
    .catch((error) => {
        console.log(error);
    })  
}, [])

                   

//   const cameraOptions: SelectProps['options'] = [
//     {
//         value: 'Camera 1',
//         label: 'Camera 1',
//     },
//     {
//         value: 'Camera 2',
//         label: 'Camera 2',
//     },
//   ];
// const [cameraOptions, setCameraOptions] = useState<SelectProps['options']>([]);
// const fetchCamera = () => {
//     fetch (url + '/api/Camera/list', {
//         method: 'GET',
//         headers: {
//             'Content-Type': 'application/json'
//         }
//     })
//     .then((response) => {
//         if (response.ok) {
//             return response.json();
//         }
//         else {
//             throw new Error("Something went wrong");
//         }
//     })
//     .then((data) => {
//         console.log(data);
        
//         // data.map((a: any) => {
//         //     videoOptions.push({
//         //         value: a.videoId,
//         //         label: a.videoName
//         //     })
//         // })
//         setCameraOptions(data.map((a: any) => ({
//             value: a.cameraId,
//             label: a.cameraName
//         })))
//         // console.log(videoOptions);
//         // for (let i = 0; i < data.length; i++) {
//         //     videoOptions.push({
//         //         value: data[i].videoId,
//         //         label: data[i].videoName
//         //     })
//         //     console.log(data[i].videoId);
//         // }
//     })
//     .catch((error) => {
//         console.log(error);
//     })
    
//     }

// useEffect(() => {
//     fetchCamera()}, [])

    //   const personOptions: SelectProps['options'] = [
    //     {
    //         value: 'John Doe',
    //         label: 'John Doe',
    //         image: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
    //         jobPosition: 'CEO',
    //     },
    //     {
    //         value: 'Jane Doe',
    //         label: 'Jane Doe',
    //         image: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
    //         jobPosition: 'CTO',
    //     },
    //   ];

const [personOptions, setPersonOptions] = useState<SelectProps['options']>([]);
useEffect(() => {
    fetch (url + '/api/Person/list', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then((response) => {
        if (response.ok) {
            return response.json();
        }
        else {
            throw new Error("Something went wrong");
        }
    })
    .then((data) => {
        console.log(data);
        
        // data.map((a: any) => {
        //     videoOptions.push({
        //         value: a.videoId,
        //         label: a.videoName
        //     })
        // })
        setPersonOptions(data.map((a: any) => ({
            value: a.personId,
            label: a.name,
            image: url + '/' + a.profilePictureUrl,
            jobPosition: a.jobPosition
        })))
        // console.log(videoOptions);
        // for (let i = 0; i < data.length; i++) {
        //     videoOptions.push({
        //         value: data[i].videoId,
        //         label: data[i].videoName
        //     })
        //     console.log(data[i].videoId);
        // }
    })
    .catch((error) => {
        console.log(error);
    })
}, [])

    // const addCamera = () => {
    //     navigate("/addCamera")
    // }

  const showAddPersonModal = () => {
        setPersonModal(true);
    }

    // const checkAllVideo = videoOptions.length === videoIds.length;
    const indeterminateVideo = videoOptions ? videoIds.length > 0 && videoIds.length < videoOptions.length : false;
    const selectAllVideosCheckbox = videoOptions ? videoOptions.length == videoIds.length : false;

    const handleCheckAllVideos = (e: CheckboxChangeEvent) => {
        if (e.target.checked) {
          setVideoIds(videoOptions ? videoOptions.map((a) => a.value as string) : []);
        } else {
          setVideoIds([]);
        }
      }
    
      const onChange = (
        value: DatePickerProps['value'] | RangePickerProps['value'],
        dateString: [string, string] | string,
      ) => {
        if (Array.isArray(value)) {
            // value is an array of Dayjs objects
            if (value[0]) {
              setStartTime(value[0].toDate().getTime());
            }
            if (value[1]) {
              setEndTime(value[1].toDate().getTime());
            }
          } else if (value) {
            // value is a single Dayjs object
            setStartTime(value.toDate().getTime());
          }
      
        // console.log('From: ', value[0]?.$d, ', to: ', value[1]?.$d);
        console.log('Selected Time: ', value);
        console.log('Formatted Selected Time: ', dateString);
      }
  
  const onOk = (value: DatePickerProps['value'] | RangePickerProps['value']) => {
    console.log('onOk: ', value);
  };

  const submitAddPerson = (event: any): void => {
    event.preventDefault();
    const form = event.target;
    console.log(form)
    const data = new FormData(form);

    data.append('group', group);

    // fileList.forEach((file, index) => {
    //   data.append(`faceFiles`, file);
    // });

    // data.append('faceFiles', fileList)

    console.log(data)

    const formJson = Object.fromEntries(data.entries());
    console.log(formJson);

    fetch(url + '/api/Person/add', {
      method: 'POST',
      body: data,
    })
    .then(response => {
      if (!response.ok) {
        error("This person already exists!")
        return response.text().then(text => {
          throw new Error(text);
        });
      }
      else{
        success("Successfully added person!")
      }
      // return response.json();
    })
    .then(data => {
      console.log(data);
    })
    .catch(error => {
      console.error('There was a problem with the fetch operation:', error);
      
    });
  }

  // const disableInputs = (event: any): boolean => {
  //   if (startTime === 0 && endTime === 0 ) {
  //     return true;
  //   }
  //   else {
  //     return false;
  //   }
  // }

  const [caseType, setCaseType] = useState<string>('');

  const caseTypeOptions: SelectProps['options'] = [
    {
        value: 'CRIMINAL',
        label: 'Criminal',
    },
    {
        value: 'MISSING',
        label: 'Missing',
    },
    {
        value: 'OTHER',
        label: 'Other',
    },
  ];

  const handleCaseType = (event: any): void => {
    setCaseType(event);
  }

  const disableInputs = !(startTime !== 0 && endTime !== 0 && caseType !== '');

  // const [fileList, setFileList] = useState<UploadFile[]>([]);

  // const props: UploadProps = {
  //   multiple: true,
  //   onChange(info) {
  //     const { status } = info.file;
  //     if (status !== 'uploading') {
  //       console.log(info.file, info.fileList);
  //     }
  //     if (status === 'done') {
  //       message.success(`${info.file.name} file uploaded successfully.`);
  //     } else if (status === 'error') {
  //       message.error(`${info.file.name} file upload failed.`);
  //     }
  //   },
  //   onDrop(e) {
  //     console.log('Dropped files', e.dataTransfer.files);
  //   },
  //   onRemove: (file) => {
  //     const index = fileList.indexOf(file);
  //     const newFileList = fileList.slice();
  //     newFileList.splice(index, 1);
  //     setFileList(newFileList);
  //   },
  //   beforeUpload: (file) => {
  //     setFileList([...fileList, file]);

  //     return false;
  //   },
  //   fileList,
  // };

  // const { Dragger } = Upload;

  return (
    <>
        <Spin spinning={loading} size="large" tip="Loading...">
          {/* {caseType} */}
        <Space style={{width: '100%'}}>
            <Title level={4}>Create Mission</Title>
        </Space>
        <Space direction="vertical" style={{width: '100%', marginTop: '10px'}}>
            <form>
                <Space direction='vertical' style={{width: '100%'}}>
                    <Text>Mission Name</Text>
                    <Input placeholder="Enter mission name" onChange={handleCaseName} />
                    {/* <Text>Location</Text>
                    <Input placeholder="Enter location" onChange={handleLocation} /> */}
                    <Text>Time Range</Text>
                    <RangePicker
                    showTime={{ format: 'HH:mm:ss' }}
                    format="YYYY-MM-DD HH:mm:ss"
                    onChange={onChange}
                    onOk={onOk}
                    style={{width: '100%'}}
                    />
                    <Text>Mission Type</Text>
                    <Select placeholder="Select mission type" style={{ width: '100%' }} options={caseTypeOptions} onChange={handleCaseType} />
                    {/* <Text>Select Camera</Text>
                    <Select
                        mode="multiple"
                        allowClear
                        style={{ width: '100%' }}
                        placeholder="Please select"
                        options={cameraOptions}
                        dropdownRender={(menu) => (
                            <>
                              {menu}
                              <Divider style={{ margin: '2px 0' }} />
                              <Space style={{ padding: '0 0px 0px' }}>
                                <Button type="text" icon={<PlusOutlined />} onClick={showAddCameraModal}>
                                  Add Camera
                                </Button>
                              </Space>
                            </>
                          )}
                          onChange={handleSelectCamera}
                        /> */}
                    <Text>Select Evidences</Text>
                    <Select
                        mode="multiple"
                        allowClear
                        style={{ width: '100%' }}
                        placeholder="Please select videos"
                        options={videoOptions}
                        value={videoIds}
                        disabled={disableInputs}
                        dropdownRender={(menu) => (
                            <>
                              <Space style={{ padding: '5px 10px' }}>
                                <Checkbox onChange={handleCheckAllVideos} indeterminate={indeterminateVideo} checked={selectAllVideosCheckbox}>Include all videos</Checkbox>  
                              </Space>
                              <Divider style={{ margin: '2px 0' }} />
                              {menu}
                              <Divider style={{ margin: '2px 0' }} />
                              <Space style={{ padding: '0 0px 0px' }}>
                                <Button type="text" icon={<PlusOutlined />} onClick={addVideo}>
                                  Add Video
                                </Button>
                              </Space>
                            </>
                          )}
                          onChange={handleSelectVideo}
                        />
                    {/* <Text>Team</Text> */}
                    {/* <Input placeholder="Enter team name" /> */}
                    {/* <Select
                        placeholder="Select team"
                        style={{ width: '100%' }}
                        options={[
                            { value: 'a', label: 'Team A' },
                            { value: 'b', label: 'Team B' },
                            { value: 'c', label: 'Team C' },
                        ]}
                        onChange={handleTeamChange}
                    /> */}
                    {/* <Text>Case Description</Text>
                    <TextArea placeholder="Enter case description" autoSize onChange={handleCaseDescription} /> */}
                    {/* <Text>Upload Video</Text>
                    <Input type="file"/>
                    <Text>Upload Target Photo</Text>
                    <Input type="file" /> */}
                    <Text>Search People</Text>
                    <Select
                        mode="multiple"
                        allowClear
                        style={{ width: '100%' }}
                        placeholder="Please select people"
                        options={personOptions}
                        disabled={disableInputs}
                        dropdownRender={(menu) => (
                            <>
                              {menu}
                              <Divider style={{ margin: '2px 0' }} />
                              <Space style={{ padding: '0 0px 0px' }}>
                                <Button type="text" icon={<PlusOutlined />} onClick={showAddPersonModal}>
                                  Add Person
                                </Button>
                              </Space>
                            </>
                          )}
                          onChange={handleSelectPeople}
                          optionRender={(option) => (
                            <Space>
                              {/* <span role="img" aria-label={option.data.label}>
                                {option.data.emoji}
                              </span>
                              {option.data.desc} */}
                                <Avatar src={option.data.image} style={{width: '50px', height: '50px', borderRadius: '50%'}} />
                                <Space.Compact direction="vertical">
                                    <Text>{option.data.label}</Text>
                                    <Text style={{color: 'grey'}}>{option.data.jobPosition}</Text>
                                </Space.Compact>
                            </Space>
                          )}
                        />
                    </Space>
                    <div style={{textAlign: 'right', marginTop: 20}}>
                    {/* <div style={{position: 'absolute', right: '40px', bottom: '50px'}}> */}
                    <Button size="large" type="primary" onClick={handleNextClick}>Create</Button>
                    {/* <Modal centered maskClosable={false} okText={"Next"} okButtonProps={{disabled: progressPercentage < 100}} title="Load Video" open={isModalOpen} onOk={handleNextClick} onCancel={handleCancel} closeIcon={false}>
                        <Progress percent={progressPercentage} />
                    </Modal> */}    
                </div>
            </form>
        </Space>
        <Modal width={1000} centered title="Add Person" footer={null} open={personModal} onOk={addPerson} onCancel={() => setPersonModal(false)}>
          <form onSubmit={submitAddPerson}>
            <Row gutter={20}>
              <Col span={12}>
                <Space direction="vertical" style={{width: '100%', padding: '20px 0'}}>
                  <Input name="createdUserId" value={createdUserId} style={{display: 'none'}} />
                  <Text>Name</Text>
                  <Input placeholder="Enter name" name="name" />
                  <Text>Email</Text>
                  <Input placeholder="Enter email" name="email" />
                  <Text>Group</Text>
                  <Select placeholder="Select group" style={{ width: '100%' }} options={groupOptions} onChange={handleGroup} />
                  <Text>Company</Text>
                  <Input placeholder="Enter company" name="company" />
                  <Text>Role</Text>
                  <Input placeholder="Enter role" name="role" />
                  <Text>Notes</Text>
                  <TextArea placeholder="Enter notes" name="notes" />
                </Space>
              </Col>
              <Col span={12}>
                <Space direction="vertical" style={{width: '100%', padding: '20px 0'}}>
                  <Text>Profile Picture</Text>
                  <Input type="file" name="profilePictureFile" />
                  <Text>Face</Text>
                  {/* <Dragger {...props}>
                    <Button icon={<UploadOutlined />}>Select File</Button>
                  </Dragger> */}
                  <Input type="file" multiple name="faceFiles" onChange={handleFace} />
                  <Space direction="vertical">
                    {faceFiles.map((a) => (
                        <Text>
                            - {a.name}
                        </Text>
                    ))}
                  </Space>
                  {/* <Button htmlType="submit">Add</Button> */}
                </Space>
              </Col>
            </Row>
            <Row justify="end" gutter={10}>
              <Col>
                <Button onClick={handleCancel}>Cancel</Button>
              </Col>
              <Col>
                <Button htmlType="submit" type="primary">Add</Button>
              </Col>
            </Row>
          </form>
        </Modal>
        <Modal centered title="Add Person" onOk={addPerson} onCancel={() => setPersonModal(false)}>
            <Space direction="vertical" style={{width: '100%', padding: '10px 0'}}>
                <Row gutter={10}>
                    <Col span={12}>
                        <Space direction="vertical" style={{width: '100%'}}>
                            <Text>First Name</Text>
                            <Input placeholder="Enter first name" onChange={handleFirstName} />
                        </Space>
                    </Col>
                    <Col span={12}>
                        <Space direction="vertical" style={{width: '100%'}}>
                            <Text>Last Name</Text>
                            <Input placeholder="Enter last name" onChange={handleLastName} />
                        </Space>
                    </Col>
                </Row>
                <Text>Person ID</Text>
                <Input placeholder="Enter person ID" onChange={handlePersonID} />
                <Text>Job Position</Text>
                <Input placeholder="Enter job position" onChange={handleJobPosition} />
                <Text>Upload Image</Text>
                <Input type="file" multiple onChange={handleImage} />
                <Text></Text>
                <Space>
                    {images.map((a) => (
                        <Tag>
                            {a}
                        </Tag>
                    ))}
                </Space>
                {/* {images} */}
            </Space>
        </Modal>
        <Modal open={addCameraModal} centered okText={"Add"} title="Add Camera" onOk={handleAddCamera} onCancel={handleCancel}>
          <form onSubmit={submitAddCamera}>
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
        <div style={{display: 'none'}}>
            <form>
                <Space direction='vertical' style={{width: '100%'}}>
                    <Text>Case Name</Text>
                    <Input placeholder="Enter case name" />
                    {/* <Text>Location</Text>
                    <Input placeholder="Enter location" /> */}
                    <Text>Team</Text>
                    {/* <Input placeholder="Enter team name" /> */}
                    <Select
                        placeholder="Select team"
                        style={{ width: '100%' }}
                        options={[
                            { value: 'a', label: 'Team A' },
                            { value: 'b', label: 'Team B' },
                            { value: 'c', label: 'Team C' },
                        ]}
                    />
                    <Text>Case Description</Text>
                    <TextArea placeholder="Enter case description" autoSize />
                    {/* <Text>Upload Video</Text>
                    <Input type="file"/>
                    <Text>Upload Target Photo</Text>
                    <Input type="file" /> */}
                    
                </Space>
                <div style={{textAlign: 'right', marginTop: 20}}>
                    {/* <div style={{position: 'absolute', right: '40px', bottom: '50px'}}> */}
                    <Button size="large" type="primary" onClick={handleNextClick}>Create</Button>
                    {/* <Modal centered maskClosable={false} okText={"Next"} okButtonProps={{disabled: progressPercentage < 100}} title="Load Video" open={isModalOpen} onOk={handleNextClick} onCancel={handleCancel} closeIcon={false}>
                        <Progress percent={progressPercentage} />
                    </Modal> */}
                </div>
            </form>
        </div>
        </Spin>
    </>
  );
}

export default CreateCase;