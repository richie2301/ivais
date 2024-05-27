import React from 'react';
import { Typography, Tabs, Row, Col, Table, Input, Button } from 'antd';
import type { TabsProps, TableColumnsType } from 'antd';
// import { AppleOutlined, AndroidOutlined } from '@ant-design/icons';

import Map from '../components/Map';

const { Title } = Typography;
const { TextArea } = Input;

const tabItems: TabsProps['items'] = [
    {
      key: '1',
      label: 'Tab 1',
      children: 'Content of Tab Pane 1',
    },
    {
      key: '2',
      label: 'Tab 2',
      children: 'Content of Tab Pane 2',
    },
    {
      key: '3',
      label: 'Tab 3',
      children: 'Content of Tab Pane 3',
    },
  ];

  interface DataType {
    key: React.Key;
    name: string;
    age: number;
    address: string;
  }
  
  const columns: TableColumnsType<DataType> = [
    {
      title: 'Name',
      dataIndex: 'name',
      render: (text: string) => <a>{text}</a>,
    },
    {
      title: 'Age',
      dataIndex: 'age',
    },
    {
      title: 'Address',
      dataIndex: 'address',
    },
  ];
  
  const data: DataType[] = [
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park',
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park',
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 32,
      address: 'Sydney No. 1 Lake Park',
    },
    {
      key: '4',
      name: 'Disabled User',
      age: 99,
      address: 'Sydney No. 1 Lake Park',
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

const Report : React.FC = () => {
    // const [selectionType, setSelectionType] = useState<'checkbox' | 'radio'>('checkbox');
    return (
        <>
            <Title level={4}>Report</Title>
            <Row gutter={[20, 20]} style={{marginBottom: '70px'}}>
                <Col>
                    <Map latitude={()=> 0} longitude={()=> 0} />
                </Col>
                <Col>
                    <Tabs defaultActiveKey="1" items={tabItems} type="card" />
                </Col>
            </Row>
            <Table
                rowSelection={{
                type: 'checkbox',
                ...rowSelection,
                }}
                columns={columns}
                dataSource={data}
            />
            <Title level={5}>Note</Title>
            <TextArea rows={4} />
            <Row justify="end">
                <Col>
                    <Button type="primary" style={{marginTop: '20px'}}>Submit</Button>
                </Col>
            </Row>
        </>
    );
    }
     
    export default Report;