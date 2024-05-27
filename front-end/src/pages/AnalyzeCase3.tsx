import React from 'react';
import { useNavigate } from 'react-router-dom'
import { Typography, Button, Space, Row, Col, Layout, Tabs, Segmented } from 'antd';
import type { TabsProps } from 'antd';
import Icon, { BarsOutlined } from '@ant-design/icons';
import ReactPlayer from 'react-player';

const MapIconSvg = () => (
  <svg width="1em" height="1em" fill="white" viewBox="0 0 105.93 122.88">
    <path d="M56.92,73.14a1.62,1.62,0,0,1-1.86.06A65.25,65.25,0,0,1,38.92,58.8,51.29,51.29,0,0,1,28.06,35.37C26.77,27.38,28,19.7,32,13.45a27,27,0,0,1,6-6.66A29.23,29.23,0,0,1,56.36,0,26,26,0,0,1,73.82,7.12a26,26,0,0,1,4.66,5.68c4.27,7,5.19,16,3.31,25.12A55.29,55.29,0,0,1,56.92,73.14Zm-19,.74V101.7l30.15,13V78.87a65.17,65.17,0,0,0,6.45-5.63v41.18l25-12.59v-56l-9.61,3.7a61.61,61.61,0,0,0,2.38-7.81l9.3-3.59A3.22,3.22,0,0,1,105.7,40a3.18,3.18,0,0,1,.22,1.16v62.7a3.23,3.23,0,0,1-2,3L72.72,122.53a3.23,3.23,0,0,1-2.92,0l-35-15.17L4.68,122.53a3.22,3.22,0,0,1-4.33-1.42A3.28,3.28,0,0,1,0,119.66V53.24a3.23,3.23,0,0,1,2.32-3.1L18.7,43.82a58.63,58.63,0,0,0,2.16,6.07L6.46,55.44v59l25-12.59V67.09a76.28,76.28,0,0,0,6.46,6.79ZM55.15,14.21A13.72,13.72,0,1,1,41.43,27.93,13.72,13.72,0,0,1,55.15,14.21Z"/>
  </svg>
)

const MapIcon = () => (
  <Icon component={MapIconSvg} />
);

const { Title } = Typography;
const { Footer } = Layout;

const tabItems: TabsProps['items'] = [
    {
        label: 'Tab 1',
        key: '1',
        children: <Space direction="vertical" style={{width: '100%'}}>A</Space>,
    },
    {
        label: 'Tab 2',
        key: '2',
        children: 'Content of Tab Pane 2',
    },
    {
        label: 'Tab 3',
        key: '3',
        children: 'Content of Tab Pane 3',
    },
];

const SelectPeople : React.FC = () => {
    const navigate = useNavigate()

    return (
        <>
          <Layout style={{height: '100%', background: 'none'}}>
            <Space direction="vertical">
              <Title level={4}>Analyze Case</Title>
            </Space>
            <Layout style={{padding: '20px 0', background: 'none'}}>
              <Row gutter={[20, 20]}>
                <Col span={12}>
                  <Row justify="space-between" style={{marginBottom: '10px'}}>
                    <Col>
                      <Title level={3} style={{margin: 0}}>Evidence 1</Title>
                    </Col>
                    <Col>
                      <Segmented
                        options={[
                          { value: 'List', icon: <BarsOutlined /> },
                          { value: 'Kanban', icon: <MapIcon /> },
                        ]}
                      />
                    </Col>
                  </Row>
                  <ReactPlayer url="https://www.youtube.com/watch?v=jJHFirGQqvk&list=RDjJHFirGQqvk&start_radio=1" width="100%" />
                </Col>
                <Col span={12}>
                  <Tabs
                      type="card"
                      items={tabItems}
                    />
                </Col>
              </Row>
            </Layout>
            
            <Footer style={{padding: '0', background: 'none'}}>
              <Row justify="space-between">
                <Col>
                  <Button onClick={() => navigate('/selectAttribute')}>Back</Button>
                </Col>
                <Col>
                  <Button type="primary" onClick={() => navigate('/report')}>Done</Button>
                </Col>
              </Row>
            </Footer>
          </Layout>
        </>
    );
    }

export default SelectPeople;