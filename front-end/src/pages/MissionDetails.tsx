import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Col, Row, Typography, Divider, Input, Button, Drawer, Space, Tag } from "antd";
import { EyeOutlined } from '@ant-design/icons';
// import type { DrawerProps, RadioChangeEvent } from 'antd';
import Map from "../components/Map";
import EditableCells from "../components/EditableCells";

const { Title, Text } = Typography

const MissionDetails: React.FC = () => {
  const [latitude, setLatitude] = useState(0)
  const [longitude, setLongitude] = useState(0)

  const [open, setOpen] = useState(false);

  const navigate = useNavigate();

  const onClose = () => {
    setOpen(false);
  };

  const setOpenDrawer = () => {
    setOpen(true);
  }

  const fullscreen = () => {
    // setOpen(true);
    navigate('/mapView')
  }

  const contributors = ['John Doe', 'Jane Doe', 'John Smith', 'Jane Smith']
  const detectedPeople = ['Adam', 'Bob', 'Charlie', 'David', 'Eve', 'Frank', 'George', 'Harry', 'Iris', 'John', 'Kevin', 'Lily', 'Mary', 'Nancy', 'Olivia', 'Peter', 'Quinn', 'Robert', 'Sarah', 'Tom', 'Ursula', 'Victor', 'Wendy', 'Xavier', 'Yvonne', 'Zach']
  const tags = ['blue', 'hat', 'red', 'shirt', 'white', 'yellow']

    return (
      <>
        <Button onClick={() => navigate('/evidence')}>Back</Button>
        <Title level={3}>Mission 1</Title>
        <Text>John Doe • 10/01/2024</Text>
        <Divider />
        <Input name="latitude" value={latitude} style={{display: 'none'}} />
        <Input name="longitude" value={longitude} style={{display: 'none'}} />
        <Row gutter={20} style={{padding: '10px 0 50px 0'}}>
          <Col span={14}>
            <Map latitude={setLatitude} longitude={setLongitude} />
          </Col>
          <Col span={10}>
            <Divider style={{fontSize:'20px'}} orientation="left">General Information</Divider>
            <Space direction="vertical" style={{width: '100%'}}>
            {/* <Row>
              <Col span={8}>
                <Text strong>Mission Name</Text>
              </Col>
              <Col span={16}>
                <Text>Mission 1</Text>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <Text strong>Creator Name</Text>
              </Col>
              <Col span={16}>
                <Text>John Doe</Text>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <Text strong>Created At</Text>
              </Col>
              <Col span={16}>
                <Text>10/01/2024 10:00:00</Text>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <Text strong>Updated At</Text>
              </Col>
              <Col span={16}>
                <Text>12/01/2024 11:00:08</Text>
              </Col>
            </Row> */}
            <Row>
              <Col span={8}>
                <Text strong>Start Time</Text>
              </Col>
              <Col span={16}>
                <Text>12/01/2023 00:35:00</Text>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <Text strong>End Time</Text>
              </Col>
              <Col span={16}>
                <Text>12/02/2023 03:35:00</Text>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <Text strong>Contributors</Text>
              </Col>
              <Col span={16}>
                <Text>{contributors.join(', ')}</Text>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <Text strong>Detected People</Text>
              </Col>
              <Col span={16}>
                <Text>{detectedPeople.join(', ')}</Text>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <Text strong>Tags</Text>
              </Col>
              <Col span={16}>
                {tags.map((tag) => {
                  return (
                    <Tag key={tag}>
                      {tag.toUpperCase()}
                    </Tag>
                  );
                })}
              </Col>
            </Row>
            </Space>
            <Space style={{padding: '20px 0'}}>
            <Button type="primary" onClick={fullscreen} icon={<EyeOutlined />} >Advance View</Button>
            </Space>
          </Col>
        </Row>
        {/* <Table columns={columns} dataSource={data} /> */}
        <Space direction="vertical" style={{width: '100%', paddingTop: '50px'}}>
          <Divider style={{fontSize:'20px'}} orientation="left">Video Evidence</Divider>
          <EditableCells showDetails={setOpenDrawer} />
        </Space>
        <Space direction="vertical" style={{width: '100%'}}>
          <Divider style={{fontSize:'20px'}} orientation="left">Other Evidence</Divider>
          <EditableCells showDetails={setOpenDrawer} />
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
      >
        {/* <MissionDetailsDrawer /> */}
      </Drawer>
      </>
    );
  }
  
  export default MissionDetails;