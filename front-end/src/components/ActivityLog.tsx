import React from 'react'
import { Typography, List, Layout } from 'antd'

const { Text } = Typography;

//   const activities = [
//     {
//         username: 'John Doe',
//         activity: 'Uploaded evidence 1',
//         timestamp: '10/10/2023, 10:05:10'
//     },
//     {
//         username: 'John Doe',
//         activity: 'Uploaded evidence 2',
//         timestamp: '10/10/2023, 10:05:10'
//     },
//     {
//         username: 'John Doe',
//         activity: 'Uploaded evidence 3',
//         timestamp: '10/10/2023, 10:05:10'
//     },
//     {
//         username: 'John Doe',
//         activity: 'Uploaded evidence 4',
//         timestamp: '10/10/2023, 10:05:10'
//     },
//     {
//         username: 'John Doe',
//         activity: 'Uploaded evidence 5',
//         timestamp: '10/10/2023, 10:05:10'
//     },
//     {
//         username: 'John Doe',
//         activity: 'Uploaded evidence 6',
//         timestamp: '10/10/2023, 10:05:10'
//     },
//     {
//         username: 'John Doe',
//         activity: 'Uploaded evidence 7',
//         timestamp: '10/10/2023, 10:05:10'
//     },
//     {
//         username: 'John Doe',
//         activity: 'Uploaded evidence 8',
//         timestamp: '10/10/2023, 10:05:10'
//     },
//     {
//         username: 'John Doe',
//         activity: 'Uploaded evidence 9',
//         timestamp: '10/10/2023, 10:05:10'
//     },
//     {
//         username: 'John Doe',
//         activity: 'Uploaded evidence 10',
//         timestamp: '10/10/2023, 10:05:10'
//     },
//     ];

type ActivityLogProps = {
    activityLog: any;
}

const ActivityLog : React.FC<ActivityLogProps> = ({activityLog}) => {
    return (
        <Layout style={{overflowY: 'auto', background: 'none'}}>
            {/* // <Space direction="vertical" style={{overflowY: 'auto', height: '100%'}}> */}
                <List
                size="small"
                dataSource={activityLog}
                renderItem={(item: any) => <List.Item>
                    <Text>{new Date(item.createdAt).toLocaleString('en-GB', { timeZone: 'Asia/Jakarta' })}</Text>
                    <Text>{item.user} <Text strong>{item.activity}</Text></Text>
                </List.Item>}
            />
            {/* // </Space> */}
        </Layout>
    )
}

export default ActivityLog;