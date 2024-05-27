import React from "react";
import { Typography, Divider, Space, Row, Col } from "antd";

const { Title, Text } = Typography

const CaseReport: React.FC = () => {
    return (
      <>
        <div>
          <Title level={3}>Case Report</Title>
        </div>
        <Divider>Case Information</Divider>
        <Space direction="vertical" style={{width: '100%'}}>
          <Row>
            <Col style={{width:'120px'}}>
              <Text strong>Creator</Text>
            </Col>
            <Col>
              <Text>John Doe</Text>
            </Col>
          </Row>
          <Row>
            <Col style={{width:'120px'}}>
              <Text strong>Case Name</Text>
            </Col>
            <Col>
              <Text>Case 1</Text>
            </Col>
          </Row>
          <Row>
            <Col style={{width:'120px'}}>
              <Text strong>Start Time</Text>
            </Col>
            <Col>
              <Text>2021-07-12 12:00:00</Text>
            </Col>
          </Row>
          <Row>
            <Col style={{width:'120px'}}>
              <Text strong>End Time</Text>
            </Col>
            <Col>
              <Text>2021-07-12 12:00:00</Text>
            </Col>
          </Row>
        </Space>
        
      </>
    );
  }
  
  export default CaseReport;