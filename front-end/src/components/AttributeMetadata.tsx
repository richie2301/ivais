import React from 'react'
import { Typography, List, Layout, Space } from 'antd'

const { Text } = Typography;

  const metadata = [
    {
        photo: 'https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png',
        timestamp: '10:05:10',
        attributes: 
            {
                hat: '50%',
                bag: '70%',
                upperClothesBlack: '80%',
            }
    },
    {
        photo: 'https://images.unsplash.com/photo-1554080353-a576cf803bda?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cGhvdG98ZW58MHx8MHx8fDA%3D',
        timestamp: '10:05:12',
        attributes: 
            {
                hat: '50%',
                bag: '70%',
                upperClothesBlack: '80%',
            }
    },
    {
        photo: 'https://images.unsplash.com/photo-1566275529824-cca6d008f3da?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        timestamp: '10:05:14',
        attributes: 
            {
                hat: '50%',
                bag: '70%',
                upperClothesBlack: '80%',
            }
    },
]

function camelCaseToWords(str : string) {
    return str.replace(/([A-Z])/g, ' $1').toLowerCase();
}

function capitalizeFirstChar(str : string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function formatWords(str : string) {
    return capitalizeFirstChar(camelCaseToWords(str));
}

const ActivityLog : React.FC = () => {
    return (
        <Layout style={{height: '150px', overflowY: 'auto', background: 'none'}}>
            {/* // <Space direction="vertical" style={{overflowY: 'auto', height: '100%'}}> */}
                <List
                size="small"
                dataSource={metadata}
                renderItem={(item) => <List.Item>
                    <List.Item.Meta
                        avatar={
                        <>
                            <Space.Compact direction="vertical">
                                <img
                                width={100}
                                alt="logo"
                                src={item.photo}
                                />
                                <Text>{item.timestamp}</Text>
                            </Space.Compact>
                        </>
                        }
                        description={
                            <Space.Compact direction="vertical">
                                {Object.entries(item.attributes).map(([key, value]) => {
                                    return (
                                        // <Text>{`${key}: ${value}`}</Text>
                                        <Text>{`${formatWords(key)}: ${value}`}</Text>
                                    );
                                })}
                            </Space.Compact>
                        }
                    />
                </List.Item>}
            />
            {/* // </Space> */}
        </Layout>
    )
}

export default ActivityLog;