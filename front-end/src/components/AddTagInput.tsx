import React, { useState } from 'react'
import { Typography, Space, Input, Button } from 'antd';
import useUserStore from '../store/userStore';
import { UserStoreState, caseCreationStoreType } from '../type/storeTypes';
import useCaseCreationStore from '../store/caseCreationStore'

const { Text } = Typography;

type AddTagInputProps = {
    evidenceId: string,
    success: (message: string) => void;
}

const AddTagInput : React.FC<AddTagInputProps> = ({evidenceId, success}) => {
    const url = import.meta.env.VITE_API_URL;
    const [openAddTagModal, setOpenAddTagModal] = useState(false)
    const [newTag, setNewTag] = useState<string>()
    const caseId = (useCaseCreationStore.getState() as caseCreationStoreType).caseId;
    // const [tags, setTags] = useState<any[]>([])
    const handleNewTag = (e: any) => {
      setNewTag(e.target.value)
    }
    const addNewTag = (evidenceId: string) => {
      fetch (url + '/api/Evidence/tag/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          creatorUserId: (useUserStore.getState() as UserStoreState).userID,
          tagName: newTag,
          evidenceId: evidenceId,
          caseId: caseId
        })
      })
      .then((response) => {
        if (response.ok) {
            setNewTag(undefined)
            setOpenAddTagModal(false)
            success("Successfully added tag!")
            // setReloadTagList(true)
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
        <Space>
            {openAddTagModal && 
            <>
            <Input placeholder="Enter tag name" value={newTag} onChange={handleNewTag} /><Button onClick={() => addNewTag(evidenceId)}>Add</Button>
            </>}
            <Button onClick={() => setOpenAddTagModal(!openAddTagModal)}>
            {!openAddTagModal && <Text>Add Tag</Text>}
            {openAddTagModal && <Text>Cancel</Text>}
            </Button>
        </Space>
    )
}

export default AddTagInput;