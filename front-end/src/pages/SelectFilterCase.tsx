import React, { useEffect, useState } from "react";
import {
  Layout,
  Space,
  Typography,
  Select,
  Row,
  Col,
  Button,
  Checkbox,
  Avatar,
  DatePicker,
  Divider,
  Modal,
  Input
} from "antd";
import type { DatePickerProps } from 'antd';
import type { RangePickerProps } from 'antd/es/date-picker';
import type { SelectProps } from "antd";
import { useNavigate } from "react-router-dom";
import Icon from "@ant-design/icons";
import { PlusOutlined } from '@ant-design/icons';

import useCaseCreationStore from "../store/caseCreationStore";
import useUserStore from "../store/userStore";
import { caseCreationStoreType, UserStoreState } from "../type/storeTypes";
import type { GetProp } from "antd";

import dayjs from 'dayjs'

const { Title, Text } = Typography;
const { Footer } = Layout;
const { RangePicker } = DatePicker;
const { TextArea } = Input

const MaleIconSvg = () => (
  <svg
    width="1em"
    height="1em"
    fill="currentColor"
    viewBox="0 0 47.18 122.88"
    focusable="false"
  >
    <path d="M23.59,0A10.34,10.34,0,1,1,13.25,10.34,10.34,10.34,0,0,1,23.59,0ZM36.66,38.93v78.23a5.74,5.74,0,0,1-5.72,5.72h0a5.73,5.73,0,0,1-5.72-5.72v-46H22.11v46a5.74,5.74,0,0,1-5.72,5.72h0a5.74,5.74,0,0,1-5.72-5.72V38.93h-2V67.68c0,5.73-8.67,5.73-8.67,0V36.74c0-5,1.69-8.56,4.77-10.88,5.3-4,32.33-4,37.63,0,3.08,2.32,4.79,5.85,4.78,10.88V67.68c0,5.73-8.68,5.73-8.68,0V38.93Z" />
  </svg>
);

const FemaleIconSvg = () => (
  <svg
    width="1em"
    height="1em"
    fill="currentColor"
    viewBox="0 0 64.36 122.88"
    focusable="false"
  >
    <path d="M19.71,40.39,7.24,92H19.71v25.13a5.73,5.73,0,0,0,5.72,5.72h0a5.73,5.73,0,0,0,5.71-5.72V92H33.4v25.13a5.73,5.73,0,0,0,5.71,5.72h0a5.73,5.73,0,0,0,5.72-5.72V92H56.6L44.83,41.73v-2.8h1.85l.13,0,8.82,31.38a4.45,4.45,0,0,0,8.56-2.4l-8.94-31.8a4.29,4.29,0,0,0-.19-.54c-1.13-4.72-1.64-7.54-4.49-9.68-5.3-4-30.91-4-36.2,0-3.08,2.32-4.2,5.87-5.54,10.88l.08,0L.17,67.88a4.44,4.44,0,1,0,8.55,2.4l8.83-31.39.16,0h2v1.46ZM32.2,0A10.34,10.34,0,1,1,21.86,10.34,10.34,10.34,0,0,1,32.2,0Z" />
  </svg>
);

const MaleIcon = () => <Icon component={MaleIconSvg} />;

const FemaleIcon = () => <Icon component={FemaleIconSvg} />;

// const personOptions : SelectProps['options'] = [
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

// const tagOptions : SelectProps['options'] = [
//   {
//     value: 'tag1',
//     label: 'Tag 1',
//   },
//   {
//     value: 'tag2',
//     label: 'Tag 2',
//   },
//   {
//     value: 'tag3',
//     label: 'Tag 3',
//   },
// ];

const filterOption = (input: string, option?: any) =>
  (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

const colorList = [
  "Black",
  "White",
  "Red",
  "Green",
  "Yellow",
  "Orange",
  "Purple",
  "Pink",
  "Blue",
  "Gray",
];

const sampleColor = (color: string) => {
  return (
    <>
      <Space>
        <div
          style={{
            width: "20px",
            height: "20px",
            background: color,
            border: "1px solid white",
            borderRadius: "20px",
          }}
        ></div>
        {color}
      </Space>
    </>
  );
};

const upperClothesColor = (color: string) => {
  return (
    <>
      <Checkbox value={"upperColor" + color}>{sampleColor(color)}</Checkbox>
    </>
  );
};

const lowerClothesColor = (color: string) => {
  return (
    <>
      <Checkbox value={"lowerColor" + color}>{sampleColor(color)}</Checkbox>
    </>
  );
};

const url = import.meta.env.VITE_API_URL;

type SelectFilterCaseProps = {
  success: (message: string) => void;
  errorMessage: (message: string) => void;
};

const SelectFilterCase: React.FC<SelectFilterCaseProps> = ({ success, errorMessage }) => {
  const navigate = useNavigate();
  const userId = (useUserStore.getState() as UserStoreState).userID

  const [personList, setPersonList] = useState<SelectProps["options"]>([]);

  const emptyStore = () => {
    // useCaseCreationStore.setState({
    //   caseId: "",
    //   caseName: "",
    //   description: "",
    //   collaboratorUserId: [],
    //   personNumber: [],
    //   generalAtt: [],
    //   colorAtt: [],
    // });
  }

  useEffect(() => {
    fetch(url + "/api/Person/list", {
      method: "GET",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        setPersonList(
          data.map((a: any) => ({
            value: a.personNumber,
            label: a.name,
            group: a.group,
            company: a.company,
            role: a.role,
            profilePictureUrl: url + "/" + a.profilePictureUrl,
          }))
        );
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  }, []);

  const [selectPerson, setSelectPerson] = useState<string[]>(
    (useCaseCreationStore.getState() as caseCreationStoreType).personNumber
  );
  const [generalAtt, setGeneralAtt] = useState(
    (useCaseCreationStore.getState() as caseCreationStoreType).generalAtt
  );
  const [colorAtt, setColorAtt] = useState(
    (useCaseCreationStore.getState() as caseCreationStoreType).colorAtt
  );

  const handleSelectPerson = (e: any) => {
    setSelectPerson(e);
    useCaseCreationStore.setState({ personNumber: e });
  };

  const handleGeneralAttChange: GetProp<typeof Checkbox.Group, "onChange"> = (
    checkedValues
  ) => {
    console.log("checked = ", checkedValues);
    setGeneralAtt(checkedValues);
    useCaseCreationStore.setState({ generalAtt: checkedValues });
  };

  const handleColorAttChange: GetProp<typeof Checkbox.Group, "onChange"> = (
    checkedValues
  ) => {
    console.log("checked = ", checkedValues);
    setColorAtt(checkedValues);
    useCaseCreationStore.setState({ colorAtt: checkedValues });
  };

  const handleNext = () => {
    fetch(url + "/api/Case/CreateOngoingCase", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // caseId: (useCaseCreationStore.getState() as caseCreationStoreType)
        //   .caseId,
        // title: (useCaseCreationStore.getState() as caseCreationStoreType)
        //   .caseName,
        // objective: (useCaseCreationStore.getState() as caseCreationStoreType)
        //   .description,
        // creatorUserId: (useUserStore.getState() as UserStoreState).userID,
        // collaboratorUserId: (
        //   useCaseCreationStore.getState() as caseCreationStoreType
        // ).collaboratorUserId,
        // personNumber: (useCaseCreationStore.getState() as caseCreationStoreType)
        //   .personNumber,
        // generalAtt: (useCaseCreationStore.getState() as caseCreationStoreType)
        //   .generalAtt,
        // colorAtt: (useCaseCreationStore.getState() as caseCreationStoreType)
        //   .colorAtt,
        // startTime: (useCaseCreationStore.getState() as caseCreationStoreType)
        //   .colorAtt,
        // endTime: (useCaseCreationStore.getState() as caseCreationStoreType)
        //   .colorAtt,
        // tags: (useCaseCreationStore.getState() as caseCreationStoreType)
        //   .colorAtt,
        caseId: caseId,
        creatorUserId: (useUserStore.getState() as UserStoreState).userID,
        title: caseName,
        objective: caseDescription,
        collaboratorUserId: collaboratorUserId,
        startTime: startTime ? startTime : null,
        endTime: endTime ? endTime : null,
        generalAttribute: generalAtt,
        colorAttribute: colorAtt,
        tagId: tags,
        personNumber: selectPerson
      }),
    })
      .then((response) => {
        console.log(startTime, endTime)
        if (!response.ok) {
          return response.text().then((text) => {
            throw new Error(text);
          });
        } else {
          navigate("/analyzeCase");
          emptyStore();
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        success(data.message);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
        errorMessage(error.message);
      });
  };

  const caseId = (useCaseCreationStore.getState() as caseCreationStoreType).caseId

  useEffect(() => {
    if (caseId !== '') {
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
        // setCaseName(data.title)
        // setCaseDescription(data.objective)
        // form.setFieldsValue({ username: data.title });
        // setCollaboratorUserId(data.collaboratorUserId)
        // setStartTime(data.startTime)
        // setEndTime(data.endTime)
        setGeneralAtt(data.generalAttribute)
        setColorAtt(data.colorAttribute)
        setSelectPerson(data.personNumber)
        // setTags(data.tagId)
        // setCaseData(data)
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

  const [startTime, setStartTime] = useState<number | null>(null)
    const [endTime, setEndTime] = useState<number | null>(null)

    const onChange = (
      value: DatePickerProps['value'] | RangePickerProps['value'],
      dateString: [string, string] | string,
    ) => {
      console.log('Selected Time: ', value);
      console.log('Formatted Selected Time: ', dateString);
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
    };
  
    console.log(startTime, endTime)
    
    const onOk = (value: DatePickerProps['value'] | RangePickerProps['value']) => {
      console.log('onOk: ', value);
      console.log(startTime, endTime)
    };

    const [tagList, setTagList] = useState<any[]>([])
    const [tags, setTags] = useState<any[]>((useCaseCreationStore.getState() as caseCreationStoreType).tags)
    useEffect (() => {
      fetch(url + '/api/Tag/list', {
        method: 'GET',
      }).then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        setTagList(data.map((a: any) => ({
          value: a.tagId,
          label: a.name
        })))
      })
      .catch((error) => {
        console.error('There was a problem with the fetch operation:', error);
      });
    }, []) 

    const handleTags = (e : any) => {
      setTags(e)
      // useCaseCreationStore.setState({collaboratorUserId: e})
    }

    const [caseName, setCaseName] = useState<string>((useCaseCreationStore.getState() as caseCreationStoreType).caseName)
    const [caseDescription, setCaseDescription] = useState<string>((useCaseCreationStore.getState() as caseCreationStoreType).description)
    const [collaboratorUserId, setCollaboratorUserId] = useState<string[]>((useCaseCreationStore.getState() as caseCreationStoreType).collaboratorUserId)

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
            generalAttribute: generalAtt,
            colorAttribute: colorAtt,
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

    useEffect(() => {
      if (caseId !== '') {
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
          setGeneralAtt(data.generalAttribute)
          setColorAtt(data.colorAttribute)
          setTags(data.tagId)
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

    const [personModal, setPersonModal] = useState(false);
    // const [firstName, setFirstName] = useState("");
    // const [lastName, setLastName] = useState("");
    // const [personID, setPersonID] = useState("");
    // const [jobPosition, setJobPosition] = useState("");
    // // const [image, setImage] = useState("");
    // const [images, setImages] = useState<string[]>([]);
    const [group, setGroup] = useState("");
    const [faceFiles, setFaceFiles] = useState<File[]>([]);

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
        errorMessage("This person already exists!")
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

  const showAddPersonModal = () => {
    setPersonModal(true);
  }

  const handleCancel = () => {
    setPersonModal(false);
  }

  const handleGroup = (e: any) => {
    setGroup(e);
  }

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

  return (
    <>
      <Layout style={{ height: "100%", background: "none" }}>
        <Space align="baseline">
          <Title level={4}>Select Filter</Title>
          <Text style={{color: 'grey'}}>(The filter applied to the evidence is using the OR logic. This means that results will include any evidences matching at least one of the selected criteria)</Text>
        </Space>
        <Layout
          style={{ background: "none", padding: "20px 0", overflowY: "auto" }}
        >
          <Space direction="vertical" size="middle" style={{ width: "100%" }}>
          <Row>
              <Col flex="none" style={{ width: "150px" }}>
                <Text>Time Range</Text>
              </Col>
              <Col flex="auto">
                <RangePicker
                  showTime={{ format: 'HH:mm' }}
                  format="YYYY-MM-DD HH:mm"
                  onChange={onChange}
                  onOk={onOk}
                  style={{width: '100%'}}
                  // value={[(startTime !== 0 || startTime !== null) ? dayjs.unix(startTime / 1000) : null, (endTime !== 0 || endTime !== null) ? dayjs.unix(endTime / 1000) : null]}
                  value = {[startTime == null ? null : dayjs.unix(startTime / 1000) , endTime == null ? null : dayjs.unix(endTime / 1000)]}
                />
              </Col>
            </Row>
            <Row>
              <Col flex="none" style={{ width: "150px" }}>
                <Text>Tag</Text>
              </Col>
              <Col flex="auto">
                <Select
                  style={{width: '100%'}}
                  showSearch
                  mode="multiple"
                  placeholder="Select tags"
                  optionFilterProp="children"
                  // value={selectedCollaborator}
                  value={tags}
                  onChange={handleTags}
                  filterOption={filterOption}
                  options={tagList}
                />
              </Col>
            </Row>
            <Row>
              <Col flex="none" style={{ width: "150px" }}>
                <Text>Person</Text>
              </Col>
              <Col flex="auto">
                <Select
                  mode="multiple"
                  allowClear
                  style={{ width: "100%" }}
                  placeholder="Select people"
                  filterOption={filterOption}
                  options={personList}
                  onChange={handleSelectPerson}
                  value={selectPerson}
                  optionRender={(option) => (
                    <Space>
                      <Avatar src={option.data.profilePictureUrl} />
                      <Text>
                        {option.label} - {option.data.company},{" "}
                        {option.data.role}
                      </Text>
                    </Space>
                  )}
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
                />
              </Col>
            </Row>
            <Checkbox.Group
              style={{ width: "100%" }}
              onChange={handleGeneralAttChange}
              value={generalAtt}
            >
              <Space direction="vertical" size="middle">
                <Row>
                  <Col flex="none" style={{ width: "150px" }}>
                    <Text>Gender</Text>
                  </Col>
                  <Col flex="auto">
                    <Space>
                      <Checkbox value="male">
                        <MaleIcon />
                        Male
                      </Checkbox>
                      <Checkbox value="female">
                        <FemaleIcon />
                        Female
                      </Checkbox>
                    </Space>
                  </Col>
                </Row>
                <Row>
                  <Col flex="none" style={{ width: "150px" }}>
                    <Text>Age</Text>
                  </Col>
                  <Col flex="auto">
                    <Space>
                      <Checkbox value="young">Young</Checkbox>
                      <Checkbox value="adult">Adult</Checkbox>
                    </Space>
                  </Col>
                </Row>
                <Row>
                  <Col flex="none" style={{ width: "150px" }}>
                    <Text>Hair Length</Text>
                  </Col>
                  <Col flex="auto">
                    <Space>
                      <Checkbox value="hairLong">Long</Checkbox>
                      <Checkbox value="hairShort">Short</Checkbox>
                    </Space>
                  </Col>
                </Row>
                <Row>
                  <Col flex="none" style={{ width: "150px" }}>
                    <Text>Upper Clothes Length</Text>
                  </Col>
                  <Col flex="auto">
                    <Space>
                      <Checkbox value="upperLong">Long</Checkbox>
                      <Checkbox value="upperShort">Short</Checkbox>
                    </Space>
                  </Col>
                </Row>
                <Row>
                  <Col flex="none" style={{ width: "150px" }}>
                    <Text>Lower Clothes Length</Text>
                  </Col>
                  <Col flex="auto">
                    <Space>
                      <Checkbox value="lowerLong">Long</Checkbox>
                      <Checkbox value="lowerShort">Short</Checkbox>
                    </Space>
                  </Col>
                </Row>
                <Row>
                  <Col flex="none" style={{ width: "150px" }}>
                    <Text>Clothes Type</Text>
                  </Col>
                  <Col flex="auto">
                    <Space>
                      <Checkbox value="pants">Pants</Checkbox>
                      <Checkbox value="skirt">Skirt</Checkbox>
                    </Space>
                  </Col>
                </Row>
                <Row>
                  <Col flex="none" style={{ width: "150px" }}>
                    <Text>Accessories</Text>
                  </Col>
                  <Col flex="auto">
                    <Space>
                      <Checkbox value="bag">Bag</Checkbox>
                      <Checkbox value="hat">Hat</Checkbox>
                      <Checkbox value="helmet">Helmet</Checkbox>
                      <Checkbox value="backBag">Back bag</Checkbox>
                    </Space>
                  </Col>
                </Row>
              </Space>
            </Checkbox.Group>
            <Checkbox.Group
              style={{ width: "100%" }}
              onChange={handleColorAttChange}
              value={colorAtt}
            >
              <Space direction="vertical" size="middle">
                <Row>
                  <Col flex="none" style={{ width: "150px" }}>
                    <Text>Upper Clothes Color</Text>
                  </Col>
                  <Col flex="auto">
                    <Space>
                      {/* {colorList.map((color) => sampleColor(color))} */}
                      {colorList.map((color) => upperClothesColor(color))}
                      {/* <Checkbox value="upperColorBlack">{sampleColor('black')}</Checkbox> */}
                    </Space>
                  </Col>
                </Row>
                <Row>
                  <Col flex="none" style={{ width: "150px" }}>
                    <Text>Lower Clothes Color</Text>
                  </Col>
                  <Col flex="auto">
                    <Space>
                      {colorList.map((color) => lowerClothesColor(color))}
                    </Space>
                  </Col>
                </Row>
              </Space>
            </Checkbox.Group>
          </Space>
        </Layout>
        <Modal width={1000} centered title="Add Person" footer={null} open={personModal} onCancel={() => setPersonModal(false)}>
          <form onSubmit={submitAddPerson}>
            <Row gutter={20}>
              <Col span={12}>
                <Space direction="vertical" style={{width: '100%', padding: '20px 0'}}>
                  <Input name="createdUserId" value={userId} style={{display: 'none'}} />
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
        <Footer style={{ padding: "0", background: "none" }}>
          <Footer style={{ padding: "0", background: "none" }}>
            <Row justify="space-between">
              <Col>
                <Button onClick={() => navigate("/addCase")}>Back</Button>
              </Col>
              <Col>
                <Space>
                  <Button onClick={saveDraft}>Save as Draft</Button>
                  <Button type="primary" onClick={handleNext}>
                    Done
                  </Button>
                </Space>
              </Col>
            </Row>
          </Footer>
        </Footer>
      </Layout>
    </>
  );
};

export default SelectFilterCase;
