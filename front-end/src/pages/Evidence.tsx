import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Input, Row, Col, Button, Space, Table, Drawer, Tag } from 'antd';
import { FileOutlined } from '@ant-design/icons';
import type { TableProps } from 'antd';
import MissionDetailsDrawer from '../components/MissionDetailsDrawer';
import { HubConnection } from '@microsoft/signalr';

const { Title } = Typography

export interface DataType {
    key: string;
    name: string;
    date: string;
    location: string;
    tags: any;
    status: string;
  }

  export interface EvidenceType extends DataType {
    evidenceId: string;
    latitude: number;
    longitude: number;
    originalVideoUrl: string;
    analysisSpeedratio: number;
    channel: number;
    startedAt: Date;
    endedAt: Date;
    isCompressed: boolean;
    createdAt: Date;
    updatedAt: Date;
    creatorUserName: string;
  }

  const url = import.meta.env.VITE_API_URL
  
//   const data: DataType[] = [
//     {
//       key: '1',
//       name: 'John Brown',
//       date: '2021-09-01 12:00:00',
//       location: 'New York No. 1 Lake Park',
//       tags: ['nice', 'developer'],

//     },
//     {
//       key: '2',
//       name: 'Jim Green',
//       date: '2021-09-02 12:00:00',
//       location: 'London No. 1 Lake Park',
//       tags: ['loser'],
//     },
//     {
//       key: '3',
//       name: 'Joe Black',
//       date: '2021-09-03 12:00:00',
//       location: 'Sydney No. 1 Lake Park',
//       tags: ['cool', 'teacher'],
//     },
//   ];

type EvidenceProps = {
    success: (message: string) => void;
    connection: HubConnection | null;
}

const Evidence: React.FC<EvidenceProps> = ({success, connection}) => {

    const navigate = useNavigate()

    const [evidenceList, setEvidenceList] = React.useState<DataType[]>([])
    const [reloadEvidence, setReloadEvidence] = useState(false)

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
            key: entry.videoFootageId,
            date: new Date(entry.createdAt).toLocaleDateString(),
            name: entry.name,
            location: entry.location,
            uploader: entry.creatorUserName,
            status: entry.status,
            tags: entry.tags,

            evidenceId: entry.evidenceId,
            latitude: entry.latitude,
            longitude: entry.longitude,
            originalVideoUrl: entry.originalVideoUrl,
            analysisSpeedratio: entry.analysisSpeedratio,
            channel: entry.channel,
            startedAt: new Date(entry.startedAt).toLocaleString('en-GB', { timeZone: 'Asia/Jakarta' }),
            endedAt: new Date(entry.endedAt).toLocaleString('en-GB', { timeZone: 'Asia/Jakarta' }),
            isCompressed: entry.isCompressed,
            createdAt: new Date(entry.createdAt).toLocaleString('en-GB', { timeZone: 'Asia/Jakarta' }),
            updatedAt: new Date(entry.updatedAt).toLocaleString('en-GB', { timeZone: 'Asia/Jakarta' }),
            creatorUserName: entry.creatorUserName,
            }));
    
            setEvidenceList(transformedData);
            setFilteredData(transformedData);
            console.log(transformedData);
            setReloadEvidence(false)
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
    }, [reloadEvidence]);

    const handleAddEvidence = () => {
        navigate("/addVideo")
    } 

    const [filteredData, setFilteredData] = React.useState(evidenceList)

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log(e.target.value)
        const searchQuery = e.target.value
        const filteredData = evidenceList.filter((entry) => {
            return (
              entry.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
              entry.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
              entry.tags?.some((tag: any) => tag.tagName.toLowerCase().includes(searchQuery.toLowerCase()))
            )
          });
        setFilteredData(filteredData)
        console.log(filteredData)
    }

    // const [open, setOpen] = useState(false);

    // const hide = () => {
    //     setOpen(false);
    // };

    // const handleOpenChange = (newOpen: boolean) => {
    //     setOpen(newOpen);
    // };

    const [open, setOpen] = useState(false);
    const [videoFootageId, setVideoFootageId] = useState<string>('');
    const [evidenceData, setEvidenceData] = useState<EvidenceType>({} as EvidenceType);
    // const [playing, setPlaying] = useState(false);
    const playing = open;

    // const navigate = useNavigate();

    const onClose = () => {
        setOpen(false);
        // setPlaying(false);
    };

    const setOpenDrawer = (record : any) => {
        setOpen(true);
        setEvidenceData(record);
        setVideoFootageId(record.key);
    }

    const columns: TableProps<DataType>['columns'] = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            sorter: (a: any, b: any) => a.name.localeCompare(b.name),
            //   render: (text) => <a>{text}</a>,
            },
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            sorter: (a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime()
        },
        {
            title: 'Location',
            dataIndex: 'location',
            key: 'location',
            sorter: (a: any, b: any) => a.location.localeCompare(b.location),
        },
        {
            title: 'Tags',
            key: 'tags',
            dataIndex: 'tags',
            render: (tags) => 
            tags.map((tag: any) => <Tag>{tag.tagName}</Tag>)

            // render: (_, { tags }) => (
            //     <>
            //       {tags.map((tag) => {
            //         let color = tag.length > 5 ? 'geekblue' : 'green';
            //         if (tag === 'loser') {
            //           color = 'volcano';
            //         }
            //         return (
            //           <Tag color={color} key={tag}>
            //             {tag.toUpperCase()}
            //           </Tag>
            //         );
            //       })}
            //     </>
            //   ),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            sorter: (a: any, b: any) => a.status.localeCompare(b.status),
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <>
                    {/* <Space> */}
                        {/* <Button type="primary" icon={<FolderOutlined />} onClick={() => navigate('/missionDetails')}>Mission</Button> */}
                        <Button type="primary" icon={<FileOutlined />} onClick={() => setOpenDrawer(record)}>Evidence</Button>
                    {/* </Space> */}
                </>
            ),
        },
    ];

    useEffect(() => {
        if (connection) {
            connection.start()
                .then(result => {
                    console.log('Connected!');
                    console.log(result);
      
                    connection.on('ReceiveMessage', function(message, value) {
                        // console.log(message, value)
                    //   if (message == "new evidence") {
                    //     console.log(JSON.parse(value));
                    //     location.reload()
                    //     success(message)
                    //     console.log(value)
                    //   }
                    if (message == "add video footage") {
                        const data = JSON.parse(value)
                        success("Succesfully added " + data.name)
                        // location.reload()
                        setReloadEvidence(true)
                    }
                    else if (message == "update video footage") {
                        const data = JSON.parse(value)
                        success(data.name + " status is " + data.status)
                        // location.reload()
                        setReloadEvidence(true)
                    }
                  });
                })
                .catch(e => console.log('Connection failed: ', e));
        }
      }, [connection, success]);

    return (
        <>
            <Space direction="vertical" style={{ width: '100%' }}>
                <Title level={4}>Evidence</Title>
                <Row gutter={10}>
                    <Col flex="auto">
                        <Input placeholder="Search" onChange={handleSearch} />
                    </Col>
                    <Col flex="none">
                        <Button type="primary" onClick={handleAddEvidence}>Add Evidence</Button>
                    </Col>
                </Row>
                <Table columns={columns} dataSource={filteredData} />
            </Space>
            <Drawer
                title="Video Details"
                placement={'top'}
                closable={true}
                onClose={onClose}
                open={open}
                key={'top'}
                size="large"
                push={false}
                style={{height: '100vh'}}
            >
                <MissionDetailsDrawer videoFootageId={videoFootageId} playing={playing} evidenceData={evidenceData} success={success} />
            </Drawer>
        </>
    );
}

export default Evidence;