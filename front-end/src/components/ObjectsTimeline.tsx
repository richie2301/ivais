import React from 'react';
import { Row, Col, Space, Tabs, Typography, Divider, Progress } from 'antd';
import type { TabsProps } from 'antd';

const { Text } = Typography;

const timeline = [
    {
        time: '00:00:00',
        photos: [
            'https://img.freepik.com/free-photo/happy-asian-woman-making-funny-faces-front-view-trendy-japanese-young-woman-earrings_197531-14624.jpg?w=996&t=st=1697020522~exp=1697021122~hmac=377bbbaee83a98a591d2f79e57939743a3dfc9db84a3e2c5c371ecfa4d20de35', 
            'https://img.freepik.com/free-photo/portrait-young-woman-with-natural-make-up_23-2149084942.jpg?w=360&t=st=1697020531~exp=1697021131~hmac=ca523d16e0711e54bdf003dbf2ffe4be75f3f1fb515e31b86ea19a340a15d987', 
            'https://img.freepik.com/free-photo/handsome-young-man-with-new-stylish-haircut_176420-19637.jpg?w=996&t=st=1697020588~exp=1697021188~hmac=9c7b4b866391e1273f360110b784f677f9104340dbf7ad0cdd66aeb61da79ba3',
            'https://img.freepik.com/free-photo/happy-asian-woman-making-funny-faces-front-view-trendy-japanese-young-woman-earrings_197531-14624.jpg?w=996&t=st=1697020522~exp=1697021122~hmac=377bbbaee83a98a591d2f79e57939743a3dfc9db84a3e2c5c371ecfa4d20de35', 
            'https://img.freepik.com/free-photo/portrait-young-woman-with-natural-make-up_23-2149084942.jpg?w=360&t=st=1697020531~exp=1697021131~hmac=ca523d16e0711e54bdf003dbf2ffe4be75f3f1fb515e31b86ea19a340a15d987', 
            'https://img.freepik.com/free-photo/handsome-young-man-with-new-stylish-haircut_176420-19637.jpg?w=996&t=st=1697020588~exp=1697021188~hmac=9c7b4b866391e1273f360110b784f677f9104340dbf7ad0cdd66aeb61da79ba3',
            'https://img.freepik.com/free-photo/happy-asian-woman-making-funny-faces-front-view-trendy-japanese-young-woman-earrings_197531-14624.jpg?w=996&t=st=1697020522~exp=1697021122~hmac=377bbbaee83a98a591d2f79e57939743a3dfc9db84a3e2c5c371ecfa4d20de35', 
            'https://img.freepik.com/free-photo/portrait-young-woman-with-natural-make-up_23-2149084942.jpg?w=360&t=st=1697020531~exp=1697021131~hmac=ca523d16e0711e54bdf003dbf2ffe4be75f3f1fb515e31b86ea19a340a15d987', 
            'https://img.freepik.com/free-photo/handsome-young-man-with-new-stylish-haircut_176420-19637.jpg?w=996&t=st=1697020588~exp=1697021188~hmac=9c7b4b866391e1273f360110b784f677f9104340dbf7ad0cdd66aeb61da79ba3'
        ]
    },
    {
        time: '00:00:01',
        photos: [
            'https://img.freepik.com/free-photo/happy-asian-woman-making-funny-faces-front-view-trendy-japanese-young-woman-earrings_197531-14624.jpg?w=996&t=st=1697020522~exp=1697021122~hmac=377bbbaee83a98a591d2f79e57939743a3dfc9db84a3e2c5c371ecfa4d20de35', 
            'https://img.freepik.com/free-photo/handsome-young-man-with-new-stylish-haircut_176420-19637.jpg?w=996&t=st=1697020588~exp=1697021188~hmac=9c7b4b866391e1273f360110b784f677f9104340dbf7ad0cdd66aeb61da79ba3', 
            'https://img.freepik.com/free-photo/confident-asian-woman-face-portrait-smiling_53876-144815.jpg?w=826&t=st=1697020553~exp=1697021153~hmac=53a0fc323f5cf4fc64413e6a2019ed5b0c7b9c5bcac0be7235615f695915b7a7',
            'data:image/jpeg;base64,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'
        ]
    },
    {
        time: '00:00:02',
        photos: [
            'https://img.freepik.com/free-photo/portrait-young-woman-with-natural-make-up_23-2149084942.jpg?w=360&t=st=1697020531~exp=1697021131~hmac=ca523d16e0711e54bdf003dbf2ffe4be75f3f1fb515e31b86ea19a340a15d987', 
            'https://img.freepik.com/free-photo/confident-asian-woman-face-portrait-smiling_53876-144815.jpg?w=826&t=st=1697020553~exp=1697021153~hmac=53a0fc323f5cf4fc64413e6a2019ed5b0c7b9c5bcac0be7235615f695915b7a7', 
            'https://img.freepik.com/free-photo/portrait-white-man-isolated_53876-40306.jpg?w=826&t=st=1697020760~exp=1697021360~hmac=958e7fe7357b9eb791c57b544b16be2857d89881e860778d1ffc6a02b85cd976'
        ]
    }
]

const tabItems: TabsProps['items'] = [
    {
      key: '1',
      label: 'Timeline',
      children: 
        <div style={{height: '150px', overflow: 'auto'}}>  
            {timeline.map((item) => (
                <Row style={{padding: '10px'}}>
                    <Col span={4}>
                        <Text>{item.time}</Text>
                    </Col>
                    <Col span={20}>
                        <Space style={{width: '100%', overflow: 'auto'}}>
                            {item.photos.map((photo) => (
                                <Space direction="vertical" align="center" style={{paddingBottom: '15px'}}>
                                    <img src={photo} height={60} />
                                    <Progress type="circle" size={30} percent={75} />
                                    <Text style={{fontSize: '12px'}}>Name</Text>
                                </Space>
                            ))}
                        </Space>
                    </Col>
                    <Divider />
                </Row>
            ))}
        </div>
      ,
    },
    {
      key: '2',
      label: 'Statistics',
      children: 
      <div style={{height: '150px', overflow: 'auto'}}>
        Some statistics here
      </div>
      ,
    },
  ];

const ObjectsTimeline: React.FC = () => {
    return (
      <>
        <div style={{paddingTop: '15px'}}>
            <Tabs defaultActiveKey="1" items={tabItems} type="card" />
        </div>
      </>
    );
  }
  
  export default ObjectsTimeline;