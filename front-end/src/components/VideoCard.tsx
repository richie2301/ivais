import React from 'react';
import { Card, Space, Row, Col, Typography, Tag, Checkbox, Avatar } from 'antd';
import { useNavigate } from 'react-router-dom';

// const IconText = ({ icon, text }: { icon: React.FC; text: string }) => (
//   <Space>
//     {React.createElement(icon)}
//     {text}
//   </Space>
// );

const { Title } = Typography;
const { Text } = Typography

type VideoCard = {
  videos: {
    id: number,
    videoId: number,
    video: string,
    videoName: string,
    videoDescription: string,
    videoTags: string[],
    location: string,
    date: string,
    team: string,
    teamProfile: string,
    checked: boolean,
  },
  clickCheckbox: (id: number) => void;
  showCheckbox: boolean;
  success: (message: string) => void;
}

// const data = Array.from({ length: 23 }).map((_, i) => ({
//   href: 'https://ant.design',
//   title: `ant design part ${i}`,
//   avatar: `https://xsgames.co/randomusers/avatar.php?g=pixel&key=${i}`,
//   description:
//     'Ant Design, a design language for background applications, is refined by Ant UED Team.',
//   content:
//     'We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
// }));

const VideoCard: React.FC<VideoCard> = ({videos, clickCheckbox, showCheckbox}) => {

  const handleClick = () => {
    // setChecked(!checked);
    clickCheckbox(videos.id);
  }

  const navigate = useNavigate();
  
  const handleVideoClick = () => {
    navigate('/analyzeVideo')
  }

    return (
      <>
        <Card hoverable>
            {/* <p>Card content</p>
            <p>Card content</p>
            <p>Card content</p> */}

            <Row>
              {/* <Col span={1}><Checkbox></Checkbox></Col> */}
              <Col span={8} style={{margin: 'auto'}}>
                <Space>
                <img  onClick={handleVideoClick} className="hoverImage" src={videos.video} width="100%"/>
                </Space>
              </Col>
              <Col span={16}>
                <Space.Compact style={{padding: '0 30px', width: '100%'}} direction='vertical'>
                  <Title level={3} className="hoverText" onClick={handleVideoClick}>{videos.videoName}</Title>
                  <Text>{videos.videoDescription}</Text>
                  <Space style={{padding: '10px 0'}}>
                    {videos.videoTags.map((item) => (
                      <Tag>{item}</Tag>
                    ))}
                  </Space>
                  <Row style={{padding: '10px 0'}} gutter={10}>
                    <Col><Avatar src="https://xsgames.co/randomusers/avatar.php?g=pixel" /></Col>
                    <Col>
                      <Space direction='vertical'>
                      <Text className="hoverText">{videos.team}</Text>
                      <Text>{videos.location} • {videos.date}</Text>
                      </Space>
                    </Col>
                  </Row>
                </Space.Compact>
              </Col>
            </Row>
            {showCheckbox && <Checkbox checked={videos.checked} onClick={handleClick} style={{position: 'absolute', top: 30, left: 35}}></Checkbox>}
        </Card>
        {/* <List
          itemLayout="vertical"
          size="large"
          pagination={{
            onChange: (page) => {
              console.log(page);
            },
            pageSize: 3,
          }}
          dataSource={videos}
          footer={
            <div>
              <b>ant design</b> footer part
            </div>
          }
          renderItem={(item) => (
            <List.Item
              key={item.videoName}
              actions={[
                <IconText icon={StarOutlined} text="156" key="list-vertical-star-o" />,
                <IconText icon={LikeOutlined} text="156" key="list-vertical-like-o" />,
                <IconText icon={MessageOutlined} text="2" key="list-vertical-message" />,
              ]}
              extra={
                <img
                  width={272}
                  alt="logo"
                  src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
                />
              }
            >
              <List.Item.Meta
                // avatar={<Avatar src={item.avatar} />}
                title={<a href={item.href}>{item.videoName}</a>}
                description={item.videoDescription}
              />
              {item.content}
            </List.Item>
          )}
        /> */}
      </>
    );
  }
  
  export default VideoCard;