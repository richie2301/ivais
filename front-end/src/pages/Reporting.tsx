import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Button, Space, Checkbox, Modal, List, Typography, Input } from 'antd';
import { SelectOutlined, DeleteOutlined } from '@ant-design/icons';
// import type { CheckboxChangeEvent } from 'antd/es/checkbox';
// import type { CheckboxValueType } from 'antd/es/checkbox/Group';
import useUserStore from '../store/userStore';
import useCaseCreationStore from '../store/caseCreationStore';

// import SearchFilter from '../components/SearchFilter';

// import ReportList from '../components/ReportList';
import CaseCard from '../components/CaseCard';

// const CheckboxGroup = Checkbox.Group;

// const plainOptions = ['Apple', 'Pear', 'Orange'];
// const defaultCheckedList = ['Apple', 'Orange']

import riau from '../assets/riau.png';
// import jombang from '../assets/jombang.png';
// import makassar from '../assets/makassar.png';

const { Title } = Typography

import type { DataType } from '../pages/Evidence';

export type ReportingProps = {
    success: (message: string) => void;
}

interface UserStoreState {
    userID: string;
    // define other properties here
  }

const Reporting: React.FC<ReportingProps> = ({success}) => {

    // const [checkedList, setCheckedList] = useState<CheckboxValueType[]>(defaultCheckedList);
    const navigate = useNavigate();

    const [selectedCases, setSelectedCases] = useState<number[]>([]);
    const [checkedCases, setCheckedCases] = useState<boolean[]>([]);
    const [showCheckbox, setShowCheckbox] = useState<boolean>(false);
    // const [selectedCasesId, setSelectedCasesId] = useState<number[]>([]);
    const [selectedCasesName, setSelectedCasesName] = useState<string[]>([]);

    const clickSelect = () => {
        setShowCheckbox(!showCheckbox);
    }

    const cases = useMemo(() => [{
        id: 0,
        caseId: 1,
        caseName: "Demonstrasi UU Cipta Kerja",
        caseDescription: "Terjadi unjuk rasa UU Cipta Kerja.",
        caseImage: riau,
        team: "Team A",
        teamProfile: "https://xsgames.co/randomusers/avatar.php?g=pixel",
        date: "2021-01-01",
        totalVideos: 10,
        checked: checkedCases[0],
    },
    // {
    //     id: 1,
    //     caseId: 2,
    //     caseName: "Demo mahasiswa di Jombang",
    //     caseDescription: "Telah terjadi rusuh demo mahasiswa di Jombang.",
    //     caseImage: jombang,
    //     team: "Team B",
    //     teamProfile: "https://xsgames.co/randomusers/avatar.php?g=pixel",
    //     date: "2021-03-01",
    //     totalVideos: 5,
    //     checked: checkedCases[1],
    // },
    // {
    //     id: 0,
    //     caseId: 3,
    //     caseName: "Demo dan kerusuhan di Makassar",
    //     caseDescription: "Telah terjadi rusuh demo di Makassar.",
    //     caseImage: makassar,
    //     team: "Team C",
    //     teamProfile: "https://xsgames.co/randomusers/avatar.php?g=pixel",
    //     date: "2021-02-01",
    //     totalVideos: 15,
    //     checked: checkedCases[2],
    // },
    // {
    //     id: 3,
    //     caseId: 4,
    //     caseName: "Case 4",
    //     caseDescription: "Case 4 description",
    //     caseImage: demoRusuh,
    //     team: "Team D",
    //     teamProfile: "https://xsgames.co/randomusers/avatar.php?g=pixel",
    //     date: "2021-04-01",
    //     totalVideos: 20,
    //     checked: checkedCases[3],
    // },
    // {
    //     id: 4,
    //     caseId: 5,
    //     caseName: "Case 5",
    //     caseDescription: "Case 5 description",
    //     caseImage: karhutla,
    //     team: "Team E",
    //     teamProfile: "https://xsgames.co/randomusers/avatar.php?g=pixel",
    //     date: "2021-05-01",
    //     totalVideos: 25,
    //     checked: checkedCases[4],
    // }
], [checkedCases]);

     //fill checkedcases with false
     useEffect(() => {
        setCheckedCases(new Array(cases.length).fill(false));
    }, [cases.length]);

    const checkAll = cases.length === selectedCases.length;
    const indeterminate = selectedCases.length > 0 && selectedCases.length < cases.length;

    // const onChange = (list: CheckboxValueType[]) => {
    //     setCheckedList(list);
    // };

    // const onCheckAllChange = (e: CheckboxChangeEvent) => {
    //     setCheckedList(e.target.checked ? plainOptions : []);
    //     // findCheckedItems();
    // };

    const handleCheckAll = () => {
        setCheckedCases((prevCheckedCases) => {
            const newCheckedCases = [...prevCheckedCases];
            for (let i = 0; i < cases.length; i++) {
                newCheckedCases[i] = !checkAll;
            }
            return newCheckedCases;
        });
    }
    
    useEffect(() => {
        setSelectedCases([]);
        setSelectedCasesName([]);
        for (let i = 0; i < cases.length; i++) {
            if (cases[i].checked) {
                setSelectedCases(selectedCases => [...selectedCases, cases[i].id]);
                setSelectedCasesName(selectedCasesName => [...selectedCasesName, cases[i].caseName]);
            }
        }
    }, [checkedCases, cases]);

    // useEffect(() => {
    //     setSelectedCasesId([]);
    //     for (let i = 0; i < cases.length; i++) {
    //         if (cases[i].checked) {
    //             setSelectedCasesId(selectedCasesId => [...selectedCasesId, cases[i].caseId]);
    //         }
    //     }
    // }, [checkedCases, cases]);

    // useEffect(() => {
    //     setSelectedCasesName([]);
    //     for (let i = 0; i < cases.length; i++) {
    //         if (cases[i].checked) {
    //             setSelectedCasesName(selectedCasesName => [...selectedCasesName, cases[i].caseName]);
    //         }
    //     }
    // }, [checkedCases, cases]);

    function clickCheckbox(id: number) {
        setCheckedCases((prevCheckedCases) => {
            const newCheckedCases = [...prevCheckedCases];
            newCheckedCases[id] = !newCheckedCases[id];
            return newCheckedCases;
        });

        console.log("clicked!" + id);
    }

    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
        success("Successfully deleted " + selectedCases.length + " cases!")
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const [evidenceList, setEvidenceList] = React.useState<DataType[]>([])

    const url = import.meta.env.VITE_API_URL;

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
            // setFilteredData(transformedData);
            console.log(transformedData);
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
    }, []);

    const createdUserId = (useUserStore.getState() as UserStoreState).userID;

    const handleAddCase = () => {
        fetch( url + '/api/Case/CreateCaseDraft?CreatorUserId=' + createdUserId, {
            method: 'POST',
        }).then((response) => {
                // navigate('/addCase')
                // console.log(response)
                if (!response.ok) {
                  throw new Error(`HTTP error! status: ${response.status}`);
                }
                else {
                //   navigate('/addCase')
                // console.log(response.data)
                }
                return response.json();
              })
              .then((data) => {
                console.log(data);
                // const responseData = JSON.parse(data)
                // console.log(data['caseId']);
                useCaseCreationStore.setState({caseId: data.caseId})
                success(data.message)
                navigate('/addCase')
              })
              .catch((error) => {
                console.error('There was a problem with the fetch operation:', error);
              });
          }

    return (
        <>
            <Row justify="space-between">
                <Space style={{paddingBottom: '20px'}}>
                    <Title level={4}>Case</Title>
                </Space>
                <Space>
                    <Button icon={<SelectOutlined />} onClick={clickSelect}>Select</Button>
                    <Button type="primary" onClick={handleAddCase}>Add Case</Button>
                </Space>
            </Row>
            {/* <Button onClick={findCheckedItems}>APASI</Button> */}
            {/* <div style={{color: showCheckbox ? 'red' : 'none'}}> */}
                {showCheckbox && 
                    <Row justify="space-between" style={{paddingBottom: '20px'}}>
                    <Col>
                        <Space>
                            <Checkbox indeterminate={indeterminate} checked={checkAll} onClick={handleCheckAll}>
                                Select All 
                            </Checkbox>
                            <div>
                                ({selectedCases.length} cases selected)
                            </div>  
                        </Space>
                    </Col>
                    <Col>
                        <Button icon={<DeleteOutlined />} onClick={showModal}>Delete ({selectedCases.length})</Button>
                        <Modal centered title={"Delete " + selectedCases.length + " cases?"} open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                        <List
                            size="small"
                            dataSource={selectedCasesName}
                            renderItem={(item) => <List.Item>{item}</List.Item>}
                        />
                        </Modal>
                    </Col>
                </Row>}
            {/* </div> */}
            {/* <div>
                {checkedCases}
                {checkedItems}
            <Checkbox indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll} onClick={handleCheckAll}>
                Check all
            </Checkbox>
            <CheckboxGroup options={plainOptions} value={checkedList} onChange={onChange} />
            </div> */}
            <div>
                {/* <SearchFilter /> */}
                <Input placeholder="Search Case" style={{marginBottom: '20px'}} />
                <Row gutter={[20, 20]}>
                    {cases.map((item) => (
                        <Col span={24} md={12} lg={8} xl={6} key={item.id}>
                            <CaseCard record={evidenceList[item.id]} caseData={item} clickCheckbox={clickCheckbox} showCheckbox={showCheckbox} success={success} />
                        </Col>
                    ))}
                </Row>
            </div>
        </>
    )
}
export default Reporting;