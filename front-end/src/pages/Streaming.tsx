import React from 'react';
import { Typography, Layout, Col, Row } from 'antd';

import ReactPlayer from 'react-player'

const { Title } = Typography;

// const url = import.meta.env.VITE_API_URL;

// interface UserStoreState {
//   userID: string;
//   // define other properties here
// }

const Streaming: React.FC = () => {
    
      
    return (
      <>
        <Layout style={{height: '100%', background: 'none'}}>
        <Title level={4}>Streaming</Title>
        <Row gutter={[10,10]} style={{height: '100%', width: '100%'}}>
          <Col span={8} style={{width: '100%', height: '250px'}}>
            <ReactPlayer
              url="https://www.youtube.com/embed/pWQF-ETjzx8?si=sJdvLKDFkenh9tEU"
              controls={true}
              width={'100%'}
              height={'100%'}
            />
          </Col>
          <Col span={8} style={{width: '100%'}}>
            <ReactPlayer
              url="https://www.youtube.com/embed/pWQF-ETjzx8?si=sJdvLKDFkenh9tEU"
              controls={true}
              width={'100%'}
              height={'100%'}
            />
          </Col>
          <Col span={8} style={{width: '100%'}}>
            <ReactPlayer
              url="https://www.youtube.com/embed/pWQF-ETjzx8?si=sJdvLKDFkenh9tEU"
              controls={true}
              width={'100%'}
              height={'100%'}
            />
          </Col>
          <Col span={8} style={{width: '100%', height: '250px'}}>
            <ReactPlayer
              url="https://www.youtube.com/embed/pWQF-ETjzx8?si=sJdvLKDFkenh9tEU"
              controls={true}
              width={'100%'}
              height={'100%'}
            />
          </Col>
          <Col span={8} style={{width: '100%'}}>
            <ReactPlayer
              url="https://www.youtube.com/embed/pWQF-ETjzx8?si=sJdvLKDFkenh9tEU"
              controls={true}
              width={'100%'}
              height={'100%'}
            />
          </Col>
          <Col span={8} style={{width: '100%'}}>
            <ReactPlayer
              url="https://www.youtube.com/embed/pWQF-ETjzx8?si=sJdvLKDFkenh9tEU"
              controls={true}
              width={'100%'}
              height={'100%'}
            />
          </Col>
        </Row>
        </Layout>
      </>
    );
}

export default Streaming;