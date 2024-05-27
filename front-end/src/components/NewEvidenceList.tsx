import React from 'react';
import { List, Layout, Typography, theme, Button, Space } from 'antd';

const { Text } = Typography;

// const data = [
//   {
//     title: 'Evidence 1',
//   },
//   {
//     title: 'Evidence 2',
//   },
//   {
//     title: 'Evidence 3',
//   },
//   {
//     title: 'Evidence 4',
//   },
// ];

type EvidenceListProps = {
  data: any[],
  currentEvidenceId: string | undefined,
  setCurrentEvidenceId: (id: string) => void;
  setCurrentId: (id: string) => void;
  updateStatus: (relationId: string, status: string) => void;
}

const EvidenceList: React.FC<EvidenceListProps> = ({data, currentEvidenceId, setCurrentEvidenceId, setCurrentId, updateStatus}) => {


  const { token } = theme.useToken();
  const handleClick = (item: any) => {
    setCurrentEvidenceId(item.evidenceId)
    setCurrentId(item.id)
  }

  return (
  
  <Layout  style={{maxHeight: '150px', overflowY: 'auto', background: 'none'}}>
    <List
    itemLayout="horizontal"
    dataSource={data}
    renderItem={(item) => (
      <List.Item
      className="cursor"
      // extra={<Switch checked={item.status == "LINKED" ? true : false} onClick={() => updateStatus(item.relationId, item.status)} />} 
      extra={
        <Space>
          <Button onClick={() => updateStatus(item.evidenceId, "LINK")}>Link</Button>
          <Button onClick={() => updateStatus(item.evidenceId, "UNLINK")}>Unlink</Button>
        </Space>
      }
      style={currentEvidenceId == item.evidenceId ? {backgroundColor: token.colorBgTextActive} : {background: 'none'}}  
      onClick={() => handleClick(item)}>
        <List.Item.Meta style={{padding: '0 10px'}}
          // avatar={<img
          //   width={120}
          //   alt="logo"
          //   src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
          // />}
          title={<Text><Text style={{color: '#1668dc'}}>[NEW]</Text> {item.evidenceName}</Text>}
          // description={
          //   <Space direction="vertical">
          //     <Text>Evidence description...</Text>
          //     <Text>John Doe - 10/10/2023</Text>
          //   </Space>
          // }
        />
      </List.Item>
    )}
  />
  </Layout>
);
    }

export default EvidenceList;