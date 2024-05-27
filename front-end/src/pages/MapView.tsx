import React from "react";
import { useNavigate } from "react-router-dom";
import { Layout, Button, Space } from "antd";
import Map2 from "../components/Map2";

// const { Title } = Typography

const Profile: React.FC = () => {
  const navigate = useNavigate();
    return (
      <>
        <Map2 />
        <Layout>
            <Space>
                <Button onClick={()=> navigate('/missionDetails')}>Back</Button>
                <Button type="primary">Fullscreen</Button>
            </Space>
        </Layout>
      </>
    );
  }
  
  export default Profile;