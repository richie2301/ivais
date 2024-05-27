import React from "react";
import { Typography, Table, Row, Col, Divider, Space, Avatar } from "antd";

import useCreateCaseStore from "../store/createCaseStore";

const { Title, Text } = Typography

type AnalyzecaseProps = {
    success: (message: string) => void;
    // loadingPage: (status: boolean) => void;
    // loading: boolean;
}

type CreateCaseStoreState = {
    data: {
      data: any[];
      info: {
        creatorName: string;
        caseName: string;
        startTime: string;
        endTime: string;
        persons: any[];
      };
    }
}

interface DataTable {
  key: number;
  personName: string;
  profilePicture: string;
  data: any[]; // Replace 'any' with the actual type if known
}

const AnalyzeCase: React.FC<AnalyzecaseProps> = () => {
    const data = (useCreateCaseStore.getState() as CreateCaseStoreState).data.data;
    const info = (useCreateCaseStore.getState() as CreateCaseStoreState).data.info;
    // const creatorName = info.creatorName;
    const startTime = new Date(info.startTime).toLocaleString();
    const endTime = new Date(info.endTime).toLocaleString();
    console.log(data);
    const url = import.meta.env.VITE_API_URL;
    // const thisData = info.persons.length;
    // console.log(info)
    // console.log('thisData :' + thisData)
    const columns = [
        {
            title: 'Timestamp',
            dataIndex: 'timestamp',
            key: 'timestamp',
            sorter: (a: any, b: any) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
            render: (text: string) => <Text>{new Date(text).toLocaleString()}</Text>,
        },
        // {
        //     title: 'Source',
        //     dataIndex: 'source',
        //     key: 'source',
        //     sorter: (a: any, b: any) => a.source - b.source,
        // },
        // {
        //     title: 'Source Type',
        //     dataIndex: 'sourceType',
        //     key: 'sourceType',
        //     sorter: (a: any, b: any) => a.sourceType - b.sourceType,
        // },
        {
            title: 'Source Name',
            dataIndex: 'sourceName',
            key: 'sourceName',
            sorter: (a: any, b: any) => a.sourceName.localeCompare(b.sourceName),
        },
        {
            title: 'Source Location',
            dataIndex: 'sourceLocation',
            key: 'sourceLocation',
            sorter: (a: any, b: any) => a.sourceLocation.localeCompare(b.sourceLocation),
        },
        // {
        //     title: 'Person Name',
        //     dataIndex: 'personName',
        //     key: 'personName',
        //     sorter: (a: any, b: any) => a.personName.localeCompare(b.personName),
        // },
        {
            title: 'Video Clip URL',
            dataIndex: 'clipVideoUrl',
            key: 'clipVideoUrl',
            render: (text: string) => <iframe src={url + '/' + text} style={{width: 'auto'}} title="video" allowFullScreen></iframe>,
            // render: (text: string) => {text}
        }
    ];
    //get all person names
    const personNames = data.map((item: any) => item.personName);
    //remove duplicate names
    const uniquePersonNames = [...new Set(personNames)];
    // const [profilePictures, setProfilePictures] = React.useState([]);
    // const peopleData = info.persons;
    // function getProfilePictures(peopleData: any[], personNames: string[]): { [key: string]: string } {
    //   const profilePictures: { [key: string]: string } = {};
    
    //   for (let personName of personNames) {
    //     const person = peopleData.find((person: any) => person.name === personName);
    //     if (person) {
    //       profilePictures[personName] = person.profilePicture;
    //     }
    //   }
    
    //   return profilePictures;
    // }

    // console.log(getProfilePictures(peopleData, uniquePersonNames));

    // console.log(uniquePersonNames);
    // console.log(profilePictures)
    // console.log(peopleData)



    // const profilePictures = [
    //   'api/media/image/person%5Ccf9f58ab-8e26-4a2e-b226-bb507ed4b398%5Ccf9f58ab-8e26-4a2e-b226-bb507ed4b398.jpg',
    //   'api/media/image/person%5C216377e1-8e79-4931-93ee-89b42f472e5a%5C216377e1-8e79-4931-93ee-89b42f472e5a.jpg',
    //   'api/media/image/person%5Cf856a578-331b-4451-a979-539c33c6ef9b%5Cf856a578-331b-4451-a979-539c33c6ef9b.jpg',
    // ]
    // const [dataTables, setDataTables] = React.useState<DataTable[]>([]);

    const [dataTables, setDataTables] = React.useState<DataTable[]>([]);

    React.useEffect(() => {
      console.log(uniquePersonNames)
      const newTables = uniquePersonNames.map((personName, index) => {
        const filteredData = data.filter((item: any) => item.personName === personName);
        console.log(data)
        console.log(filteredData)
        const person = info.persons.find((person: any) => person.name === personName);
        console.log(info.persons)
        console.log(person)
        if (person) {
          return {
            key: index,
            personName: personName,
            profilePicture: url + '/' + person.profilePictureUrl,
            data: filteredData,
          };
        }
        return null;
      // }).filter(Boolean); // Remove null values})
      }).filter(item => item !== null); // Remove null values

      setDataTables(newTables as DataTable[]);
    }, []);
    
    console.log(dataTables);

    // const profilePicture = info.persons.
    // console.log(profilePicture)
    
    return (
      <>
      <div>
        <Title level={3}>Analyze Case</Title>
      </div>
      <Divider>Case Information</Divider>
        <Space direction="vertical" style={{width: '100%'}}>
          <Row>
            <Col style={{width:'120px'}}>
              <Text strong>Creator Name</Text>
            </Col>
            <Col>
              <Text>{info.creatorName}</Text>
            </Col>
          </Row>
          <Row>
            <Col style={{width:'120px'}}>
              <Text strong>Case Name</Text>
            </Col>
            <Col>
              <Text>{info.caseName}</Text>
            </Col>
          </Row>
          <Row>
            <Col style={{width:'120px'}}>
              <Text strong>Start Time</Text>
            </Col>
            <Col>
              <Text>{startTime}</Text>
            </Col>
          </Row>
          <Row>
            <Col style={{width:'120px'}}>
              <Text strong>End Time</Text>
            </Col>
            <Col>
              <Text>{endTime}</Text>
            </Col>
          </Row>
        </Space>
        <Divider>Analyze Result</Divider>
        {dataTables.map((item: any) => {
            return (
                <>
                <Space style={{width: '100%', paddingBottom: '10px'}}>
                    <Avatar size={64} src={item.profilePicture} alt={item.profilePicture} />
                    <Title level={4} style={{margin: '0 10px'}}>{item.personName}</Title>
                </Space>
                <Table columns={columns} dataSource={item.data} />
                </>
            );
        })}
      {/* <Table columns={columns} dataSource={data} />; */}
      </>
    );
  }
  
  export default AnalyzeCase;