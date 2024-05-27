import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Button, Typography, Table, Col, Input } from 'antd';
import type { TableProps } from 'antd'
// import type { CheckboxChangeEvent } from 'antd/es/checkbox';
// import type { CheckboxValueType } from 'antd/es/checkbox/Group';
import useUserStore from '../store/userStore';
import useCaseCreationStore from '../store/caseCreationStore';

// import SearchFilter from '../components/SearchFilter';

// import ReportList from '../components/ReportList';

// const CheckboxGroup = Checkbox.Group;

// const plainOptions = ['Apple', 'Pear', 'Orange'];
// const defaultCheckedList = ['Apple', 'Orange']

// import jombang from '../assets/jombang.png';
// import makassar from '../assets/makassar.png';

const { Title, Text } = Typography

// import type { DataType } from '../pages/Evidence';

export type ReportingProps = {
    success: (message: string) => void;
}

interface UserStoreState {
    userID: string;
    // define other properties here
  }

  interface DataType {
    caseId: string;
    title: string;
    objective: string;
    creatorUserName: string;
    collaboratorUserName: string[];
    status: string;
    createdAt: string;
    updatedAt: string;
  }

const Reporting: React.FC<ReportingProps> = () => {

    // const [checkedList, setCheckedList] = useState<CheckboxValueType[]>(defaultCheckedList);
    const navigate = useNavigate();
    const createdUserId = (useUserStore.getState() as UserStoreState).userID;
    const url = import.meta.env.VITE_API_URL;

    const handleView = (record: DataType) => {
        useCaseCreationStore.setState({caseId: record.caseId})
        // if ((useCaseCreationStore.getState() as caseCreationStoreType).caseId == record.caseId)
        // navigate('/analyzeCase')
        if (record.status == "DRAFT") {
          navigate('/addCase')
        }
        else {
          navigate('/analyzeCase')
        }
    }

    const handleAddCase = () => {
      useCaseCreationStore.setState({caseId: null})
      useCaseCreationStore.setState({caseName : null})
      useCaseCreationStore.setState({description: null})
      useCaseCreationStore.setState({collaboratorUserId: []})
      useCaseCreationStore.setState({personNumber: []})
      useCaseCreationStore.setState({generalAtt: []})
      useCaseCreationStore.setState({colorAtt: []})
      navigate('/addCase')
        // fetch( url + '/api/Case/CreateCaseDraft?CreatorUserId=' + createdUserId, {
        //     method: 'POST',
        // }).then((response) => {
        //         // navigate('/addCase')
        //         // console.log(response)
        //         if (!response.ok) {
        //           throw new Error(`HTTP error! status: ${response.status}`);
        //         }
        //         else {
        //         //   navigate('/addCase')
        //         // console.log(response.data)
        //         }
        //         return response.json();
        //       })
        //       .then((data) => {
        //         console.log(data);
        //         // const responseData = JSON.parse(data)
        //         // console.log(data['caseId']);
        //         useCaseCreationStore.setState({caseId: data.caseId})
        //         success(data.message)
        //         navigate('/addCase')
        //       })
        //       .catch((error) => {
        //         console.error('There was a problem with the fetch operation:', error);
        //       });
          }
          
          const columns: TableProps<DataType>['columns'] = [
            {
              title: 'Title',
              dataIndex: 'title',
              key: 'title',
            //   render: (text) => <a>{text}</a>,
            },
            {
              title: 'Created Date',
              dataIndex: 'createdAt',
              key: 'createdAt',
              render: (text) => <Text>{new Date(text).toLocaleString('en-GB', { timeZone: 'Asia/Jakarta' })}</Text>
            },
            {
              title: 'Updated Date',
              dataIndex: 'updatedAt',
              key: 'updatedAt',
              render: (text) => <Text>{new Date(text).toLocaleString('en-GB', { timeZone: 'Asia/Jakarta' })}</Text>
            },
            {
                title: 'Creator',
                dataIndex: 'creatorUserName',
                key: 'creatorUserName',
            },
            {
                title: 'Status',
                dataIndex: 'status',
                key: 'status',
            },
            {
              title: 'Action',
              key: 'action',
              render: (_, record) => (
                <Button type="primary" onClick={() => handleView(record)}>View</Button>
              ),
            },
          ];
          const [caseData, setCaseData] = useState<DataType[]>([])
          const [filteredData, setFilteredData] = useState<DataType[]>()
          useEffect(() => {
            fetch(url + '/api/Case/list?userId=' + createdUserId, {
                method: 'GET'
            }).then(response => {
                if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
                }
                else {
                // console.log('success')
                }
                return response.json();
            }).then(data => {
                console.log(data)
                setCaseData(data)
                // setFilteredData(data)
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
        }, []);

        const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
          console.log(e.target.value)
          const searchQuery = e.target.value
          const filteredData = caseData?.filter((entry) => {
              return (
                entry.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                entry.creatorUserName?.toLowerCase().includes(searchQuery.toLowerCase())
                // entry.tags?.some((tag: any) => tag.tagName.toLowerCase().includes(searchQuery.toLowerCase()))
              )
            });
          setFilteredData(filteredData)
          console.log(filteredData)
      }

      useEffect(() => {
        setFilteredData(caseData)
      }, [caseData])
      
    return (
        <>
            <Row justify="space-between">
                {/* <Space style={{paddingBottom: '20px'}}> */}
                    <Title level={4}>Case</Title>
                {/* </Space> */}
                {/* <Space>
                    <Button type="primary" onClick={handleAddCase}>Add Case</Button>
                </Space> */}
            </Row>
            <Row gutter={10} style={{paddingBottom: '10px'}}>
              <Col flex="auto">
                <Input placeholder="Search" onChange={handleSearch} />
              </Col>
              <Col flex="none">
                <Button type="primary" onClick={handleAddCase}>Add Case</Button>
              </Col>
            </Row>
            <Table columns={columns} dataSource={filteredData} />
        </>
    )
}
export default Reporting;