import React, { useState } from 'react'
import { Row, Col, Typography, Table } from 'antd'
import VideoPlayer from '../components/VideoPlayer'

const { Title } = Typography

const VideoData: React.FC = () => {
    const [inputValue, setInputValue] = useState(1);
    const onChangeInput = (newValue: number) => {
        setInputValue(newValue);
    };
    const dataSource = [
        {
          key: '1',
          timestamp: '2021-07-01 12:00:00',
          image: <img src="https://www.marineinsight.com/wp-content/uploads/2021/04/Black-sea-1.png" width="100px" height="100px" />,
          message: 'message',
        },
        {
          key: '2',
          timestamp: '2021-07-01 12:00:00',
          image: <img src="https://www.marineinsight.com/wp-content/uploads/2021/04/Black-sea-1.png" width="100px" height="100px" />,
          message: 'message',
        },
        {
            key: '3',
            timestamp: '2021-07-01 12:00:00',
            image: <img src="https://www.marineinsight.com/wp-content/uploads/2021/04/Black-sea-1.png" width="100px" height="100px" />,
            message: 'message',
            },
          {
            key: '4',
            timestamp: '2021-07-01 12:00:00',
            image: <img src="https://www.marineinsight.com/wp-content/uploads/2021/04/Black-sea-1.png" width="100px" height="100px" />,
            message: 'message',
          },
      ];
      
      const columns = [
        {
          title: 'Timestamp',
          dataIndex: 'timestamp',
          key: 'timestamp',
        },
        {
          title: 'Image',
          dataIndex: 'image',
          key: 'image',
        },
        {
          title: 'Message',
          dataIndex: 'message',
          key: 'message',
        },
      ];
    return (
      <div>
        
        <Row gutter={20}>
            <Col span={12}>
            <Title>Video ABC</Title>
            <VideoPlayer inputValue={inputValue} onChange={onChangeInput} />
            </Col>
            <Col span={12}>
            <Table dataSource={dataSource} columns={columns} pagination={false} style={{height: '500px', overflow: 'auto'}} />
            </Col>

        </Row>
      </div>
    );
  }
  
  export default VideoData;