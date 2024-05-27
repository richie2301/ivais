import React from 'react';
import { Row, Col, Input, Button, Space } from 'antd';
import type { SelectProps } from 'antd';
// import type { SearchProps } from '../Search';
import { SelectOutlined, FilterOutlined } from '@ant-design/icons';

const { Search } = Input;

// const onSearch: SearchProps['onSearch'] = (value, _e, info) => console.log(info?.source, value);

// const handleChange = (value: string[]) => {
//     console.log(`selected ${value}`);
// };

const options: SelectProps['options'] = [];
const options2: SelectProps['options'] = [];

options.push({
    label: 'Vehicle',
    value: 'vehicle'
},
{
    label: 'Person',
    value: 'person'
},
);

options2.push({
    label: 'Car',
    value: 'car'
},
{
    label: 'Orange',
    value: 'orange'
},
{
    label: 'Lamborghini',
    value: 'lamborghini'
},
{
    label: 'Taxi',
    value: 'taxi'
},
{
    label: 'Blue',
    value: 'blue'
},
{
    label: 'Man',
    value: 'man'
},
{
    label: 'Old',
    value: 'old'
},
{
    label: 'Glasses',
    value: 'glasses'
},
);

const SearchFilter: React.FC = () => {
    return (
        <Space direction="vertical" style={{width: '100%', padding: '10px'}}>
            <Row gutter={5} style={{paddingBottom: '10px'}}>
                {/* <Col span={8}>
                    <Select
                    mode="multiple"
                    allowClear
                    style={{ width: '100%' }}
                    placeholder="Select object type"
                    onChange={handleChange}
                    options={options}
                    />
                </Col> */}
                <Col span={16}>
                    <Search placeholder="Select by name or ID" style={{ width: '100%' }} />
                </Col>
                <Col span={4}>
                    <Button block icon={<FilterOutlined />}>Filter</Button>
                </Col>
                <Col span={4}>
                    <Button block icon={<SelectOutlined />}>Select</Button>
                </Col>
                {/* <Col span={4}>
                    <Button type='primary' block icon={<SelectOutlined />}>Track</Button>
                </Col> */}
            </Row>
            <Row justify="end">
                <Col>
                <Button type='primary' block icon={<SelectOutlined />}>Track</Button>
                </Col>
            </Row>
            {/* <Space style={{width : '100%'}}>
                <Select
                    block
                    mode="multiple"
                    allowClear
                    style={{ width: '100%' }}
                    placeholder="Select object type"
                    onChange={handleChange}
                    options={options}
                />
                <Button icon={<SelectOutlined />}>Select</Button>
            </Space> */}
        </Space>
    );
}

export default SearchFilter;