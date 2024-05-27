import React, { useEffect, useState } from "react";
import {
  // Layout,
  Space,
  Typography,
  Select,
  Row,
  Col,
  // Button,
  Checkbox,
  Avatar,
} from "antd";
import type { SelectProps } from "antd";
// import { useNavigate } from "react-router-dom";
import Icon from "@ant-design/icons";
// import { CheckboxValueType } from "antd/es/checkbox/Group";

import useCaseCreationStore from "../store/caseCreationStore";
import useAnalyzeFilterStore from '../store/analyzeFilterStore'
// import useUserStore from "../store/userStore";
import { caseCreationStoreType } from "../type/storeTypes";
import type { GetProp } from "antd";

const { Text } = Typography;
// const { Footer } = Layout;

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
    <Col span={6}>
      <Checkbox value={"upperColor" + color}>{sampleColor(color)}</Checkbox>
      </Col>
    </>
  );
};

const lowerClothesColor = (color: string) => {
  return (
    <>
    <Col span={6}>
      <Checkbox value={"lowerColor" + color}>{sampleColor(color)}</Checkbox>
    </Col>
    </>
  );
};

const url = import.meta.env.VITE_API_URL;

type SelectFilterCaseProps = {
  // success: (message: string) => void;
  // errorMessage: (message: string) => void;
};

const SelectFilterCase: React.FC<SelectFilterCaseProps> = () => {
  // const navigate = useNavigate();

  const [personList, setPersonList] = useState<SelectProps["options"]>([]);

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
    // (useAnalyzeFilterStore.getState() as analyzeFilterType).personNumber
  );
  const [generalAtt, setGeneralAtt] = useState(
    (useCaseCreationStore.getState() as caseCreationStoreType).generalAtt
    // (useAnalyzeFilterStore.getState() as analyzeFilterType).generalAtt
  );
  const [colorAtt, setColorAtt] = useState(
    (useCaseCreationStore.getState() as caseCreationStoreType).colorAtt
    // (useAnalyzeFilterStore.getState() as analyzeFilterType).colorAtt
  );

  // const [disabledSelectPerson, setDisabledSelectPerson] = useState<string[]>(
  //   (useCaseCreationStore.getState() as caseCreationStoreType).personNumber
  //   // (useAnalyzeFilterStore.getState() as analyzeFilterType).personNumber
  // );
  // const [disabledGeneralAtt, setDisabledGeneralAtt] = useState(
  //   (useCaseCreationStore.getState() as caseCreationStoreType).generalAtt
  //   // (useAnalyzeFilterStore.getState() as analyzeFilterType).generalAtt
  // );
  // const [disabledColorAtt, setDisabledColorAtt] = useState(
  //   (useCaseCreationStore.getState() as caseCreationStoreType).colorAtt
  //   // (useAnalyzeFilterStore.getState() as analyzeFilterType).colorAtt
  // );

  const disabledGeneralAtt = (useCaseCreationStore.getState() as caseCreationStoreType).generalAtt

  const handleSelectPerson = (e: any) => {
    setSelectPerson(e);
    useAnalyzeFilterStore.setState({ personNumber: e });
  };

  const handleGeneralAttChange: GetProp<typeof Checkbox.Group, "onChange"> = (
    checkedValues
  ) => {
    console.log("checked = ", checkedValues);
    setGeneralAtt(checkedValues);
    useAnalyzeFilterStore.setState({ generalAtt: checkedValues });
  };

  const handleColorAttChange: GetProp<typeof Checkbox.Group, "onChange"> = (
    checkedValues
  ) => {
    console.log("checked = ", checkedValues);
    setColorAtt(checkedValues);
    useAnalyzeFilterStore.setState({ colorAtt: checkedValues });
  };

  // const handleNext = () => {
  //   fetch(url + "/api/Case/CreateOngoingCase", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({
  //       caseId: (useCaseCreationStore.getState() as caseCreationStoreType)
  //         .caseId,
  //       caseName: (useCaseCreationStore.getState() as caseCreationStoreType)
  //         .caseName,
  //       description: (useCaseCreationStore.getState() as caseCreationStoreType)
  //         .description,
  //       creatorUserId: (useUserStore.getState() as UserStoreState).userID,
  //       collaboratorUserId: (
  //         useCaseCreationStore.getState() as caseCreationStoreType
  //       ).collaboratorUserId,
  //       personNumber: (useCaseCreationStore.getState() as caseCreationStoreType)
  //         .personNumber,
  //       generalAtt: (useCaseCreationStore.getState() as caseCreationStoreType)
  //         .generalAtt,
  //       colorAtt: (useCaseCreationStore.getState() as caseCreationStoreType)
  //         .colorAtt,
  //     }),
  //   })
  //     .then((response) => {
  //       if (!response.ok) {
  //         return response.text().then((text) => {
  //           throw new Error(text);
  //         });
  //       } else {
  //         navigate("/analyzeCase");
  //       }
  //       return response.json();
  //     })
  //     .then((data) => {
  //       console.log(data);
  //       success(data.message);
  //     })
  //     .catch((error) => {
  //       console.error("There was a problem with the fetch operation:", error);
  //       errorMessage(error.message);
  //     });
  // };

  const checkGeneralDisabled = (value: string) => {
    if (disabledGeneralAtt.includes(value)) {
      return true
    }
    else {
      return false
    }
  }

  return (
    <>
      {/* <Layout style={{ height: "100%", background: "none", width: '100%', overflow: 'hidden'  }}> */}
        {/* <Title level={4}>Select Filter</Title> */}
        {/* <Layout
          style={{ background: "none", padding: "20px 0", overflowY: "auto" }}
        > */}
          <Space direction="vertical" size="middle" style={{ width: "100%", height: '500px', overflowY: 'auto', overflowX: 'hidden' }}>
            <Row>
              <Col flex="none" style={{ width: "150px" }}>
                <Text>Person</Text>
              </Col>
              <Col flex="auto">
                <Select
                  mode="multiple"
                  allowClear
                  style={{ width: "100%" }}
                  placeholder="Please select"
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
                    <Text>Age</Text>
                  </Col>
                  <Col flex="auto">
                    <Space>
                      <Checkbox value="young" disabled={checkGeneralDisabled('young')}>Young</Checkbox>
                      <Checkbox value="adult" disabled={checkGeneralDisabled('adult')}>Adult</Checkbox>
                    </Space>
                  </Col>
                </Row>
                <Row>
                  <Col flex="none" style={{ width: "150px" }}>
                    <Text>Gender</Text>
                  </Col>
                  <Col flex="auto">
                    <Space>
                      <Checkbox value="male" disabled={checkGeneralDisabled('male')}>
                        <MaleIcon />
                        Male
                      </Checkbox>
                      <Checkbox value="female" disabled={checkGeneralDisabled('female')}>
                        <FemaleIcon />
                        Female
                      </Checkbox>
                    </Space>
                  </Col>
                </Row>
                <Row>
                  <Col flex="none" style={{ width: "150px" }}>
                    <Text>Hair Length</Text>
                  </Col>
                  <Col flex="auto">
                    <Space>
                      <Checkbox value="hairLong" disabled={checkGeneralDisabled('hairLong')}>Long</Checkbox>
                      <Checkbox value="hairShort" disabled={checkGeneralDisabled('hairShort')}>Short</Checkbox>
                    </Space>
                  </Col>
                </Row>
                <Row>
                  <Col flex="none" style={{ width: "150px" }}>
                    <Text>Upper Clothes Length</Text>
                  </Col>
                  <Col flex="auto">
                    <Space>
                      <Checkbox value="upperLong" disabled={checkGeneralDisabled('upperLong')}>Long</Checkbox>
                      <Checkbox value="upperShort" disabled={checkGeneralDisabled('upperShort')}>Short</Checkbox>
                    </Space>
                  </Col>
                </Row>
                <Row>
                  <Col flex="none" style={{ width: "150px" }}>
                    <Text>Lower Clothes Length</Text>
                  </Col>
                  <Col flex="auto">
                    <Space>
                      <Checkbox value="lowerLong" disabled={checkGeneralDisabled('lowerLong')}>Long</Checkbox>
                      <Checkbox value="lowerShort" disabled={checkGeneralDisabled('lowerShort')}>Short</Checkbox>
                    </Space>
                  </Col>
                </Row>
                <Row>
                  <Col flex="none" style={{ width: "150px" }}>
                    <Text>Clothes Type</Text>
                  </Col>
                  <Col flex="auto">
                    <Space>
                      <Checkbox value="pants" disabled={checkGeneralDisabled('pants')}>Pants</Checkbox>
                      <Checkbox value="skirt" disabled={checkGeneralDisabled('skirt')}>Skirt</Checkbox>
                    </Space>
                  </Col>
                </Row>
                <Row>
                  <Col flex="none" style={{ width: "150px" }}>
                    <Text>Accessories</Text>
                  </Col>
                  <Col flex="auto">
                    <Space>
                      <Checkbox value="bag" disabled={checkGeneralDisabled('bag')}>Bag</Checkbox>
                      <Checkbox value="hat" disabled={checkGeneralDisabled('hat')}>Hat</Checkbox>
                      <Checkbox value="helmet" disabled={checkGeneralDisabled('helmet')}>Helmet</Checkbox>
                      <Checkbox value="backBag" disabled={checkGeneralDisabled('backBag')}>Back bag</Checkbox>
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
                    <Row gutter={[10, 10]} style={{padding: '10px 0'}}>
                      {/* {colorList.map((color) => sampleColor(color))} */}
                      {colorList.map((color) => upperClothesColor(color))}
                      {/* <Checkbox value="upperColorBlack">{sampleColor('black')}</Checkbox> */}
                    </Row>
                  </Col>
                </Row>
                <Row>
                  <Col flex="none" style={{ width: "150px" }}>
                    <Text>Lower Clothes Color</Text>
                  </Col>
                  <Col flex="auto">
                    <Row gutter={[10, 10]} style={{padding: '10px 0'}}>
                      {colorList.map((color) => lowerClothesColor(color))}
                    </Row>
                  </Col>
                </Row>
              </Space>
            </Checkbox.Group>
          </Space>
        {/* </Layout> */}
        {/* <Footer style={{ padding: "0", background: "none" }}>
          <Footer style={{ padding: "0", background: "none" }}>
            <Row justify="space-between">
              <Col>
                <Button onClick={() => navigate("/addCase")}>Back</Button>
              </Col>
              <Col>
                <Button type="primary" onClick={handleNext}>
                  Next
                </Button>
              </Col>
            </Row>
          </Footer>
        </Footer> */}
      {/* </Layout> */}
    </>
  );
};

export default SelectFilterCase;
