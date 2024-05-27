import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Typography, Row, Col, Table, Tag, Input, Select } from "antd";
// import { PlusOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { TableRowSelection } from 'antd/es/table/interface';
import type { SelectProps } from 'antd';

const { Title } = Typography

interface DataType {
    key: React.ReactNode;
    name: string;
    date: number;
    location: string;
    tags: string;
    children?: DataType[];
  }

  const columns: ColumnsType<DataType> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      // width: '12%',
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
      // width: '12%',
    },
    {
      title: 'Tags',
      dataIndex: 'tags',
      // width: '30%',
      key: 'tags',
        render: (text: string) => (
            <>
            {text.split(',').map((tag: string) => {
                let color = tag.length > 5 ? 'geekblue' : 'green';
                if (tag === 'loser') {
                color = 'volcano';
                }
                return (
                <Tag color={color} key={tag}>
                    {tag.toUpperCase()}
                </Tag>
                );
            })}
            </>
        ),
    },
  ];

  const tags = ['blue', 'hat', 'mask']
  const tags2 = ['green', 'yellow', 'hat']
  
  const data: DataType[] = [
    {
      key: 1,
      name: 'Mission 1',
      date: 60,
      location: 'Jakarta',
      tags: tags.toString(),
      children: [
        // {
        //   key: 11,
        //   name: 'John Brown',
        //   date: 42,
        //   address: 'New York No. 2 Lake Park',
        // },
        {
          key: 12,
          name: 'Video Evidence',
          date: 30,
          location: 'Jakarta',
          tags: tags2.toString(),
          children: [
            {
              key: 121,
              name: 'Video 1',
              date: 16,
              location: 'Jakarta',
              tags: tags.toString(),
            },
          ],
        },
        {
          key: 13,
          name: 'Other Evidence',
          date: 72,
          location: 'Bandung',
          tags: tags.toString(),
          children: [
            {
              key: 131,
              name: 'Evidence A',
              date: 42,
              location: 'Bandung',
              tags: tags2.toString(),
              children: [
                {
                  key: 1311,
                  name: 'Evidence A1',
                  date: 25,
                  location: 'Bandung',
                  tags: tags.toString(),
                },
                {
                  key: 1312,
                  name: 'Evidence A2',
                  date: 18,
                  location: 'Bandung',
                  tags: tags2.toString(),
                },
              ],
            },
          ],
        },
      ],
    },
    {
      key: 2,
      name: 'Mission 2',
      date: 32,
      location: 'Bandung',
      tags: tags2.toString(),
    },
  ];
  
  // rowSelection objects indicates the need for row selection
  const rowSelection: TableRowSelection<DataType> = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
    onSelect: (record, selected, selectedRows) => {
      console.log(record, selected, selectedRows);
    },
    onSelectAll: (selected, selectedRows, changeRows) => {
      console.log(selected, selectedRows, changeRows);
    },
  };

  const tagOptions : SelectProps['options'] = [
    { label: 'blue', value: 'blue' },
    { label: 'hat', value: 'hat' },
    { label: 'mask', value: 'mask' },
    { label: 'green', value: 'green' },
    { label: 'yellow', value: 'yellow' },
  ];
  

const Missions: React.FC = () => {
    // const [checkStrictly, setCheckStrictly] = useState(false);
    const navigate = useNavigate();

    const [missionInput, setMissionInput] = useState<string>('');
    // const [tagInput, setTagInput] = useState<string>('');
    const [tagInput, setTagInput] = useState<string[]>([]);

    // const filteredData = data.filter((item: any) => item.name.toLowerCase().includes(missionInput.toLowerCase()));

    //only data that match all tags will be returned
    const filteredData = data.filter((item: any) => 
      (
        item.name.toLowerCase().includes(missionInput.toLowerCase())
        || item.location.toLowerCase().includes(missionInput.toLowerCase()) 
        || (Array.isArray(item.children) && item.children.some((child: any) => child.name.toLowerCase().includes(missionInput.toLowerCase())))
        || (Array.isArray(item.children) && item.children.some((child: any) => Array.isArray(child.children) && child.children.some((grandchild: any) => grandchild.name.toLowerCase().includes(missionInput.toLowerCase()))))
        || (Array.isArray(item.children) && item.children.some((child: any) => child.location.toLowerCase().includes(missionInput.toLowerCase())))
      ) && 
      tagInput.every(tag => item.tags.toLowerCase().includes(tag.toLowerCase()))
    );

    //data that match any tags will be returned
    // const filteredData = data.filter((item: any) => 
    //     item.name.toLowerCase().includes(missionInput.toLowerCase()) && 
    //     tagInput.some(tag => item.tags.toLowerCase().includes(tag.toLowerCase()))
    // );
  const searchMission = (event: any): void => {
    setMissionInput(event.target.value)
  }

  const searchTag = (event: any): void => {
    setTagInput(event)
    console.log(tagInput)
  }

    return (
      <>
        <Row justify="space-between">
            <Col>
                <Title level={4}>Missions</Title>
            </Col>
            <Col>
                {/* <Space align="center" style={{height: '100%'}}>
                    <Button type="primary" icon={<PlusOutlined />}>Create Mission</Button>
                </Space> */}
            </Col>
        </Row>
        {/* <SearchFilter /> */}
        <Row gutter={10} style={{padding: '20px 0'}}>
            <Col span={8}>
                <Input placeholder="Search Mission" onChange={searchMission} />
            </Col>
            <Col span={16}>
                <Select placeholder="Search Tags" mode="multiple" options={tagOptions} style={{width: '100%'}} onChange={searchTag} />
            </Col>
        </Row>
        {/* <Space align="center" style={{ marginBottom: 16 }}>
        CheckStrictly: <Switch checked={checkStrictly} onChange={setCheckStrictly} />
      </Space> */}
      <Table
        columns={columns}
        rowSelection={{ ...rowSelection }}
        dataSource={filteredData}
        onRow={(record, index) => {
            return {
              onClick: () => {
                console.log(record, index)
                navigate('/missionDetails')
            }, // click row
            //   onDoubleClick: event => {}, // double click row
            //   onContextMenu: event => {}, // right button click row
            //   onMouseEnter: event => {}, // mouse enter row
            //   onMouseLeave: event => {}, // mouse leave row
            };
        }}
      />
      </>
    );
  }
  
  export default Missions;