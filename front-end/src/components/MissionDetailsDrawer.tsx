import React, { useEffect, useState, useRef } from "react";
import { Space, Typography, Layout, Drawer, Row, Col, Tabs, Tag } from "antd";
import type { TabsProps } from 'antd';
// import { EyeOutlined } from '@ant-design/icons';
import FaceList from "./FaceList";
import AttributeList from "./AttributeList";

import ReactPlayer from "react-player/lazy";

import type { EvidenceType } from "../pages/Evidence"
import useUserStore from "../store/userStore";
import { UserStoreState } from "../type/storeTypes";
import AddTagInput from "./AddTagInput";

// import videoUrl from "../assets/video.mp4";

const { Title, Text } = Typography

// interface DataType {
//     key: string;
//     name: string;
//     date: string;
//     location: string;
//     tags: string[];
//     status: string;
//   }

//   interface EvidenceType extends DataType {
//     evidenceId: string;
//     latitude: number;
//     longitude: number;
//     originalVideoUrl: string;
//     analysisSpeedratio: number;
//     channel: number;
//     startedAt: Date;
//     endedAt: Date;
//     isCompressed: boolean;
//     createdAt: Date;
//     updatedAt: Date;
//   }
export interface PeopleAttributeType {
    time: number;
    // [key: string]: number | undefined;
    attribute: any;
    picture: string;
  }

  export interface FaceDataType {
    time: number;
    personNumber: number;
    picture: string;
    name: string;
  }

type MissionDetailsDrawerProps = {
    videoFootageId: string;
    playing: boolean;
    evidenceData: EvidenceType;
    success: (message: string) => void;
}

const MissionDetailsDrawer: React.FC<MissionDetailsDrawerProps> = ({videoFootageId, playing, evidenceData, success}) => {
    const ref = useRef<ReactPlayer>(null);
    const [open, setOpen] = useState(false);

    const onClose = () => {
        setOpen(false);
    };

    // const openDrawer = () => {
    //     setOpen(true);
    // }

    const [isPlaying, setIsPlaying] = useState(false)

    useEffect(() => {
        setIsPlaying(playing)
    }, [playing])

    const seek = (a : number) => {
        ref.current?.seekTo(a);
        setIsPlaying(false)
    }

    // const currentVideoFootageId = "VideoFootage/7060e047-4ae5-4ec9-8aa2-6677bbcaaaa5"
    const url = import.meta.env.VITE_API_URL
    const videoUrl = url + '/EvidenceVideoAttachment?videoFootageId=' + videoFootageId
    // const videoDataUrl = url + '/GetEvidenceById?videoFootageId=' + videoFootageId
    // const videoDataUrl = url + '/GetCaseEvidenceById?evidenceId=' + evidenceData.evidenceId
    // const videoUrl = "./assets/video.mp4"

    const [peopleAttribute, setPeopleAttribute] = useState<PeopleAttributeType[]>([])
    const [faceData, setFaceData] = useState<FaceDataType[]>([])
    // const [attributePhotos, setAttributePhotos] = useState<string[]>([])
    const [tags, setTags] = useState([])

    useEffect(() => {
        console.log(evidenceData)
        fetch (url + '/GetCaseEvidenceById?evidenceId=' + evidenceData.evidenceId , {
            method: 'GET',
            headers: {
                'Content-Type': "application/json"
            }
        })
        .then((response) => {
            if (!response.ok) {
                setPeopleAttribute([])
                setFaceData([])
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            else {
                return response.json()
            }
        })
        .then((data) => {
            console.log(data)
            setPeopleAttribute(data.peopleAttributeData)
            setFaceData(data.faceRecognitionData)
            // setAttributePhotos(data.attributePhotos)
            // console.log(data.attributePhotos)
        })
        .catch((error) => {
            console.error('There was a problem with the fetch operation:', error);
        });
    }, [evidenceData, url])

    useEffect(() => {
        fetch(url + '/api/Evidence/tag/list?evidenceId=' + evidenceData.evidenceId, {
            method: 'GET',
            headers: {
                'Content-Type': "application/json"
            }
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            else {
                return response.json()
            }
        })
        .then((data: any) => {
            console.log(data)
            setTags(data)
        })
        .catch((error) => {
            console.error('There was a problem with the fetch operation:', error);
        });
    }, [evidenceData, url])

    const handleCloseTag = (tagId: string, evidenceId: string) => {
        fetch(url + '/api/Evidence/tag/delete', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            creatorUserId: (useUserStore.getState() as UserStoreState).userID,
            tagId: tagId,
            evidenceId: evidenceId
          })
        })
        .then((response) => {
          if (response.ok) {
              success("Successfully deleted tag!")
              return response.json();
          }
          else {
              throw new Error("Something went wrong");
          }
        })
        .then((data) => {
          console.log(data);
        })
        .catch((error) => {
          console.log(error);
        })
      }

    const tabItems: TabsProps['items'] = [
        {
          key: '1',
          label: 'General',
          children: 
          <>
            <Space direction="vertical" style={{padding: '0 0 0 10px', height: '500px', width: '100%', overflow: 'auto'}}>
                
                <Row justify="space-between">
                    <Col>
                        <Title level={4}>{evidenceData.name}</Title>
                    </Col>
                    {/* <Col>
                        <Space align="center" style={{height: '100%'}}>
                            <Button type="primary" icon={<EyeOutlined />}>View</Button>
                        </Space>
                    </Col> */}
                </Row>
                <Row>
                    <Col span={6}>
                        <Text strong>Location</Text>
                    </Col>
                    <Col span={18}>
                        <Text>{evidenceData.location}</Text>
                    </Col>
                </Row>
                <Row>
                    <Col span={6}>
                        <Text strong>Address</Text>
                    </Col>
                    <Col span={18}>
                        <Text>Jl. Kebon Jeruk Blok ABC No. 56, Jakarta Barat, Jakarta, 10156</Text>
                    </Col>
                </Row>
                <Row>
                    <Col span={6}>
                        <Text strong>Start Time</Text>
                    </Col>
                    <Col span={18}>
                        <Text>{evidenceData.startedAt.toString()}</Text>
                    </Col>
                </Row>
                <Row>
                    <Col span={6}>
                        <Text strong>End Time</Text>
                    </Col>
                    <Col span={18}>
                        <Text>{evidenceData.endedAt.toString()}</Text>
                    </Col>
                </Row>
                <Row>
                    <Col span={6}>
                        <Text strong>Creator</Text>
                    </Col>
                    <Col span={18}>
                        <Text>{evidenceData.creatorUserName}</Text>
                    </Col>
                </Row>
                <Row>
                    <Col span={6}>
                        <Text strong>Created At</Text>
                    </Col>
                    <Col span={18}>
                        <Text>{evidenceData.createdAt.toString()}</Text>
                    </Col>
                </Row>
                <Row>
                    <Col span={6}>
                        <Text strong>Updated At</Text>
                    </Col>
                    <Col span={18}>
                        <Text>{evidenceData.updatedAt.toString()}</Text>
                    </Col>
                </Row>
                <Row>
                    <Col span={6}>
                        <Text strong>Tags</Text>
                    </Col>
                    <Col span={18}>
                        <Space direction="vertical">
                            <Space.Compact>
                                {tags.map((tag: any) => 
                                    <Tag closable={true} onClose={() => handleCloseTag(tag.tagId, evidenceData.evidenceId)}>{tag.name}</Tag>
                                )}
                            </Space.Compact>
                            <AddTagInput evidenceId={evidenceData.evidenceId} success={success} />
                        </Space>
                    </Col>
                </Row>
            </Space>
          </>,
        },
        {
          key: '2',
          label: 'Face',
          children: 
          <>
            <Space direction="vertical" style={{height: '500px', width: '100%', overflow: 'auto', paddingTop: '0px'}}>
                {/* <ClipList /> */}
                <FaceList seek={seek} faceData={faceData} />
                {/* <Input placeholder="Search" style={{position: 'absolute', top: '0px'}} /> */}
            </Space>
          </>,
        },
        {
          key: '3',
          label: 'Attribute',
          children:
          <>

            {/* <Button type="text" style={{color: '#1668dc', fontWeight: 'bold'}} onClick={() => {ref.current?.seekTo(0)}}>00:00:00</Button>
            <Button type="text" style={{color: '#1668dc', fontWeight: 'bold'}} onClick={() => {ref.current?.seekTo(5)}}>00:00:05</Button>
            <Button type="text" style={{color: '#1668dc', fontWeight: 'bold'}} onClick={() => {ref.current?.seekTo(10)}}>00:00:10</Button>
            <Button type="text" style={{color: '#1668dc', fontWeight: 'bold'}} onClick={() => {ref.current?.seekTo(30)}}>00:00:30</Button>
            <Button type="text" style={{color: '#1668dc', fontWeight: 'bold'}} onClick={() => {ref.current?.seekTo(60)}}>00:01:00</Button> */}
            {/* <ClipList seek={seek} /> */}
            <Space direction="vertical" style={{height: '500px', width: '100%', overflow: 'auto', paddingTop: '0px'}}>
                {/* <ClipList /> */}
                <AttributeList seek={seek} peopleAttribute={peopleAttribute} />
                {/* <Input placeholder="Search" style={{position: 'absolute', top: '0px'}} /> */}
            </Space>
          </>,
        },
      ];

    return (
        <Layout style={{height: '100%', overflowY: 'auto', overflowX: 'hidden', background: 'transparent'}}>
            <Row gutter={20}>
                <Col span={16} style={{height: '500px'}}>
                    <ReactPlayer style={{background: 'grey'}} ref={ref} playing={isPlaying} url={videoUrl} controls={true} width="100%" height="100%" />
                    {/* <ReactPlayer ref={ref} url="https://www.youtube.com/watch?v=pWQF-ETjzx8" width="100%" height="100%" controls={true} /> */}
                    {/* <iframe width="100%" height="100%" src="https://www.youtube.com/embed/pWQF-ETjzx8?si=sJdvLKDFkenh9tEU" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"></iframe> */}
                </Col>
                <Col span={8}>
                <Tabs
                    // onChange={onChange}
                    type="card"
                    items={tabItems}
                    // items={new Array(3).fill(null).map((_, i) => {
                    // const id = String(i + 1);
                    // return {
                    //     label: `Tab ${id}`,
                    //     key: id,
                    //     children: `Content of Tab Pane ${id}`,
                    // };
                    // })}
                />
                </Col>
            </Row>
            {/* <Button type="primary" onClick={openDrawer}>Fullscreen</Button> */}
            <Drawer
                title="Video Details"
                placement={'right'}
                closable={true}
                onClose={onClose}
                open={open}
                key={'right'}
                push={false}
            >
            </Drawer>
        </Layout>
    );
  }
  
  export default MissionDetailsDrawer;