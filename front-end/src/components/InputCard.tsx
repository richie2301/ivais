import React from 'react';
import { Typography, Space, Card, Button } from 'antd';
// import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;
// const { Search } = Input;

const InputCard: React.FC = () => {
    return (
      <div>
        
        <Card style={{width: '100%'}}>
            <Space direction="vertical">
                <Title level={4}>Input 1</Title>
                <Text>Type: Camera</Text>
                <Text>http://abc.def</Text>
                <Button type="primary">Connect</Button>
            </Space>
        </Card>
      </div>
    );
}

export default InputCard;