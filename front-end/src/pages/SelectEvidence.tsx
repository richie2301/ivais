import React from 'react';
import { useNavigate } from 'react-router-dom'
import { Table, Typography, Button, Input, Space, Layout, Row, Col } from 'antd';
import type { TableColumnsType } from 'antd';

const { Title } = Typography;
const { Footer } = Layout;

interface DataType {
  key: React.Key;
  name: string;
  date: string;
  location: string;
}

const columns: TableColumnsType<DataType> = [
  {
    title: 'Name',
    dataIndex: 'name',
    // render: (text: string) => <a>{text}</a>,
  },
  {
    title: 'Date',
    dataIndex: 'date',
  },
  {
    title: 'Location',
    dataIndex: 'location',
  },
];

const data: DataType[] = [
  {
    key: '1',
    name: 'Evidence 1',
    date: '10/01/2024',
    location: 'New York No. 1 Lake Park',
  },
  {
    key: '2',
    name: 'Evidence 2',
    date: '11/01/2024',
    location: 'London No. 1 Lake Park',
  },
  {
    key: '3',
    name: 'Evidence 3',
    date: '12/01/2024',
    location: 'Sydney No. 1 Lake Park',
  },
  {
    key: '4',
    name: 'Evidence 4',
    date: '13/01/2024',
    location: 'Sydney No. 1 Lake Park',
  },
];

// rowSelection object indicates the need for row selection
const rowSelection = {
  onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
  },
  getCheckboxProps: (record: DataType) => ({
    disabled: record.name === 'Disabled User', // Column configuration not to be checked
    name: record.name,
  }),
};

const AddCase : React.FC = () => {
    // const [selectionType, setSelectionType] = useState<'checkbox' | 'radio'>('checkbox');
    const navigate = useNavigate()

    return (
        <>
          <Layout style={{height: '100%', background: 'none'}}>
            <Title level={4}>Select Evidence</Title>
            <Layout style={{background: 'none', padding: '20px 0'}}>
              <Space direction="vertical" style={{width: '100%'}}>
                  <Input placeholder="Search" />
                  <Table
                      rowSelection={{
                      type: 'checkbox',
                      ...rowSelection,
                      }}
                      columns={columns}
                      dataSource={data}
                  />
              </Space>
            </Layout>
            <Footer style={{padding: '0', background: 'none'}}>
              <Row justify="space-between">
                <Col>
                  <Button onClick={() => navigate('/addCase')}>Back</Button>
                </Col>
                <Col>
                  <Button type="primary" onClick={() => navigate('/selectAttribute')}>Next</Button>
                </Col>
              </Row>
            </Footer>
          </Layout>
        </>
    );
    }

export default AddCase;