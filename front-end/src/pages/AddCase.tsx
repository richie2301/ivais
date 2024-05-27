import React, { useEffect, useState } from 'react';
import { Typography, Space, Input, Button, Layout, Row, Col, Select } from 'antd';
import type { SelectProps } from 'antd'; 
import { useNavigate } from 'react-router-dom';

import useCaseCreationStore from '../store/caseCreationStore';
import { caseCreationStoreType } from '../type/storeTypes'; 
import useUserStore from '../store/userStore';
import { UserStoreState } from '../type/storeTypes';

// type RangePickerProps = GetProps<typeof DatePicker.RangePicker>;

const { Title, Text } = Typography;
const { Footer } = Layout;

const filterOption = (input: string, option?: any) =>
  (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

// const collaboratorOptions : SelectProps['options'] = [
//   {
//     value: 'jack',
//     label: 'Jack',
//     image: 'https://img.freepik.com/free-photo/painting-mountain-lake-with-mountain-background_188544-9126.jpg'
//   },
//   {
//     value: 'lucy',
//     label: 'Lucy',
//     image: 'https://img.freepik.com/free-photo/painting-mountain-lake-with-mountain-background_188544-9126.jpg'
//   },
//   {
//     value: 'tom',
//     label: 'Tom',
//     image: 'https://img.freepik.com/free-photo/painting-mountain-lake-with-mountain-background_188544-9126.jpg'
//   },
// ]

// const userList : SelectProps['options'] = []



const url = import.meta.env.VITE_API_URL
const userId = (useUserStore.getState() as UserStoreState).userID;

type AddCase = {
  success: (message: string) => void;
  errorMessage: (message: string) => void;
}

const AddCase : React.FC<AddCase> = ({success, errorMessage}) => {
    const navigate = useNavigate()

    // const [userList, setUserList] = useState<SelectProps['options']>()
    const [collaboratorList, setCollaboratorList] = useState<SelectProps['options']>()

    // useEffect(() => {
    //   fetch (url + '/api/User/GetUserList', {
    //     method: 'GET',
    //   }).then(response => {
    //     if (!response.ok) {
    //       throw new Error(`HTTP error! status: ${response.status}`);
    //     }
    //     return response.json();
    //   })
    //   .then((data) => {
    //     console.log(data);
    //     setUserList(data.map((a: any) => ({
    //       value: a.userId,
    //       label: a.name
    //     })))
    //   })
    //   .catch((error) => {
    //     console.error('There was a problem with the fetch operation:', error);
    //   });
    // }, []) 

    useEffect(() => {
      fetch (url + '/api/Case/collaborator/list?userId=' + userId, {
        method: 'GET',
      }).then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        setCollaboratorList(data.map((a: any) => ({
          value: a.userId,
          label: a.name
        })))
      })
      .catch((error) => {
        console.error('There was a problem with the fetch operation:', error);
      });
    }, []) 

    const [caseName, setCaseName] = useState<string>((useCaseCreationStore.getState() as caseCreationStoreType).caseName ? (useCaseCreationStore.getState() as caseCreationStoreType).caseName : "")
    const [caseDescription, setCaseDescription] = useState<string>((useCaseCreationStore.getState() as caseCreationStoreType).description)
    const [collaboratorUserId, setCollaboratorUserId] = useState<string[]>((useCaseCreationStore.getState() as caseCreationStoreType).collaboratorUserId)

    const handleCaseName = (e: React.ChangeEvent<HTMLInputElement>) => {
      setCaseName(e.target.value)
      useCaseCreationStore.setState({caseName : e.target.value})
      if(e.target.value.length == 0) {
        setCaseNameStatus("error")
      }
      else {
        setCaseNameStatus("")
      }
    }

    const handleCaseDescription = (e: React.ChangeEvent<HTMLInputElement>) => {
      setCaseDescription(e.target.value)
      useCaseCreationStore.setState({description: e.target.value})
    }

    const handleSelectCollaborator = (e : any) => {
      setCollaboratorUserId(e)
      useCaseCreationStore.setState({collaboratorUserId: e})
    }

    const [tags, setTags] = useState<any[]>((useCaseCreationStore.getState() as caseCreationStoreType).tags)

    const [startTime, setStartTime] = useState<number>((useCaseCreationStore.getState() as caseCreationStoreType).startTime)
    const [endTime, setEndTime] = useState<number>((useCaseCreationStore.getState() as caseCreationStoreType).endTime)

  const [generalAttribute, setGeneralAttribute] = useState<any>([])
  const [colorAttribute, setColorAttribute] = useState<any>([])

  const [caseNameStatus, setCaseNameStatus] = useState<string>("")

  const caseId = (useCaseCreationStore.getState() as caseCreationStoreType).caseId
  const [caseData, setCaseData] = useState()

  const [selectPerson, setSelectPerson] = useState([])

  // const [form] = Form.useForm();

  useEffect(() => {
    if (caseId !== '' || caseId !== null) {
      fetch(url + '/api/Case/draft?caseId=' + caseId, {
        method: 'GET',
      }).then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data: any) => {
        // useCaseCreationStore.setState({caseName : data.title})
        setCaseName(data.title)
        setCaseDescription(data.objective)
        // form.setFieldsValue({ username: data.title });
        setCollaboratorUserId(data.collaboratorUserId)
        setStartTime(data.startTime)
        setEndTime(data.endTime)
        setGeneralAttribute(data.generalAttribute)
        setColorAttribute(data.colorAttribute)
        setTags(data.tagId)
        setCaseData(data)
        setSelectPerson(data.personNumber)
      })
      .catch((error) => {
        console.error('There was a problem with the fetch operation:', error);
      })
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.log(error);
      })
    }
  }, []) 

  useEffect(() => {
    console.log(caseData)
    console.log(caseName)
  }, [caseData])

  const saveDraft = () => {
    // const submitCaseId = () => {
    //   if (caseId == '') {
    //     return null
    //   } 
    //   else {
    //     return caseId
    //   }
    // }

    // const submitCaseId = (caseId == '') ? null : caseId
    // console.log(submitCaseId)
    // console.log('apa' + startTime)
    fetch (url + '/api/Case/CreateCaseDraft', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          caseId: caseId,
          creatorUserId: (useUserStore.getState() as UserStoreState).userID,
          title: caseName,
          objective: caseDescription,
          collaboratorUserId: collaboratorUserId,
          startTime: startTime ? startTime : null,
          endTime: endTime ? endTime : null,
          generalAttribute: generalAttribute,
          colorAttribute: colorAttribute,
          tagId: tags,
          personNumber: selectPerson
        })
    }).then((response) => {
      if (response.ok) {
        // success("Case has been saved as draft")    
        navigate('/selectFilterCase')
        return response.json();
      }
      else {
          throw new Error("Something went wrong");
      }
    }).then((data) => {
        console.log(data);
        // const responseData = JSON.parse(data)
        // console.log(data['caseId']);
        useCaseCreationStore.setState({caseId: data.caseId})
        success(data.message)
        // navigate('/addCase')
      })
      .catch((error) => {
        console.error('There was a problem with the fetch operation:', error);
      });
  }

  // const onFinish: FormProps['onFinish'] = (values) => {
  //   console.log('Success:', values);
  //   setCaseNameStatus("error")
  //   console.log(caseName)
  //   if (caseName == '') {
  //     // saveDraft()
  //   }
  //   else {
  //     setCaseNameStatus("error")
  //   }
  // };
  
  // const onFinishFailed: FormProps['onFinishFailed'] = (errorInfo) => {
  //   console.log('Failed:', errorInfo);
  // };

  const handleNext = () => {
    console.log(startTime)
    if (caseName !== '') {
      saveDraft()
    }
    else {
      setCaseNameStatus("error")
      errorMessage("Please input Case Title")
    }
  }
    
    return (
        <>
        {/* <Form layout="vertical" onFinish={onFinish} onFinishFailed={onFinishFailed} style={{height: '100%', margin: 0, padding: 0}}> */}
          <Layout style={{height: '100%', background: 'none'}}>
            <Title level={4}>Add Case</Title>
            <Layout style={{background: 'none', paddingTop: '20px'}}>
              <Space direction="vertical" style={{width: '100%'}}>
                  {/* <Form.Item
                    label="Case Title"
                    name="username"
                    rules={[{ required: true, message: 'Please input case title!' }]}
                    style={{margin: 0}}
                  >
                  
                  <Input placeholder="Enter case Name" onChange={handleCaseName} value={caseName} />
                  </Form.Item> */}
                  <Text>Case Title</Text>
                  <Input placeholder="Enter case Name" onChange={handleCaseName} value={caseName} status={caseNameStatus == "error" ? "error" : ""} />
                  <Text>Case Objective</Text>
                  <Input placeholder="Enter case description" onChange={handleCaseDescription} value={caseDescription} />
                  {/* <Text>Coordinator</Text>
                  <Select
                    style={{width: '100%'}}
                    showSearch
                    placeholder="Select a person"
                    optionFilterProp="children"
                    value={selectedCoordinator}
                    onChange={setSelectedCoordinator}
                    filterOption={filterOption}
                    options={userList}
                    // optionRender={(option) => (
                    //   <Space>
                    //     <Avatar src={option.data.image} />
                    //     <Text>{option.label}</Text>
                    //   </Space>
                    // )}
                  /> */}
                  {/* <Text>Time Range</Text>
                  <RangePicker
                      showTime={{ format: 'HH:mm' }}
                      format="YYYY-MM-DD HH:mm"
                      onChange={onChange}
                      onOk={onOk}
                      style={{width: '100%'}}
                    value={[(startTime !== 0) ? dayjs.unix(startTime / 1000) : null, (endTime !== 0) ? dayjs.unix(endTime / 1000) : null]}
                  />
                  <Text>Tag</Text>
                  <Select
                    style={{width: '100%'}}
                    showSearch
                    mode="multiple"
                    placeholder="Select a person"
                    optionFilterProp="children"
                    // value={selectedCollaborator}
                    value={collaboratorUserId}
                    onChange={handleSelectCollaborator}
                    filterOption={filterOption}
                    options={tagList}
                  /> */}
                  <Text>Collaborators</Text>
                  <Select
                    style={{width: '100%'}}
                    showSearch
                    mode="multiple"
                    placeholder="Select colllaborators"
                    optionFilterProp="children"
                    // value={selectedCollaborator}
                    value={collaboratorUserId}
                    onChange={handleSelectCollaborator}
                    filterOption={filterOption}
                    options={collaboratorList}
                    // optionRender={(option) => (
                    //   <Space>
                    //     <Avatar src={option.data.image} />
                    //     <Text>{option.label}</Text>
                    //   </Space>
                    // )}
                  />
              </Space>
            </Layout>
            <Footer style={{padding: '0', background: 'none'}}>
              <Row justify="space-between">
                <Col>
                  <Button onClick={() => navigate('/case')}>Back</Button>
                </Col>
                <Col>
                {/* <Form.Item style={{margin: 0}}>               */}
                  <Button type="primary" htmlType="submit" onClick={handleNext}>Next</Button>
                {/* </Form.Item>   */}
                </Col>
              </Row>
            </Footer>
          </Layout>
          {/* </Form> */}
        </>
    );
    }

export default AddCase;