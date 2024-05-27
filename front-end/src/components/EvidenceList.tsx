import React from 'react';
import { List, Layout, Typography, theme, Switch, Space, Tag, Button } from 'antd';
import useUserStore from '../store/userStore';
import { UserStoreState, caseCreationStoreType } from '../type/storeTypes';
import useCaseCreationStore from '../store/caseCreationStore'

import AddTagInput from '../components/AddTagInput'

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
  success: (message: string) => void;
}

const EvidenceList: React.FC<EvidenceListProps> = ({data, currentEvidenceId, setCurrentEvidenceId, setCurrentId, updateStatus, success}) => {
  const url = import.meta.env.VITE_API_URL
  const caseId = (useCaseCreationStore.getState() as caseCreationStoreType).caseId;
  const { token } = theme.useToken();
  const handleClick = (item: any) => {
    setCurrentEvidenceId(item.evidenceId)
    setCurrentId(item.id)
  }
  const handleSwitch = (evidenceId: string, status: string) => {
    let newStatus : string = ''

    if (status == "LINKED") {
      newStatus = "UNLINKED"
    } else {
      newStatus = "LINKED"
    }

    updateStatus(evidenceId, newStatus)
  }

  const handleCloseTag = (tagId: string, evidenceId: string) => {
    fetch(url + '/api/Evidence/tag/delete', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        creatorUserId: (useUserStore.getState() as UserStoreState).userID,
        tagId: tagId,
        evidenceId: evidenceId,
        caseId: caseId
      })
    })
    .then((response) => {
      if (response.ok) {
          success("Successfully deleted tag!")
          return response.json();
      }
      else {
          throw new Error("Something went wrong");
      }
    })
    .then((data) => {
      console.log(data);
    })
    .catch((error) => {
      console.log(error);
    })
  }

  return (
  
  <Layout style={{height: '200px', overflowY: 'auto', background: 'none'}}>
    <List
    itemLayout="horizontal"
    dataSource={data}
    renderItem={(item) => (
      <List.Item
      // className="cursor"
      extra={
        <Space>
          <Button type="primary" onClick={() => handleClick(item)}>Select</Button>
          <Switch checked={item.status == "LINKED" ? true : false} onClick={() => handleSwitch(item.evidenceId, item.status)} />
        </Space>
      } 
      style={currentEvidenceId == item.evidenceId ? {backgroundColor: token.colorBgTextActive} : {background: 'none'}}  
      // onClick={() => handleClick(item)}
      >
        <List.Item.Meta style={{padding: '0 10px'}}
          // avatar={<img
          //   width={120}
          //   alt="logo"
          //   src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
          // />}
          title={<Text>{item.evidenceName}</Text>}
          description={
            <Space>
              <Space.Compact>
              {item.tags.map((tag: any) => <Tag closable={true} onClose={() => handleCloseTag(tag.tagId, item.evidenceId)}>{tag.tagName}</Tag>)}
              </Space.Compact>
              <AddTagInput evidenceId={item.evidenceId} success={success} />
            </Space>
          }
        />
      </List.Item>
    )}
  />
  </Layout>
);
    }

export default EvidenceList;