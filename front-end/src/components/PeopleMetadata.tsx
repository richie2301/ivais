import React from 'react'
import { Typography, List, Layout, Space } from 'antd'

const { Text } = Typography;

  const metadata = [
    {
        photo: 'https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png',
        name: 'John Doe',
        timestamp: '10/10/2023, 10:05:10'
    },
    {
        photo: 'https://images.unsplash.com/photo-1554080353-a576cf803bda?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cGhvdG98ZW58MHx8MHx8fDA%3D',
        name: 'Jane Doe',
        timestamp: '10/10/2023, 10:05:12'
    },
    {
        photo: 'https://images.unsplash.com/photo-1566275529824-cca6d008f3da?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        name: 'John Smith',
        timestamp: '10/10/2023, 10:05:14'
    },
    {
        photo: 'https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png',
        name: 'John Doe',
        timestamp: '10/10/2023, 10:05:10'
    },
    {
        photo: 'https://images.unsplash.com/photo-1554080353-a576cf803bda?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cGhvdG98ZW58MHx8MHx8fDA%3D',
        name: 'Jane Doe',
        timestamp: '10/10/2023, 10:05:12'
    },
    {
        photo: 'https://images.unsplash.com/photo-1566275529824-cca6d008f3da?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        name: 'John Smith',
        timestamp: '10/10/2023, 10:05:14'
    },
]

const ActivityLog : React.FC = () => {
    return (
        <Layout style={{height: '150px', overflowY: 'auto', background: 'none'}}>
            {/* // <Space direction="vertical" style={{overflowY: 'auto', height: '100%'}}> */}
                <List
                size="small"
                dataSource={metadata}
                renderItem={(item) => <List.Item>
                    <List.Item.Meta
                        avatar={<img
                            width={100}
                            alt="logo"
                            src={item.photo}
                        />}
                        title={<Text strong>{item.name}</Text>}
                        description={
                            <Space direction="vertical">
                                <Text>10/10/2023, 10:05:10</Text>
                            </Space>
                        }
                    />
                </List.Item>}
            />
            {/* // </Space> */}
        </Layout>
    )
}

export default ActivityLog;