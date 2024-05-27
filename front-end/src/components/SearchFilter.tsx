import React from 'react';
import { Row, Col, Select, Input } from 'antd';
import type { SelectProps } from 'antd';
// import type { SearchProps } from '../Search';

const { Search } = Input;

// const onSearch: SearchProps['onSearch'] = (value, _e, info) => console.log(info?.source, value);

const handleChange = (value: string[]) => {
    console.log(`selected ${value}`);
};

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
        <Row gutter={20} style={{padding: '0 0 20px 0'}}>
            <Col span={4}>
                <Select
                mode="multiple"
                allowClear
                style={{ width: '100%' }}
                placeholder="Select object type"
                onChange={handleChange}
                options={options}
                />
            </Col>
            <Col span={8}>
                <Select
                mode="multiple"
                allowClear
                style={{ width: '100%' }}
                placeholder="Select attributes"
                onChange={handleChange}
                options={options2}
                />
            </Col>
            <Col span={12}>
            <Search placeholder="Select by name or ID" style={{ width: '100%' }} />
            </Col>
        </Row>
    );
}

export default SearchFilter;