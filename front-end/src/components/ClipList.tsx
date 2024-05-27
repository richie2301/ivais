import React from 'react';
import type { CollapseProps } from 'antd';
import { Collapse, Row, Col, Typography, Tag, Space, Select, Button } from 'antd';
import { EyeOutlined, SaveOutlined } from '@ant-design/icons';

const { Text, Title } = Typography;

const tags = ['blue', 'hat', 'mask'];
const tagOptions = [
    { label: 'blue', value: 'blue' },
    { label: 'hat', value: 'hat' },
    { label: 'mask', value: 'mask' },
];

type ClipListProps = {
    seek: (a : number) => void
}

const App: React.FC<ClipListProps> = ({seek}) => {
  const onChange = (key: string | string[]) => {
    console.log(key);
  };

  const items: CollapseProps['items'] = [
    {
      key: '1',
      label:
      <>
          <Row gutter={20}>
              <Col>
                  <iframe width="136" height="84" src="https://www.youtube.com/embed/pWQF-ETjzx8?si=sJdvLKDFkenh9tEU" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"></iframe>
              </Col>
              <Col>
                  <Space direction="vertical">
                      <Title level={5} style={{margin: 0}}>John Doe</Title>
                      <Space.Compact>
                          {tags.map((tag: string) => {
                              let color = tag.length > 5 ? 'geekblue' : 'green';
                              if (tag === 'loser') {
                              color = 'volcano';
                              }
                              return (
                              <Tag color={color} key={tag}>
                                  {tag.toUpperCase()}
                              </Tag>
                              );
                          })}
                      </Space.Compact>
                      <Button type="text" style={{color: '#1668dc', fontWeight: 'bold', padding: 0}} onClick={() => {seek(5)}}>00:00:05</Button>
                  </Space>
              </Col>
          </Row>
      </>,
      children: 
      <>
          <Space direction="vertical" style={{width: '100%'}}>
              <Row>
                  <Col span={8}>
                      <Text strong>Name</Text>
                  </Col>
                  <Col span={16}>
                      <Text>John Doe</Text>
                  </Col>
              </Row>
              <Row>
                  <Col span={8}>
                      <Text strong>Duration</Text>
                  </Col>
                  <Col span={16}>
                    <Button type="text" style={{color: '#1668dc', fontWeight: 'bold', padding: 0}} onClick={() => {seek(5)}}>00:00:05</Button>
                  </Col>
              </Row>
              <Row>
                  <Col span={8}>
                      <Text strong>Tags</Text>
                  </Col>
                  <Col span={16}>
                      {/* <Space.Compact> */}
                          <Select
                              mode="multiple"
                              defaultValue={tags}
                              style={{ width: '100%' }}
                              options={tagOptions}
                          >
                          </Select>
                      {/* </Space.Compact> */}
                  </Col>
              </Row>
              <Row justify="end" gutter={10}>
                  <Col>
                      <Button type="primary" icon={<EyeOutlined />}>View</Button>
                  </Col>
                  <Col>
                      <Button type="primary" icon={<SaveOutlined />}>Save</Button>
                  </Col>
              </Row>
          </Space>
      </>,
    },
    {
      key: '2',
      label:
      <>
          <Row gutter={20}>
              <Col>
                  <iframe width="136" height="84" src="https://www.youtube.com/embed/pWQF-ETjzx8?si=sJdvLKDFkenh9tEU" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"></iframe>
              </Col>
              <Col>
                  <Space direction="vertical">
                      <Title level={5} style={{margin: 0}}>Jane Doe</Title>
                      <Space.Compact>
                          {tags.map((tag: string) => {
                              let color = tag.length > 5 ? 'geekblue' : 'green';
                              if (tag === 'loser') {
                              color = 'volcano';
                              }
                              return (
                              <Tag color={color} key={tag}>
                                  {tag.toUpperCase()}
                              </Tag>
                              );
                          })}
                      </Space.Compact>
                      <Button type="text" style={{color: '#1668dc', fontWeight: 'bold', padding: 0}} onClick={() => {seek(5)}}>00:00:05</Button>
                  </Space>
              </Col>
          </Row>
      </>,
      children: 
      <>
          <Space direction="vertical" style={{width: '100%'}}>
              <Row>
                  <Col span={8}>
                      <Text strong>Name</Text>
                  </Col>
                  <Col span={16}>
                      <Text>Jane Doe</Text>
                  </Col>
              </Row>
              <Row>
                  <Col span={8}>
                      <Text strong>Duration</Text>
                  </Col>
                  <Col span={16}>
                    <Button type="text" style={{color: '#1668dc', fontWeight: 'bold', padding: 0}} onClick={() => {seek(5)}}>00:00:05</Button>
                  </Col>
              </Row>
              <Row>
                  <Col span={8}>
                      <Text strong>Tags</Text>
                  </Col>
                  <Col span={16}>
                      {/* <Space.Compact> */}
                          <Select
                              mode="multiple"
                              defaultValue={tags}
                              style={{ width: '100%' }}
                              options={tagOptions}
                          >
                          </Select>
                      {/* </Space.Compact> */}
                  </Col>
              </Row>
              <Row justify="end" gutter={10}>
                  <Col>
                      <Button type="primary" icon={<EyeOutlined />}>View</Button>
                  </Col>
                  <Col>
                      <Button type="primary" icon={<SaveOutlined />}>Save</Button>
                  </Col>
              </Row>
          </Space>
      </>,
    },
    {
      key: '3',
      label:
      <>
          <Row gutter={20}>
              <Col>
                  <iframe width="136" height="84" src="https://www.youtube.com/embed/pWQF-ETjzx8?si=sJdvLKDFkenh9tEU" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"></iframe>
              </Col>
              <Col>
                  <Space direction="vertical">
                      <Title level={5} style={{margin: 0}}>Jack Doe</Title>
                      <Space.Compact>
                          {tags.map((tag: string) => {
                              let color = tag.length > 5 ? 'geekblue' : 'green';
                              if (tag === 'loser') {
                              color = 'volcano';
                              }
                              return (
                              <Tag color={color} key={tag}>
                                  {tag.toUpperCase()}
                              </Tag>
                              );
                          })}
                      </Space.Compact>
                      <Button type="text" style={{color: '#1668dc', fontWeight: 'bold', padding: 0}} onClick={() => {seek(5)}}>00:00:05</Button>
                  </Space>
              </Col>
          </Row>
      </>,
      children: 
      <>
          <Space direction="vertical" style={{width: '100%'}}>
              <Row>
                  <Col span={8}>
                      <Text strong>Name</Text>
                  </Col>
                  <Col span={16}>
                      <Text>Jack Doe</Text>
                  </Col>
              </Row>
              <Row>
                  <Col span={8}>
                      <Text strong>Duration</Text>
                  </Col>
                  <Col span={16}>
                    <Button type="text" style={{color: '#1668dc', fontWeight: 'bold', padding: 0}} onClick={() => {seek(5)}}>00:00:05</Button>
                  </Col>
              </Row>
              <Row>
                  <Col span={8}>
                      <Text strong>Tags</Text>
                  </Col>
                  <Col span={16}>
                      {/* <Space.Compact> */}
                          <Select
                              mode="multiple"
                              defaultValue={tags}
                              style={{ width: '100%' }}
                              options={tagOptions}
                          >
                          </Select>
                      {/* </Space.Compact> */}
                  </Col>
              </Row>
              <Row justify="end" gutter={10}>
                  <Col>
                      <Button type="primary" icon={<EyeOutlined />}>View</Button>
                  </Col>
                  <Col>
                      <Button type="primary" icon={<SaveOutlined />}>Save</Button>
                  </Col>
              </Row>
          </Space>
      </>,
    },
  ];

  return <Collapse items={items} defaultActiveKey={[]} onChange={onChange} />;
};

export default App;
