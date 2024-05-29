import React from 'react'
import { Typography, List, Layout, Space } from 'antd'

const { Text } = Typography;

// const url = import.meta.env.VITE_API_URL

//   const notes = [
//     {
//         username: 'John Doe',
//         note: 'This is a note about evidence 1',
//         timestamp: '10/10/2023, 10:05:10'
//     },
//     {
//         username: 'John Doe',
//         note: 'This is a note about evidence 2',
//         timestamp: '10/10/2023, 10:05:10'
//     },
//     {
//         username: 'John Doe',
//         note: 'This is a note about evidence 3',
//         timestamp: '10/10/2023, 10:05:10'
//     },
//     {
//         username: 'John Doe',
//         note: 'This is a note about evidence 4',
//         timestamp: '10/10/2023, 10:05:10'
//     },
//     {
//         username: 'John Doe',
//         note: 'This is a note about evidence 5',
//         timestamp: '10/10/2023, 10:05:10'
//     },
//     {
//         username: 'John Doe',
//         note: 'This is a note about evidence 6',
//         timestamp: '10/10/2023, 10:05:10'
//     },
//     {
//         username: 'John Doe',
//         note: 'This is a note about evidence 7',
//         timestamp: '10/10/2023, 10:05:10'
//     },
//     {
//         username: 'John Doe',
//         note: 'This is a note about evidence 8',
//         timestamp: '10/10/2023, 10:05:10'
//     },
// ]

type NotesProps = {
    notes: any,
    seek: (time: number) => void
}

const Notes : React.FC<NotesProps> = ({notes, seek}) => {
    // const [notes, setNotes] = useState([])
    
    // useEffect(() => {
    //     fetch (url + '/api/Case/GetRelationCaseEvidenceNote', {
    //         method: 'GET'
    //     }).then((response) => {
    //         if (!response.ok) {
    //             throw new Error(`HTTP error! status: ${response.status}`);
    //         }
    //         else {
    //             setReloadNote(false)
    //             return response.json()
    //         }
    //     })
    //     .then((data) => {
    //         console.log(data)
    //         const transformedData = data.map((item) => {
    //             const startTimeHours = new Date(item.startTime).getHours();
    //             const startTimeMinutes = new Date(item.startTime).getMinutes();
    //             const startTimeSeconds = new Date(item.startTime).getSeconds();
                
    //             const endTimeHours = new Date(item.endTime).getHours();
    //             const endTimeMinutes = new Date(item.endTime).getMinutes();
    //             const endTimeSeconds = new Date(item.endTime).getSeconds();
    //             return {
    //                 ...item,
    //                 startTime: new Date(item.startTime).toLocaleTimeString(),
    //                 endTime: new Date(item.endTime).toLocaleTimeString(),
    //                 startTimeTimeStamps: startTimeHours * 3600 + startTimeMinutes * 60 + startTimeSeconds,
    //                 endTimeTimeStamps: endTimeHours * 3600 + endTimeMinutes * 60 + endTimeSeconds,
    //             }
    //         })
    //         const filteredData = transformedData.filter(item => item.relationCaseEvidenceId == currentId);
    //         setNotes(filteredData)
    //         console.log(transformedData)
    //         // setPeopleAttribute(data.peopleAttribute)
    //         // setFaceData(data.faceData)
    //         // setAttributePhotos(data.attributePhotos)
    //         // console.log(data.attributePhotos)
    //     })
    //     .catch((error) => {
    //         console.error('There was a problem with the fetch operation:', error);
    //     });
    // }, [currentId, reloadNote])

    return (
        <Layout style={{overflowY: 'auto', background: 'none'}}>
            {/* // <Space direction="vertical" style={{overflowY: 'auto', height: '100%'}}> */}
                <List
                size="small"
                dataSource={notes}
                renderItem={(item: any) => <List.Item>
                    {/* <Text>{item.startTime} {`- ${item.endTime}`}</Text> */}
                    <Space>
                        <Text><Text className="link" onClick={() => seek(item.startTimeTimeStamp)}>{item.startTime} </Text>
                        - <Text className="link" onClick={() => seek(item.endTimeTimeStamp)}>{item.endTime}</Text></Text>
                    </Space>
                    <Space.Compact direction="vertical">
                        {/* <Text strong>{currentId}</Text> */}
                        <Text>{item.notes}</Text>
                        {/* {currentId} */}
                    </Space.Compact>
                </List.Item>}
            />
            {/* // </Space> */}
        </Layout>
    )
}

export default Notes;