import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Space, Typography, Row, Col, Button, Tabs, List, Modal, Checkbox, Input } from 'antd';
import { EditOutlined, SelectOutlined, DeleteOutlined } from '@ant-design/icons';
import SearchFilter from '../components/SearchFilter';
import VideoCard from '../components/VideoCard';
import type { TabsProps } from 'antd';

const { Text, Title } = Typography;
const { TextArea } = Input;

type CaseDetails = {
    success: (message : string) => void
}

const cases = [{
    id: 0,
    caseId: 1,
    caseName: "Case 1",
    caseDescription: "Case 1 description",
    caseImage: "https://www.marineinsight.com/wp-content/uploads/2021/04/Black-sea-1.png",
    team: "Team A",
    teamProfile: "https://xsgames.co/randomusers/avatar.php?g=pixel",
    date: "2021-01-01",
    totalVideos: 10,
},
{
    id: 1,
    caseId: 2,
    caseName: "Case 2",
    caseDescription: "Case 2 description",
    caseImage: "https://www.marineinsight.com/wp-content/uploads/2021/04/Black-sea-1.png",
    team: "Team B",
    teamProfile: "https://xsgames.co/randomusers/avatar.php?g=pixel",
    date: "2021-03-01",
    totalVideos: 5,
},
{
    id: 2,
    caseId: 3,
    caseName: "Case 3",
    caseDescription: "Case 3 description",
    caseImage: "https://c0.wallpaperflare.com/preview/789/637/166/backlit-chiemsee-dawn-desktop-backgrounds.jpg",
    team: "Team C",
    teamProfile: "https://xsgames.co/randomusers/avatar.php?g=pixel",
    date: "2021-02-01",
    totalVideos: 15,
},
{
    id: 3,
    caseId: 4,
    caseName: "Case 4",
    caseDescription: "Case 4 description",
    caseImage: "https://www.marineinsight.com/wp-content/uploads/2021/04/Black-sea-1.png",
    team: "Team D",
    teamProfile: "https://xsgames.co/randomusers/avatar.php?g=pixel",
    date: "2021-04-01",
    totalVideos: 20,
},
{
    id: 4,
    caseId: 5,
    caseName: "Case 5",
    caseDescription: "Case 5 description",
    caseImage: "",
    team: "Team E",
    teamProfile: "https://xsgames.co/randomusers/avatar.php?g=pixel",
    date: "2021-05-01",
    totalVideos: 25,
}]

const CaseDetails: React.FC<CaseDetails> = ({success}) => {
    const { caseId } = useParams();
    // console.log(caseId);
    const navigate = useNavigate();

    const caseData = cases.find((c) => c.caseId === parseInt(caseId || ""));
    // console.log(caseData);

    const [showCheckbox, setShowCheckbox] = useState(false)
    const [selectedVideos, setSelectedVideos] = useState<number[]>([]);
    const [checkedVideos, setCheckedVideos] = useState<boolean[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedVideosName, setSelectedVideosName] = useState<string[]>([]);
    const [isEditCaseModalOpen, setIsEditCaseModalOpen] = useState(false);

    const videos = useMemo(() => [
        {
            id: 0,
            videoId: 1,
            video: "https://img.freepik.com/free-photo/painting-mountain-lake-with-mountain-background_188544-9126.jpg?size=626&ext=jpg&ga=GA1.1.1413502914.1696896000&semt=ais",
            videoName: "Video 1",
            videoDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris vel varius velit. Integer laoreet leo odio, eget interdum lectus blandit a. Integer a urna est. Quisque lacinia, diam sed scelerisque convallis, ex augue dictum nisl, cursus laoreet dolor risus non diam.",
            videoTags: ["tag 1", "tag 2", "tag 3"],
            location: "Jakarta",
            date: "10/10/2023",
            team: "Team A",
            teamProfile: "https://xsgames.co/randomusers/avatar.php?g=pixel",
            checked: checkedVideos[0]
        },
        {
            id: 1,
            videoId: 2,
            video: "https://img.freepik.com/free-photo/painting-mountain-lake-with-mountain-background_188544-9126.jpg?size=626&ext=jpg&ga=GA1.1.1413502914.1696896000&semt=ais",
            videoName: "Video 2",
            videoDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris vel varius velit. Integer laoreet leo odio, eget interdum lectus blandit a. Integer a urna est. Quisque lacinia, diam sed scelerisque convallis, ex augue dictum nisl, cursus laoreet dolor risus non diam.",
            videoTags: ["tag 1", "tag 2", "tag 3"],
            location: "Jakarta",
            date: "10/10/2023",
            team: "Team B",
            teamProfile: "https://xsgames.co/randomusers/avatar.php?g=pixel",
            checked: checkedVideos[1]
        },
        {
            id: 2,
            videoId: 3,
            video: "https://img.freepik.com/free-photo/painting-mountain-lake-with-mountain-background_188544-9126.jpg?size=626&ext=jpg&ga=GA1.1.1413502914.1696896000&semt=ais",
            videoName: "Video 3",
            videoDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris vel varius velit. Integer laoreet leo odio, eget interdum lectus blandit a. Integer a urna est. Quisque lacinia, diam sed scelerisque convallis, ex augue dictum nisl, cursus laoreet dolor risus non diam.",
            videoTags: ["tag 1", "tag 2", "tag 3"],
            location: "Jakarta",
            date: "10/10/2023",
            team: "Team C",
            teamProfile: "https://xsgames.co/randomusers/avatar.php?g=pixel",
            checked: checkedVideos[2]
        },
        {
            id: 3,
            videoId: 4,
            video: "https://img.freepik.com/free-photo/painting-mountain-lake-with-mountain-background_188544-9126.jpg?size=626&ext=jpg&ga=GA1.1.1413502914.1696896000&semt=ais",
            videoName: "Video 4",
            videoDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris vel varius velit. Integer laoreet leo odio, eget interdum lectus blandit a. Integer a urna est. Quisque lacinia, diam sed scelerisque convallis, ex augue dictum nisl, cursus laoreet dolor risus non diam.",
            videoTags: ["tag 1", "tag 2", "tag 3"],
            location: "Jakarta",
            date: "10/10/2023",
            team: "Team D",
            teamProfile: "https://xsgames.co/randomusers/avatar.php?g=pixel",
            checked: checkedVideos[3]
        },
        {
            id: 4,
            videoId: 5,
            video: "https://img.freepik.com/free-photo/painting-mountain-lake-with-mountain-background_188544-9126.jpg?size=626&ext=jpg&ga=GA1.1.1413502914.1696896000&semt=ais",
            videoName: "Video 5",
            videoDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris vel varius velit. Integer laoreet leo odio, eget interdum lectus blandit a. Integer a urna est. Quisque lacinia, diam sed scelerisque convallis, ex augue dictum nisl, cursus laoreet dolor risus non diam.",
            videoTags: ["tag 1", "tag 2", "tag 3"],
            location: "Jakarta",
            date: "10/10/2023",
            team: "Team E",
            teamProfile: "https://xsgames.co/randomusers/avatar.php?g=pixel",
            checked: checkedVideos[4]
        }],[checkedVideos])

    const clickSelect = () => {
        setShowCheckbox(!showCheckbox);
    }

      const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
        success("Successfully deleted " + selectedVideos.length + " videos!")
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const showEditCaseModal = () => {
        setIsEditCaseModalOpen(true);
      }
    
      const handleEditCaseModalCancel = () => {
        setIsEditCaseModalOpen(false);
      }
    
      const handleEditCaseModalOk = () => {
        setIsEditCaseModalOpen(false);
        success('Case edited successfully')
      }

    useEffect(() => {
        setCheckedVideos(new Array(videos.length).fill(false));
    }, [videos.length]);

    useEffect(() => {
        setSelectedVideos([]);
        setSelectedVideosName([]);
        for (let i = 0; i < videos.length; i++) {
            if (videos[i].checked) {
                setSelectedVideos(selectedVideos => [...selectedVideos, videos[i].id]);
                setSelectedVideosName(selectedVideosName => [...selectedVideosName, videos[i].videoName]);
            }
        }
    }, [checkedVideos, videos]);

    console.log(selectedVideosName);

    // useEffect(() => {
    //     setSelectedVideosName([]);
    //     for (let i = 0; i < videos.length; i++) {
    //         if (videos[i].checked) {
    //             setSelectedVideosName(selectedVideosName => [...selectedVideosName, videos[i].videoName]);
    //         }
    //     }
    // }, [checkedVideos, videos]);

    const handleCheckAll = () => {
        setCheckedVideos((prevCheckedVideos) => {
            const newCheckedVideos = [...prevCheckedVideos];
            for (let i = 0; i < videos.length; i++) {
                newCheckedVideos[i] = !checkAll;
            }
            return newCheckedVideos;
        });
    }

    function clickCheckbox(id: number) {
        setCheckedVideos((prevCheckedVideos) => {
            const newCheckedVideos = [...prevCheckedVideos];
            newCheckedVideos[id] = !newCheckedVideos[id];
            return newCheckedVideos;
        });

        console.log("clicked!" + id);
    }

    const checkAll = videos.length === selectedVideos.length;
    const indeterminate = selectedVideos.length > 0 && selectedVideos.length < cases.length;

    const tabItems: TabsProps['items'] = [
        {
          key: '1',
          label: 'Videos',
          children: 
            <>  
                <Row justify="space-between">
                    <h3>Video List</h3>
                    <Space>
                        <Button icon={<SelectOutlined />} onClick={clickSelect}>Select</Button>
                    </Space>
                </Row>
                {showCheckbox && 
                    <Row justify="space-between" style={{paddingBottom: '20px'}}>
                    <Col>
                        <Space>
                            <Checkbox indeterminate={indeterminate} checked={checkAll} onClick={handleCheckAll}>
                                Select All 
                            </Checkbox>
                            <div>
                                ({selectedVideos.length} cases selected)
                            </div>  
                        </Space>
                    </Col>
                    <Col>
                        <Button icon={<DeleteOutlined />} onClick={showModal}>Delete ({selectedVideos.length})</Button>
                        <Modal centered title={"Delete " + selectedVideos.length + " cases?"} open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                        <List
                            size="small"
                            dataSource={selectedVideos}
                            renderItem={(item) => <List.Item>{item}</List.Item>}
                        />
                        </Modal>
                    </Col>
                </Row>}
                <SearchFilter />
                <Space direction='vertical' style={{width: '100%'}}>
                    {videos.map((item) => (
                        <VideoCard videos={item} clickCheckbox={clickCheckbox} showCheckbox={showCheckbox} success={success} />
                    ))}
                    {/* <VideoCard videos={videos} /> */}
                </Space>
            </>
          ,
        },
        {
          key: '2',
          label: 'Statistics',
          children: 
          <div>A</div>
          ,
        },
      ];

      const handleBackClick = () => {
        navigate(-1);
      }

    return (
      <>
        <Space direction="vertical">
            <Button onClick={handleBackClick}>Back</Button>
            {/* <Space style={{paddingBottom: '20px'}}> */}
                <Title level={4}>Case Details</Title>
            {/* </Space> */}
            {/* <h2>{caseId}</h2> */}
        </Space>
        <div>
            {/* <Space>
                <Avatar
                    size={{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100 }}
                    src={caseData?.teamProfile ? caseData.teamProfile : "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"}
                />
                <h3>{caseData?.team}</h3>
            </Space> */}
            <Row justify="space-between">
                <Col>
                    <Title>{caseData?.caseName}</Title>
                    <Text>{caseData?.caseDescription}</Text>
                </Col>
                <Col>
                    <Button onClick={showEditCaseModal} icon={<EditOutlined />}>Edit</Button>
                    <Modal centered title="Edit Case" open={isEditCaseModalOpen} onCancel={handleEditCaseModalCancel} onOk={handleEditCaseModalOk}>
                        <Space direction='vertical' style={{width: '100%', padding: '30px 0'}}>
                        <Text>Case Name</Text>
                        <Input placeholder="Enter case name" />
                        <Text>Case Description</Text>
                        <TextArea placeholder="Enter case description" autoSize />
                        </Space>
                    </Modal>
                </Col>
            </Row>
            <Row  style={{padding: '30px 0'}} justify="space-between">
                <Col>
                    <Space>
                        {/* <Avatar
                            size={32}
                            src={caseData?.teamProfile ? caseData.teamProfile : "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"}
                        /> */}
                        <Text>{caseData?.date} • {caseData?.totalVideos} videos</Text>
                    </Space>
                </Col>
                {/* <Col><Button icon={<SelectOutlined />}>Select</Button></Col> */}
            </Row>
            {/* <Divider /> */}
        </div>
        <div>
        <Tabs
            type="card"
            items={tabItems}
        />
        </div>
        {/* <SearchFilter />
        <div>
            <VideoCard />
        </div> */}
      </>
    );
  }
  
  export default CaseDetails;