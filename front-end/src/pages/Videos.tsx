import React, { useEffect } from "react";
import { Button, Typography, Row, Col, Space, Table, Input } from "antd";
import type { ColumnsType } from 'antd/es/table';
import { useNavigate } from "react-router-dom";
// import { withSuccess } from "antd/es/modal/confirm";

const { Title } = Typography

interface DataType {
    key: string;
    timestamp: string; // Add this line
    videoName: string;
    address: string;
    uploader: string;
    status: string;
  }

const Videos: React.FC = () => {
    const navigate = useNavigate();

    const columns: ColumnsType<DataType> = [
        {
            title: 'Timestamp',
            dataIndex: 'timestamp',
            key: 'timestamp',
            sorter: (a: any, b: any) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        },
        {
            title: 'Evidence Name',
            dataIndex: 'videoName',
            key: 'videoName',
            sorter: (a: any, b: any) => a.videoName.localeCompare(b.videoName),
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
            sorter: (a: any, b: any) => a.address.localeCompare(b.address),
        },
        {
            title: 'Uploader',
            dataIndex: 'uploader',
            key: 'uploader',
            sorter: (a: any, b: any) => a.uploader.localeCompare(b.uploader),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            filters: [
                {
                  text: 'Completed',
                  value: 'COMPLETED',
                },
                {
                  text: 'Analyzing',
                  value: 'ANALYZING',
                },
                {
                    text: 'Waiting',
                    value: 'WAITING',
                },
              ],
              // onFilter: (value: string, record) => record.status.indexOf(value) === 0,
        }
      ];
      
    //   const data: DataType[] = [
    //     {
    //         key: '1',
    //         timestamp: '2021-09-01 12:00:00',
    //         videoName: 'Video 1',
    //         address: 'Address 1',
    //         uploader: 'John Doe',
    //         status: 'Completed'
    //     },
    //     {
    //         key: '2',
    //         timestamp: '2021-09-02 12:00:00',
    //         videoName: 'Video 2',
    //         address: 'Address 2',
    //         uploader: 'John Doe',
    //         status: 'Completed'
    //     },
    //     {
    //         key: '3',
    //         timestamp: '2021-09-03 12:00:00',
    //         videoName: 'Video 3',
    //         address: 'Address 3',
    //         uploader: 'John Doe',
    //         status: 'Analyzing'
    //     },
    //     {
    //         key: '4',
    //         timestamp: '2021-09-04 12:00:00',
    //         videoName: 'Video 4',
    //         address: 'Address 4',
    //         uploader: 'John Doe',
    //         status: 'Waiting'
    //     },
    //     {
    //         key: '5',
    //         timestamp: '2021-09-05 12:00:00',
    //         videoName: 'Video 5',
    //         address: 'Address 5',
    //         uploader: 'John Doe',
    //         status: 'Failed'
    //     }
    //   ];
    const url = import.meta.env.VITE_API_URL
    // const videoList: DataType[] = []
    const [videoList, setVideoList] = React.useState<DataType[]>([])
    // React.useEffect(() => {
    //     const fetchData = async () => {
    //         const response = await fetch(url + '/api/Video/list')
    //         const data = await response.json()
    //         setData(data)
    //     }
    //     fetchData()
    // }, [])

    useEffect(() => {
        fetch(url + '/api/Evidence/videofootage/list', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then(response => {
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            else {
              console.log('success')
            }
            return response.json();
          })
          .then(data => {
            const transformedData = data.map((entry: any) => ({
              key: entry.videoId,
              timestamp: entry.createdAt,
              videoName: entry.videoName,
              address: entry.location,
              uploader: entry.createdUserName,
              status: entry.status
            }));
      
            setVideoList(transformedData);
            setFilteredData(transformedData);
            console.log(transformedData);
          })
          .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
          });
      }, []); // Empty dependency array ensures this runs once on mount

    const handleAddVideo = () => {
        navigate("/addVideo")
    } 

    const [filteredData, setFilteredData] = React.useState(videoList)

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const searchQuery = e.target.value
        const filteredData = videoList.filter((entry) => {
            return entry.videoName.toLowerCase().includes(searchQuery.toLowerCase()) || entry.address.toLowerCase().includes(searchQuery.toLowerCase()) || entry.uploader.toLowerCase().includes(searchQuery.toLowerCase())
        })
        setFilteredData(filteredData)
        console.log(filteredData)
    }
    
    return (
      <div>
        <Row justify="space-between">
            <Col>
                <Title level={4}>Evidence</Title>
            </Col>
            {/* <Col>
                <Space align="center" style={{height: '100%'}}>
                    <Button onClick={handleAddVideo}>Add Video</Button>
                </Space>
            </Col> */}

        </Row>
        <Row gutter={10} style={{padding: '10px 0'}}>
            <Col flex="auto">
                <Input placeholder="Search" style={{width: '100%'}} onChange={handleSearch} />
            </Col>
            <Col flex="none">
                <Space align="center" style={{height: '100%'}}>
                    <Button type="primary" onClick={handleAddVideo}>Add Evidence</Button>
                </Space>
            </Col>
        </Row>
        <Table columns={columns} dataSource={filteredData} />
      </div>
    );
  }
  
  export default Videos;