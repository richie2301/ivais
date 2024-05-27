import React from 'react';
import { Typography, Space, Input, Row, Col, Button } from 'antd';

import InputCard from '../components/InputCard';

const { Title } = Typography;
const { Search } = Input;

const Streaming: React.FC = () => {
  return (
    <div>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Row>
            <Col span={12}>
                <Title level={3}>Select Input</Title>
            </Col>
            <Col span={12}>
                <Button type="primary" style={{float: 'right'}}>Add Input</Button>
            </Col>
        </Row>
        <Search placeholder="Search" style={{ width: '100%' }}></Search>
        <Space direction="vertical" style={{ width: '100%' }}>
            <Row gutter={[10, 10]} style={{ width: '100%' }}>
                <Col span={8}>
                    <InputCard />
                </Col>
                <Col span={8}>
                    <InputCard />
                </Col>
                <Col span={8}>
                    <InputCard />
                </Col>
                <Col span={8}>
                    <InputCard />
                </Col>
                <Col span={8}>
                    <InputCard />
                </Col>
            </Row>
        </Space>
      </Space>
    </div>
  );
}

export default Streaming;