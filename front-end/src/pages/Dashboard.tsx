import React from 'react';
// import { useAppDispatch, useAppSelector } from '../store/hooks';
// import { incremented } from '../features/counter/counter-slice';
import { Typography, Input, Space, Row, Col, Card } from 'antd'
import { SearchOutlined } from '@ant-design/icons';

import LineChart from '../assets/line-simple.png'
import BarChart from '../assets/bar-simple.png'

const { Title, Text } = Typography

const Dashboard: React.FC = () => {
  // const count = useAppSelector((state) => state.counter.value);
  // const dispatch = useAppDispatch();
  // const handleClick = () => {
  //   dispatch(incremented())
  // }
  // const goToNX = () => {
  //   window.location.href = 'http://172.24.128.1:7001'
  // }
  // const goToVirtualCamera = () => {
  //   window.location.href = 'https://172.24.128.1:7001/#/view/b6fa5b4e-078a-3dca-4674-78e628018e23?time=1648499250033'
  // }

  return (
    <div>
        <Title level={4}>Dashboard</Title>
        {/* <button style={{color: 'white'}} onClick={handleClick}>
          count is {count}
        </button>
        <Button onClick={goToNX}>Go To NX</Button>
        <Button onClick={goToVirtualCamera}>Virtual Camera</Button> */}
        <Space direction="vertical" size={15} style={{width: '100%', marginTop: '10px'}}>
          <Input placeholder="Search" prefix={<SearchOutlined/>} />
          <Row gutter={15}>
            <Col span={12}>
              <Card>
                <Text strong>Chart</Text>
                <img src={LineChart} alt="LineChart" style={{width: '100%'}}/>
              </Card>
            </Col>
            <Col span={12}>
              <Card>
                <Text strong>Chart</Text>
                <img src={BarChart} alt="BarChart" style={{width: '100%'}}/>
              </Card>
            </Col>
          </Row>
        </Space>
    </div>
  );
}

export default Dashboard; 