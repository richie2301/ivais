import React from 'react';
import { List, Typography, Row, Col, Space } from 'antd';
import type { FaceDataType } from './MissionDetailsDrawer';

const { Text, Title } = Typography

type FaceListProps = {
    seek: (a : number) => void,
    faceData : FaceDataType[],
}

const App: React.FC<FaceListProps> = ({seek, faceData}) => {
    console.log(faceData)
    // const data = faceData.map((item) => {
    //     const startTime = item.startTime
    //     const attributes = []
    //     for (const [key, value] of Object.entries(item)) {
    //         if (key === 'startTime') {
    //             continue;
    //         }
    //         if (value != null && value < 0.5) {
    //             continue;
    //         }
    //         attributes.push(key)
    //     }
    //     return {
    //         title: new Date(startTime).toLocaleTimeString('en-GB', { timeZone: 'UTC' }),
    //         startTime: startTime,
    //         attributes: attributes,
    //     }
        
    // })
    return (
  <List
    itemLayout="horizontal"
    dataSource={faceData}
    renderItem={(item) => (
      <List.Item>
        {/* <List.Item.Meta
          avatar={<Avatar size={50} src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`} />}
          title={<a href="https://ant.design">{item.title}</a>}
        //   description="Ant Design, a design language for background applications, is refined by Ant UED Team"
        /> */}
        {/* <Space>
            <img src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`} width={70} />
            <Space direction="vertical">
                <Title level={5} style={{margin: 0}}>{item.title}</Title>
                <Button type="text" style={{color: '#1668dc', fontWeight: 'bold', padding: 0}} onClick={() => {seek(item.timestamp)}}>{new Date(item.timestamp*1000).toLocaleTimeString()}</Button>
            </Space>
        </Space> */}
        {/* <Row gutter={10}>
            <Col flex="none" span={6}>
                <Text onClick={() => seek(item.startTime/1000)} className="link">{new Date(item.startTime).toLocaleTimeString('en-GB', { timeZone: 'UTC' })}</Text>
            </Col>
            <Col flex="auto" span={18}>
                {Object.entries(item).map(([key, value]) => {
                    if (key === 'startTime') {
                    return null;  // Skip startTime
                    }
                    else if (value != null && value < 0.5) {
                    return null;  // Skip negative values
                    }

                    return (
                    // <Col key={key}>
                    //     <Text>{`${key}: ${value}`}</Text>
                    // </Col>
                    <Tag>{key}</Tag>
                    );
                })}
            </Col>
        </Row> */}
        <Row gutter={10} style={{width: '100%'}}>
            <Col flex="none">
                <img src={"data:image/png;base64," + item.picture} width={70} />
            </Col>
            <Col flex="auto">
                <Space direction="vertical" style={{width: '100%'}}>
                  <Title level={5} style={{margin: 0}}>{item.name}</Title>
                  <Text onClick={() => seek(item.time/1000)} className="link">{new Date(item.time).toLocaleTimeString('en-GB', { timeZone: 'UTC' })}</Text>
                </Space>
            </Col>
        </Row>
      </List.Item>
    )}
  />
);}

export default App;