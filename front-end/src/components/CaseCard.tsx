import React, { useState } from 'react';
import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { Card, Typography, Checkbox, Modal, Input, Space, Drawer } from 'antd';
import { useNavigate } from 'react-router-dom';

// import type { EvidenceType } from '../pages/Evidence';
// import MissionDetailsDrawer from './MissionDetailsDrawer';

// const { Meta } = Card;
const { Paragraph } = Typography;
const { Text } = Typography;

type CaseCardProps = {
    caseData: {
        id: number;
        caseId: number;
        caseName: string;
        caseDescription: string;
        caseImage: string;
        team: string;
        teamProfile: string;
        date: string;
        totalVideos: number;
        checked: boolean;
    },
    clickCheckbox: (id: number) => void;
    showCheckbox: boolean;
    success: (message: string) => void;
    record: any;
    // checked: boolean;
}

const CaseCard: React.FC<CaseCardProps> = ({caseData, clickCheckbox, showCheckbox, success, record}) => { 
  
  // const [checked, setChecked] = useState(false);

  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const navigate = useNavigate();

  // useEffect(() => {
  //   setChecked(caseData.checked);
  // }, [caseData.checked])

  const handleClick = () => {
    // setChecked(!checked);
    clickCheckbox(caseData.id);
  }

  const viewCase = () => {
    // navigate(`/caseDetails/${caseData.caseId}`)
    navigate('/evidence')
    // setOpenDrawer();
  }

  const editCase = () => {
    // navigate(`/createCase/${caseData.caseId}`)
    setShowEditModal(true);
  }

  const handleEditOk = () => {
    setShowEditModal(false);
    success("Successfully edited case!")
  };

  const handleEditCancel = () => {
    setShowEditModal(false);
  };

  const deleteCase = () => {
    setShowDeleteModal(true);
  }

  const handleDeleteOk = () => {
    setShowDeleteModal(false);
    success("Successfully deleted case!")
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
  };

  const [open, setOpen] = useState(false);
    // const [videoFootageId, setVideoFootageId] = useState<string>('');
    // const [evidenceData, setEvidenceData] = useState<EvidenceType>({} as EvidenceType);
    // const [playing, setPlaying] = useState(false);
    // const playing = open;

    // const navigate = useNavigate();

    const onClose = () => {
        setOpen(false);
        console.log(record.key)
        // setPlaying(false);
    };

    // const setOpenDrawer = () => {
    //     setOpen(true);
    //     setEvidenceData(record);
    //     setVideoFootageId(record.key);
    //     console.log(record.key)
    // }

  return(
  <>
    <Card
      style={{ width: '100%' }}
      hoverable
      cover={
        <>
          <img
          className="gradientImage"
          alt="example"
          src={caseData.caseImage ? caseData.caseImage : "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Placeholder_view_vector.svg/310px-Placeholder_view_vector.svg.png"}
          style={{width: '100%', height: '210px', objectFit: 'cover'}}
          />
          {/* <div style={{width: '100.8%', position: 'absolute', top:0, padding: '100px 20px 0 20px', backgroundImage: 'linear-gradient(to bottom, rgba(255,0,0,0), rgba(255,255,255,1))'}}> */}
          <div style={{width: '100%', position: 'absolute', top:0, padding: '100px 20px 0 20px'}}>
            <Typography.Title level={4}>{caseData.caseName}</Typography.Title>
            <Paragraph
              ellipsis={{
                rows: 2,
                expandable: false,
                symbol: 'more',
                onExpand: () => console.log('Expand'),
                onEllipsis: () => console.log('Ellipsis'),
              }}
            >
              {caseData.caseDescription}
            </Paragraph>
          </div>
        </>
        }
      actions={[
        <EyeOutlined key="view" onClick={viewCase} />,
        <EditOutlined key="edit" onClick={editCase} />,
        <DeleteOutlined key="delete" onClick={deleteCase} />,
      ]}
    >
      {showCheckbox && <Checkbox onClick={handleClick} checked={caseData.checked} style={{position: 'absolute', top: 5, left: 8}} />}
      {/* <div style={{position: 'relative', bottom: '20px'}}>
        <h2>Case Name</h2>
      </div> */}
      {/* <Button shape="circle" style={{ position: 'absolute', top: 5, right: 5}}><EllipsisOutlined /></Button> */}
      {/* <Meta
        // avatar={<Avatar src="https://xsgames.co/randomusers/avatar.php?g=pixel" />}
        // title={caseData.team}
        description={caseData.date + " • " + caseData.totalVideos + " videos"}
      /> */}
    </Card>
    <Modal centered title="Edit Case" open={showEditModal} onOk={handleEditOk} onCancel={handleEditCancel}>
      <Space direction="vertical" style={{width: '100%', padding: '15px 0'}}>
        <Text>Case Name</Text>
        <Input placeholder="Enter case name" value={caseData.caseName} />
        {/* <Text>Team</Text>
        <Select
            defaultValue={caseData.team}
            placeholder="Select team"
            style={{ width: '100%' }}
            options={[
                { value: 'a', label: 'Team A' },
                { value: 'b', label: 'Team B' },
                { value: 'c', label: 'Team C' },
            ]}
        /> */}
        <Text>Case Description</Text>
        <Input placeholder="Enter case description" value={caseData.caseDescription} />
      </Space>
    </Modal>
    <Modal centered title="Delete Case" open={showDeleteModal} onOk={handleDeleteOk} onCancel={handleDeleteCancel}>
      <Space direction="vertical" style={{width: '100%', padding: '15px 0'}}>
        <Text>Delete {caseData.caseName}?</Text>
        {/* <Text>Case Name</Text>
        <Input placeholder="Enter case name" value={caseData.caseName} />
        <Text>Team</Text>
        <Select
            defaultValue={caseData.team}
            placeholder="Select team"
            style={{ width: '100%' }}
            options={[
                { value: 'a', label: 'Team A' },
                { value: 'b', label: 'Team B' },
                { value: 'c', label: 'Team C' },
            ]}
        />
        <Text>Case Description</Text>
        <Input placeholder="Enter case description" value={caseData.caseDescription} /> */}
      </Space>
    </Modal>
    <Drawer
        title="Video Details"
        placement={'top'}
        closable={true}
        onClose={onClose}
        open={open}
        key={'top'}
        size="large"
        push={false}
    >
        {/* <MissionDetailsDrawer videoFootageId={videoFootageId} playing={playing} evidenceData={record} /> */}
        {/* <Text>{record.key}</Text> */}
        {/* {evidenceData.evidenceId} */}
    </Drawer>
  </>
)}

export default CaseCard;