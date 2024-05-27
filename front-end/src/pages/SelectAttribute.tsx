import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { Typography, Button, Input, Space, Checkbox, Row, Col, Layout, Modal } from 'antd';

const { Title, Text } = Typography;
const { Footer } = Layout;

const image = "https://www.w3schools.com/w3images/lights.jpg";

const images : any[] = [];
for (let i = 0; i < 10; i++){
    images.push(image);
}

const SelectPeople : React.FC = () => {
    const navigate = useNavigate()

    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
      setIsModalOpen(true);
    };
  
    const handleOk = () => {
      setIsModalOpen(false);
    };
  
    const handleCancel = () => {
      setIsModalOpen(false);
    };

    return (
        <>
          <Layout style={{height: '100%', background: 'none'}}>
            <Space direction="vertical">
              <Title level={4}>Select People & Attribute</Title>
              <Input placeholder="Search" />
              <Space>
                <Button type="primary" onClick={showModal}>Select Attributes</Button>
                <Text>Selected Attributes: Red, Blue, Hat</Text>
              </Space>
            </Space>
            <Layout style={{background: 'none', padding: '20px 0'}}>
              <Space direction="vertical" style={{width: '100%'}}>
             
                  
                  <Row gutter={[10, 10]}>
                      {images.map((image, index) => (
                          <Col key={index}>
                              {/* <Checkbox style={{position: 'absolute', top: '5px', marginLeft: '5px'}} /> */}
                              <img src={image} alt="evidence" style={{width: '200px'}} />
                          </Col>
                      ))}
                  </Row>
              </Space>
            </Layout>
            <Footer style={{padding: '0', background: 'none'}}>
              <Row justify="space-between">
                <Col>
                  <Button onClick={() => navigate('/selectEvidence')}>Back</Button>
                </Col>
                <Col>
                  <Button type="primary" onClick={() => navigate('/analyzeCase')}>Next</Button>
                </Col>
              </Row>
            </Footer>
          </Layout>
          <Modal title="Select Attributes" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
            <Space direction="vertical">
              <Text>Accessories</Text>
              <Checkbox>Hat</Checkbox>
              <Checkbox>Mask</Checkbox>
              <Checkbox>Bag</Checkbox>
              <Text>Clothes Color</Text>
              <Checkbox>Red</Checkbox>
              <Checkbox>Blue</Checkbox>
              <Checkbox>Green</Checkbox>
              <Checkbox>Yellow</Checkbox>
              <Checkbox>Black</Checkbox>
              <Checkbox>White</Checkbox>
              <Checkbox>Grey</Checkbox>
              <Checkbox>Orange</Checkbox>
            </Space>
          </Modal>
        </>
    );
    }

export default SelectPeople;