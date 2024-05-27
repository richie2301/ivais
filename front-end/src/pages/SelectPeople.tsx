import React from 'react';
import { useNavigate } from 'react-router-dom'
import { Typography, Button, Input, Space, Checkbox, Row, Col, Layout } from 'antd';

const { Title } = Typography;
const { Footer } = Layout;

const image = "https://www.w3schools.com/w3images/lights.jpg";

const images : any[] = [];
for (let i = 0; i < 10; i++){
    images.push(image);
}

const SelectPeople : React.FC = () => {
    const navigate = useNavigate()

    return (
        <>
          <Layout style={{height: '100%', background: 'none'}}>
            <Space direction="vertical">
              <Title level={4}>Select People</Title>
              <Input placeholder="Search" />
            </Space>
            <Layout style={{background: 'none', margin: '20px 0', overflowY: 'auto', overflowX: 'hidden'}}>
              <Row gutter={[10, 10]}>
                  {images.map((image, index) => (
                      <Col key={index}>
                          <Checkbox style={{position: 'absolute', top: '5px', marginLeft: '5px'}} />
                          <img src={image} alt="evidence" style={{width: '200px'}} />
                      </Col>
                  ))}
              </Row>
            </Layout>
            <Footer style={{padding: '0', background: 'none'}}>
              <Row justify="space-between">
                <Col>
                  <Button onClick={() => navigate('/selectEvidence')}>Back</Button>
                </Col>
                <Col>
                  <Button type="primary" onClick={() => navigate('/selectAttribute')}>Next</Button>
                </Col>
              </Row>
            </Footer>
					</Layout>
        </>
    );
    }

export default SelectPeople;