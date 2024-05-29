import React, { useEffect, useRef, useState } from 'react'
import { Typography, Row, Col, Space, Table, Button, ConfigProvider, theme, Modal, Tag } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
// import type { ColumnsType } from 'antd/es/table'
import { useParams, useNavigate } from 'react-router-dom'
import html2pdf from 'html2pdf.js'
import logo from '../assets/logo.png'
import ReactEcharts from "echarts-for-react"; 

// import Charts from '../components/EvidenceCharts'

const { Title, Text } = Typography

const columns = [
    // {
    //     title: 'No',
    //     dataIndex: 'no',
    //     key: 'no'
    // },
    {
        title: 'Note',
        dataIndex: 'note',
        key: 'note',
        // onCell: (record: any) => ({
        //     rowSpan: record.data.length
        //   }),
    },
    {
        title: 'Level',
        dataIndex: 'level',
        key: 'level',
        width: 10
    },
    {
        title: 'Pictures',
        dataIndex: 'pictures',
        key: 'pictures',
        render: (_ : any, record: any) => 
        // <Space>
        //     <img src={record.data.picture} />
        // </Space>,
        <Space direction="vertical" style={{width: '100%'}}>
            {record.pictures.map((data: any) => 
            <Row justify="space-between" style={{height: '100px'}} gutter={10}>
                <Col>
                <img src={"data:image/png;base64," + data.picture} style={{height: '100px'}} />
                </Col>
                <Col style={{paddingTop: '40px'}}>
                    <Text style={{textAlign: 'right'}}>{new Date(data.time).toLocaleTimeString('en-GB', { timeZone: 'UTC' })}</Text>
                </Col>
            </Row>
            // <Divider style={{height: '100px', color: 'blue', width: '100px'}}/>
            )}
        </Space>
    },
    {
        title: 'Start Time',
        dataIndex: 'startTime',
        key: 'startTime',
        width: 20,
        render: (text: string) => new Date(text).toLocaleTimeString('en-GB', { timeZone: 'UTC' })
        // render: (_: any, record: any) => 
        // <Space direction="vertical">
        //     {record.data.map((data: any) => 
        //     <Space style={{height: '100px'}}>
        //         <Text>{data.startTime}</Text>
        //     </Space>
        //     )}
        // </Space>
    },
    {
        title: 'End Time',
        dataIndex: 'endTime',
        key: 'endTime',
        width: 20,
        render: (text: string) => new Date(text).toLocaleTimeString('en-GB', { timeZone: 'UTC' })
        // render: (_: any, record: any) => 
        // <Space direction="vertical">
        //     {record.data.map((data: any) => 
        //     <Space style={{height: '100px'}}>
        //         <Text>{data.startTime}</Text>
        //     </Space>
        //     )}
        // </Space>
    },
    // {
    //     title: 'End Time',
    //     dataIndex: 'endTime',
    //     key: 'endTime',
    // },
    // {
    //     title: 'Picture',
    //     dataIndex: 'picture',
    //     key: 'picture'
    // }
    {
        title: 'Added At',
        dataIndex: 'addedAt',
        key: 'addedAt',
        width: 10,
        render: (value : string) => <Text>{new Date(value).toLocaleDateString('en-GB', { timeZone: 'Asia/Jakarta' })}</Text>
    },
    {
        title: 'Added By',
        dataIndex: 'addedBy',
        key: 'addedBy',
        width: 20
    }
    
]
const personListColumns = [
    {
        title: 'Picture',
        dataIndex: 'picture',
        key: 'picture',
        // render: (text: string) => <img src={"data:image/png;base64," + text} height="100px" />
        render: (text: string) => 
        <Space.Compact direction="vertical" style={{width: '100%', textAlign: 'center'}}>
            <img src={"data:image/png;base64," + text} height="80px" style={{margin: 'auto'}} />
        </Space.Compact>

    },
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name'
    },
    // {
    //     title: 'Email',
    //     dataIndex: 'email',
    //     key: 'email'
    // },
    // {
    //     title: 'Role',
    //     dataIndex: 'role',
    //     key: 'role'
    // }
]

const attributeColumns = [
    {
        title: 'No',
        dataIndex: 'no',
        key: 'no',
        width: 10
    },
    {
        title: 'Parameter',
        dataIndex: 'parameter',
        key: 'parameter',
        width: 180
    },
    {
        title: 'Value',
        dataIndex: 'value',
        key: 'value'
    }
]

interface ReportDataProps {
    title: string,
    executiveSummary: string,
    conclusion: string,
    dateOpened: string,
    dateClosed: string,
    durationOfInvestigation: string,
    creator: string,
    collaborators: string[],
    teamMember: any[],
    objective: string,
    attributeBaseFilter: {
        age: string,
        gender: string,
        hairLength: string,
        upperClothesLength: string,
        lowerClothesLength: string,
        lowerClothesType: string,
        accessories: string,
        upperClothesColor: string,
        lowerClothesColor: string
    },
    // evidences: any[],
    evidenceSummary: {
        distributionOfSourceOfEvidence: any[],
        evidences: any[],
        totalEvidence: number,
    },
    tagSummary: {
        totalEvidenceTag: number,
        top5EvidenceTag: any[],
        evidenceTags: any[]
    },
    caseActivitySummary: any[],
    personBaseFilter: any[],
    caseStatus: string,
    tags: string[],
    teamMemberContribution: {
        teamMemberContributionDistribution: any,
        teamMemberContributionOverview: any
    }
}

const Report: React.FC = () => {
    const navigate = useNavigate()

    const url = import.meta.env.VITE_API_URL;
    const caseId = useParams();
    const [data, setData] = useState<ReportDataProps>()
    const [createdAt, setCreatedAt] = useState<string>()
    const [closedAt, setClosedAt] = useState<string>()
    const [sourceDistribution, setSourceDistribution] = useState([])

    const contentRef = useRef(null);

    const content = contentRef.current;
    const options = {
        filename: data?.title + '.pdf',
        margin: 0.7,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: {
            unit: 'in',
            format: 'a4',
            orientation: 'portrait',
        },
    };

	const convertToPdf = () => {
		html2pdf().set(options).from(content).save();
	};

    const preview = () => {
        html2pdf().set(options).from(content).toPdf().get('pdf').then(function (pdf : any) {
            window.open(pdf.output('bloburl'), '_blank');
        });
    }

    useEffect(() => {
        fetch(url + '/api/Case/report?caseId=' + caseId.id, {
            method: 'GET'
        }).then((response) => {
            if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        }).then((response: any) => {     
            console.log(response)      
            setData(response)
            setCreatedAt(new Date(response.dateOpened).toLocaleDateString('en-GB', { timeZone: 'Asia/Jakarta' }))
            setClosedAt(new Date(response.dateClosed).toLocaleDateString('en-GB', { timeZone: 'Asia/Jakarta' }))
            setSourceDistribution(
                response.evidenceSummary.distributionOfSourceOfEvidence.map((data: any) => ({
                    value: data.value,
                    name: data.key
                }))
            )
        }).catch((error) => {
            console.error("There was a problem with the fetch operation:", error)
        })
    }, [])

    // const [conclusion, setConclusion] = useState<any>()
    const [openConclusionModal, setOpenConclusionModal] = useState(false)

    const teamMemberNumber = useRef(1)

    const teamMemberColumns = [
        {
            title: 'No',
            dataIndex: 'no',
            key: 'no',
            // render: (index: number) => <Text>{index}</Text>
            render: () => <Text>{teamMemberNumber.current++}</Text>
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name'
        },
        {
            title: 'Picture',
            dataIndex: 'picture',
            key: 'picture',
            render: (text: string) => <img src={"data:image/png;base64," + text} height="80px" />
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email'
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role'
        },
        {
            title: 'Date joined',
            dataIndex: 'dateJoined',
            key: 'dateJoined',
            render: (text: string) => <Text>{new Date(text).toLocaleDateString('en-GB', { timeZone: 'Asia/Jakarta' })}</Text>
        },
    ]

    const attributeFilterData = [
        {
            no: 1,
            parameter: 'Age',
            value: data?.attributeBaseFilter.age ? data?.attributeBaseFilter.age : '-'
        },
        {
            no: 2,
            parameter: 'Gender',
            value: data?.attributeBaseFilter.gender ? data?.attributeBaseFilter.gender : '-'
        },
        {
            no: 3,
            parameter: 'Hair Length',
            value: data?.attributeBaseFilter.hairLength ? data?.attributeBaseFilter.hairLength : '-'
        },
        {
            no: 4,
            parameter: 'Upper Clothes Length',
            value: data?.attributeBaseFilter.upperClothesLength ? data?.attributeBaseFilter.upperClothesLength : '-'
        },
        {
            no: 5,
            parameter: 'Lower Clothes Length',
            value: data?.attributeBaseFilter.lowerClothesLength ? data?.attributeBaseFilter.lowerClothesLength : '-'
        },
        {
            no: 6,
            parameter: 'Lower Clothes Type',
            value: data?.attributeBaseFilter.lowerClothesType ? data?.attributeBaseFilter.lowerClothesType : '-'
        },
        {
            no: 7,
            parameter: 'Accessories',
            value: data?.attributeBaseFilter.accessories ? data?.attributeBaseFilter.accessories : '-'
        },
        {
            no: 8,
            parameter: 'Upper Clothes Color',
            value: data?.attributeBaseFilter.upperClothesColor ? data?.attributeBaseFilter.upperClothesColor : '-'
        },
        {
            no: 9,
            parameter: 'Lower Clothes Color',
            value: data?.attributeBaseFilter.lowerClothesColor ? data?.attributeBaseFilter.lowerClothesColor : '-'
        }
    ]

    const evidenceSummaryOption = {
        title: {
          text: 'Evidence Type',
          left: 'center',
          show: false
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          top: 'bottom',
          show: false
        },
        series: [
          {
            name: 'Access From',
            type: 'pie',
            radius: '80%',
            data: sourceDistribution,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },
            label: {
                formatter: '{b}: {@2012} ({d}%)'
            },
          }
        ]
      }; 

      const evidenceTagOption = {
        xAxis: {
          type: 'value',
        //   data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
          type: 'category',
          data: data?.tagSummary.top5EvidenceTag.map((entry: any) => entry.key)
        },
        series: [
          {
            data: data?.tagSummary.top5EvidenceTag.map((entry: any) => entry.value),
            type: 'bar',
            label: {
                show: true,
                position: 'right'
            }
          }
        ]
      };

      const teamContributionOption = {
        title: {
          text: 'Team Contribution',
        //   subtext: 'Fake Data',
          left: 'center',
          show: false
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          top: 'bottom',
          show: false
        },
        series: [
          {
            name: 'Access From',
            type: 'pie',
            radius: '80%',
            data: data?.teamMemberContribution.teamMemberContributionDistribution.map((entry: any) => ({value: entry.value, name: entry.key})),
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },
            label: {
                formatter: '{b} ({d}%)'
            },
          }
        ]
      };

      const memberContributionOption = {
        title: {
          text: 'Member Contribution',
          show: false
        },
        legend: {
          data: data?.teamMemberContribution.teamMemberContributionOverview.map((entry: any) => entry.key),
          left: 'left',
          top: 'bottom',
          orient: 'vertical'
        },
        radar: {
          shape: 'circle',
          indicator: [
            { name: 'Notes', min: 0, max: Math.max(data?.teamMemberContribution.teamMemberContributionOverview.map((entry: any) => entry.value.noteRelated)) },
            { name: 'Tag', min: 0, max:  Math.max(data?.teamMemberContribution.teamMemberContributionOverview.map((entry: any) => entry.value.tagRelated)) },
            { name: 'Evidence Activity', min: 0, max:  Math.max(data?.teamMemberContribution.teamMemberContributionOverview.map((entry: any) => entry.value.evidenceRelated)) },
            { name: 'Case Activity', min: 0, max:  Math.max(data?.teamMemberContribution.teamMemberContributionOverview.map((entry: any) => entry.value.caseRelated)) },
          ]
        },
        series: [
          {
            name: 'Budget vs spending',
            type: 'radar',
            data: data?.teamMemberContribution.teamMemberContributionOverview.map((entry: any) => 
                ({
                    value: [entry.value.noteRelated, entry.value.tagRelated, entry.value.evidenceRelated, entry.value.caseRelated],
                    name: entry.key
                }))
          },
        ]
      };

      const tagColumns = [
        // {
        //     title: 'No',
        //     dataIndex: 'no',
        //     key: 'no'
        // },
        {
            title: 'Evidence',
            dataIndex: 'evidence',
            key: 'evidence'
        },
        {
            title: 'Added At',
            dataIndex: 'addedAt',
            key: 'addedAt',
            width: 120,
            render: (value: string) => <Text>{new Date(value).toLocaleString('en-GB', { timeZone: 'Asia/Jakarta' })}</Text>
        },
        {
            title: 'Added by',
            dataIndex: 'addedBy',
            key: 'addedBy',
            width: 100
        }
      ]

      const activityColumns = [
        // {
        //     title: 'No',
        //     dataIndex: 'no',
        //     key: 'no'
        // },
        {
            title: 'Timestamp',
            dataIndex: 'timestamp',
            key: 'timestamp',
            render: (value: string) => <Text>{new Date(value).toLocaleString('en-GB', { timeZone: 'Asia/Jakarta' })}</Text>
        },
        {
            title: 'Activity',
            dataIndex: 'activity',
            key: 'activity'
        },
        {
            title: 'Action By',
            dataIndex: 'actionBy',
            key: 'actionBy'
        },
        {
            title: 'Additional Information',
            dataIndex: 'additionalInformation',
            key: 'additionalInformation'
        }
      ]

    return (
        <>
        <Row justify="space-between" style={{padding: '15px 0px'}}>
            <Col>
                <Space>
                    <Button icon={<ArrowLeftOutlined />} type="text" onClick={() => navigate('/analyzeCase')}></Button>
                    <Title level={4} style={{margin: 0}}>Case Report</Title>
                </Space>
            </Col>
            <Col>
                <Space>
                    <Button onClick={preview}>Preview</Button>
                    <Button type="primary" onClick={convertToPdf} style={{margin: 'auto'}}>Save as PDF</Button>
                </Space>
            </Col>
        </Row>
        <div style={{background: 'white', padding: '20px', width: '7.5in', margin: 'auto'}}>
        <ConfigProvider theme={{algorithm: theme.defaultAlgorithm}}>
        <div ref={contentRef} style={{width: '100%'}}>
        <Space direction="vertical" style={{height: '10in', alignItems: 'center', width: '100%', justifyContent: 'center', breakAfter: 'always'}}>
            <img src={logo} height="100px" />
            <Title level={2}>CASE MANAGEMENT REPORT</Title>
            <Title level={2} style={{marginTop: 0, marginBottom: '20px'}}>{data?.title}</Title>
            <Row style={{width: '5in'}}>
                <Col span={8}>
                    <Text>Date opened</Text>
                </Col>
                <Col span={16}>
                    <Text>: {createdAt}</Text>
                </Col>
            </Row>
            <Row style={{width: '5in'}}>
                <Col span={8}>
                    <Text>Creator</Text>
                </Col>
                <Col>
                    <Text>: {data?.creator}</Text>
                </Col>
            </Row>
            <Row style={{width: '5in'}}>
                <Col span={8}>
                    <Text>Collaborators</Text>
                </Col>
                <Col>
                    <Text>: </Text>
                    <Space direction="vertical">
                        {data?.collaborators.map((collaborator: any) => <Text>- {collaborator}</Text>)}
                    </Space>
                </Col>
            </Row>
            <Row style={{width: '5in'}}>
                <Col span={8}>
                    <Text>Date closed</Text>
                </Col>
                <Col>
                    <Text>: {data?.caseStatus == "CLOSED" ? closedAt : '-'}</Text>
                </Col>
            </Row>
            <Row style={{width: '5in'}}>
                <Col span={8}>
                    <Text>Status</Text>
                </Col>
                <Col>
                    <Text>: {data?.caseStatus}</Text>
                </Col>
            </Row>
        </Space>
        <Space direction="vertical" style={{height: '10in', width: '100%', breakAfter: 'always', breakBefore: 'always', breakInside: 'avoid'}}>
            <Title level={3} style={{textAlign: 'center', marginBottom: '30px'}}>TABLE OF CONTENTS</Title>
            <Text>COVER</Text>
            <Text>TABLE OF CONTENTS</Text>
            <Text>OVERVIEW</Text>
            <Text>OBJECTIVE</Text>
            <Text>EXECUTIVE SUMMARY</Text>
            <Text>EVIDENCE SUMMARY</Text>
            <Text>TAG SUMMARY</Text>
            <Text>CASE ACTIVITY SUMMARY</Text>
            <Text>TEAM MEMBER CONTRIBUTION</Text>
            <Text>CONCLUSION</Text>
            <Text>APPENDIX</Text>
        </Space>
        <Space direction="vertical" style={{ width: '100%', breakAfter: 'always', breakBefore: 'always', breakInside: 'avoid'}}>
            <Title level={3} style={{textAlign: 'center', marginBottom: '30px'}}>OVERVIEW</Title>
            <Row style={{width: '5in'}}>
                <Col span={8}>
                    <Text>Case Title</Text>
                </Col>
                <Col span={16}>
                    <Text>: {data?.title}</Text>
                </Col>
            </Row>
            <Row style={{width: '5in'}}>
                <Col span={8}>
                    <Text>Date opened</Text>
                </Col>
                <Col span={16}>
                    <Text>: {createdAt}</Text>
                </Col>
            </Row>
            <Row style={{width: '5in'}}>
                <Col span={8}>
                    <Text>Date closed</Text>
                </Col>
                <Col span={16}>
                    <Text>: {closedAt}</Text>
                </Col>
            </Row>
            <Row style={{width: '5in'}}>
                <Col span={8}>
                    <Text>Duration of Investigation</Text>
                </Col>
                <Col>
                    <Text>: {data?.durationOfInvestigation ? data?.durationOfInvestigation : '-'}</Text>
                </Col>
            </Row>
            <Row style={{width: '5in'}}>
                <Col span={8}>
                    <Text>Tag</Text>
                </Col>
                <Col>
                    <Text>: {data?.tags.length ? data?.tags.map((tag) => <Tag>{tag}</Tag>) : '-'}</Text>
                </Col>
            </Row>
            <Row style={{width: '5in'}}>
                <Col span={8}>
                    <Text>Status</Text>
                </Col>
                <Col>
                    <Text>: {data?.caseStatus}</Text>
                </Col>
            </Row>
            <Title level={4} style={{textAlign: 'center'}}>Objective</Title>
            <Text>{data?.objective}</Text>
            <Title level={4} style={{textAlign: 'center'}}>Executive Summary</Title>
            <Text>{data?.executiveSummary}</Text>
            <Title level={4} style={{textAlign: 'center'}}>Team Member</Title>
            <Table bordered size="small" columns={teamMemberColumns} dataSource={data?.teamMember} pagination={false} />
            <Title level={4} style={{textAlign: 'center'}}>Person Base Filter</Title>
            <Table bordered size="small" columns={personListColumns} dataSource={data?.personBaseFilter} pagination={false} style={{width: '500px', margin: 'auto'}} />
            <Space direction="vertical" style={{width: '100%', pageBreakInside: 'avoid'}}>
                <Title level={4} style={{textAlign: 'center'}}>Attribute Base Filter</Title>
                <Table bordered size="small" columns={attributeColumns} dataSource={attributeFilterData} pagination={false} style={{width: '500px', margin: 'auto'}} />
            </Space>
            <Title level={4} style={{textAlign: 'center'}}>Evidence Summary</Title>
            <ReactEcharts className="avoidBreakInside" option={evidenceSummaryOption} style={{breakInside: 'avoid'}} />
            <Space direction="vertical" size="large" style={{width: '100%', pageBreakInside: 'auto',}}>
                {data?.evidenceSummary.evidences.map((evidence) => {
                    const detectedPersonOption = {
                        xAxis: {
                          type: 'value',
                          
                        },
                        yAxis: {
                          type: 'category',
                          data: evidence.top5DetectedPerson.map((person : any) => person.key)
                        },
                        grid: {
                            left: '20%'
                        },
                        series: [
                          {
                            data: evidence.top5DetectedPerson.map((person : any) => person.value),
                            type: 'bar',
                            label: {
                                show: true,
                                position: 'right'
                            }
                          },
                        ]
                      };
                    const detectedAttributeOption = {
                        xAxis: {
                          type: 'value',
                        },
                        yAxis: {
                          type: 'category',
                          data: evidence.top5DetectedAttribute.map((attribute : any) => attribute.key)
                        },
                        grid: {
                            left: '20%'
                        },
                        series: [
                          {
                            data: evidence.top5DetectedAttribute.map((attribute : any) => attribute.value),
                            type: 'bar',
                            label: {
                                show: true,
                                position: 'right'
                            }
                          }
                        ]
                      };
                      const detectionRateOption = {
                        xAxis: {
                          type: 'category',
                          data: evidence.detectionRateAccrossVideoDuration.map((entry: any) => entry.time)
                        //   [data?.evidenceSummary.evidences.detectionRateAccrossVideoDuration.map((entry) => entry.time )]
                        },
                        yAxis: {
                          type: 'value'
                        },
                        legend: {
                            data: ['Person', 'Attribute']
                        },
                        series: [
                          {
                            data: evidence.detectionRateAccrossVideoDuration.map((entry: any) => entry.person),
                            type: 'line',
                            name: 'Person'
                          },
                          {
                            data: evidence.detectionRateAccrossVideoDuration.map((entry: any) => entry.attribute),
                            type: 'line',
                            name: 'Attribute'
                          }
                        ]
                      };
                    return(
                    <Space direction="vertical" style={{width: '100%', breakInside: 'avoid'}}>
                        <Space direction="vertical" style={{width: '100%', pageBreakInside: 'avoid', pageBreakBefore: 'always'}}>
                            <Title level={5} style={{textAlign: 'center'}}>{evidence.name}</Title>
                            {/* <Row>
                                <Col span={4}>
                                    <Text>Name</Text>
                                </Col>
                                <Col>
                                    <Text>: {evidence.name}</Text>
                                </Col>
                            </Row> */}
                            <Row>
                                <Col span={4}>
                                    <Text>Source</Text>
                                </Col>
                                <Col>
                                    <Text>: {evidence.source}</Text>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={4}>
                                    <Text>Location</Text>
                                </Col>
                                <Col>
                                    <Text>: {evidence.location ? evidence.location : '-'}</Text>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={4}>
                                    <Text>Uploader</Text>
                                </Col>
                                <Col>
                                    <Text>: {evidence.uploader}</Text>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={4}>
                                    <Text>Date Uploaded</Text>
                                </Col>
                                <Col>
                                    <Text>: {new Date(evidence.dateUploaded).toLocaleDateString('en-GB', { timeZone: 'Asia/Jakarta' })}</Text>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={4}>
                                    <Text>Duration</Text>
                                </Col>
                                <Col>
                                    <Text>: {new Date(evidence.duration).toLocaleTimeString('en-GB', { timeZone: 'UTC' })}</Text>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={4}>
                                    <Text>Tag</Text>
                                </Col>
                                <Col>
                                    <Text>: {evidence.tags.length ?  evidence.tags.map((tag: string) => <Tag>{tag}</Tag>) : '-'}</Text>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={4}>
                                    <Text>Description</Text>
                                </Col>
                                <Col>
                                    <Text>: {evidence.description ? evidence.description : '-'}</Text>
                                </Col>
                            </Row>
                        </Space>
                        <Space direction="vertical" style={{pageBreakInside: 'avoid', width: '100%'}}>
                            <Title level={5}>Top 5 Detected Person</Title>
                            <ReactEcharts className="avoidBreakInside" option={detectedPersonOption} style={{breakInside: 'avoid'}} />
                        </Space>
                        <Space direction="vertical" style={{pageBreakInside: 'avoid', width: '100%'}}>
                            <Title level={5}>Top 5 Detected Attributes</Title>
                            <ReactEcharts className="avoidBreakInside" option={detectedAttributeOption} style={{breakInside: 'avoid'}} />
                        </Space>
                        <Space direction="vertical" style={{pageBreakInside: 'avoid', width: '100%'}}>
                            <Title level={5}>Detection Rate Accross Video Duration</Title>
                            <ReactEcharts className="avoidBreakInside" option={detectionRateOption} style={{breakInside: 'avoid'}} />
                        </Space>
                        <Space direction="vertical" style={{width: '100%', pageBreakInside: 'avoid'}}>
                            <Title level={5}>Notes</Title>
                            <Text>Total Evidence Notes: {evidence.notes.totalEvidenceNote}</Text>
                            <Text>Level 1: {evidence.notes.level1}</Text>
                            <Text>Level 2: {evidence.notes.level2}</Text>
                            <Text>Level 3: {evidence.notes.level3}</Text>
                            <Table bordered size="small" dataSource={evidence.notes.noteList} columns={columns} pagination={false} style={{pageBreakInside: 'auto', pageBreakBefore: 'auto'}} />
                        </Space>
                    </Space>
                    )}
                )}    
            </Space>
            <Space direction="vertical" style={{pageBreakInside: 'avoid', width: '100%', pageBreakBefore: 'always'}}>
            <Title level={4} style={{textAlign: 'center'}}>Tag Summary</Title>
            <Title level={5} style={{textAlign: 'center'}}>Top 5 Evidence Tag</Title>
            <ReactEcharts className="avoidBreakInside" option={evidenceTagOption} style={{breakInside: 'avoid'}} />
            </Space>
            {/* <Title level={5} style={{textAlign: 'center'}}>#suspect1</Title>
            <Table bordered columns={tagColumns} dataSource={tagData} pagination={{position: ["none", "none"]}} />
            <Title level={5} style={{textAlign: 'center'}}>#suspect2</Title>
            <Table bordered columns={tagColumns} dataSource={tagData} pagination={{position: ["none", "none"]}} /> */}
            {data?.tagSummary.evidenceTags.map((entry) => {
                return (
                    <Space direction="vertical" style={{pageBreakInside: 'avoid', width: '100%'}}>
                        <Title level={5} style={{textAlign: 'center'}}>#{entry.evidenceTag}</Title>
                        <Table bordered size="small" columns={tagColumns} dataSource={entry.data} pagination={false} />
                    </Space>
                )
            })}
            <Space direction="vertical" style={{width: '100%', pageBreakInside: 'avoid'}}>
            <Title level={4} style={{textAlign: 'center'}}>Case Activity Summary</Title>
            <Table bordered size="small" columns={activityColumns} dataSource={data?.caseActivitySummary} pagination={false} />
            </Space>
            <Space direction="vertical" style={{pageBreakInside: 'avoid', width: '100%'}}>
                <Title level={4} style={{textAlign: 'center'}}>Team Member Contribution</Title>
                <ReactEcharts className="avoidBreakInside" option={teamContributionOption} style={{breakInside: 'avoid'}} />
            </Space>
            <Space direction="vertical" style={{pageBreakInside: 'avoid', width: '100%'}}>
                <Title level={5} style={{textAlign: 'center'}}>Detail</Title>
                <ReactEcharts className="avoidBreakInside" option={memberContributionOption} style={{breakInside: 'avoid'}} />
            </Space>
            <Space direction="vertical" style={{width: '100%', pageBreakInside: 'avoid'}}>
            <Title level={4} style={{textAlign: 'center'}}>Conclusion</Title>
            <Text>{data?.conclusion}</Text>
            </Space>
            <Space direction="vertical" style={{width: '100%', pageBreakInside: 'avoid'}}>
            <Title level={4} style={{textAlign: 'center'}}>Appendix</Title>
            <Text>{data?.objective}</Text>
            </Space>
        </Space>
        </div>
        </ConfigProvider>
        </div>
        <Row justify="space-between">
            <Col>
            <Button onClick={() => navigate('/analyzeCase')}>Back</Button>
            </Col>
            <Col>
            {/* <Button type="primary" onClick={() => setOpenConclusionModal(true)}>Edit Conclusion</Button> */}
            <Button type="primary" onClick={convertToPdf} style={{margin: 'auto'}}>Save as PDF</Button>
            </Col>
        </Row>
        <Modal open={openConclusionModal} title="Edit Conclusion" onOk={() => setOpenConclusionModal(false)}>
            <Text>Conclusion</Text>
            {/* <Input ref={inputRef} onChange={setConclusion} /> */}
        </Modal>
        </>
    )
}

export default Report;