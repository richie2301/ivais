import React, { useContext, useEffect, useRef, useState } from 'react';
import type { InputRef } from 'antd';
import { Button, Form, Input, Table, Tag, Select } from 'antd';
import type { FormInstance } from 'antd/es/form';
import { EyeOutlined } from '@ant-design/icons';
import type { BaseSelectRef } from 'rc-select';

const EditableContext = React.createContext<FormInstance<any> | null>(null);

type EditableCellsProps = {
    showDetails: (show: boolean) => void;
};

interface Item {
  key: string;
  name: string;
  date: string;
  address: string;
  tags: string[];
}

interface EditableRowProps {
  index: number;
}

const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

interface EditableCellProps {
  title: React.ReactNode;
  editable: boolean;
    editableTag: boolean;
  children: React.ReactNode;
  dataIndex: keyof Item;
  record: Item;
  handleSave: (record: Item) => void;
}

const EditableCell: React.FC<EditableCellProps> = ({
  title,
  editable,
    editableTag,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const [editingTag, setEditingTag] = useState(false);
  const inputRef = useRef<InputRef>(null);
  const selectRef = useRef<BaseSelectRef>(null);
  const form = useContext(EditableContext)!;

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current!.focus();
    }
  }, [editing]);

  useEffect(() => {
    if (editingTag && selectRef.current) {
      selectRef.current!.focus();
    }
  }, [editingTag]);                                                                                          

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({ [dataIndex]: record[dataIndex] });
  };

    const toggleEditTag = () => {
        setEditingTag(!editingTag);
        form.setFieldsValue({ [dataIndex]: record[dataIndex] });
    };

  const save = async () => {
    try {
      const values = await form.validateFields();

      toggleEdit();
      toggleEditTag();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{ margin: 0 }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div className="editable-cell-value-wrap" style={{ paddingRight: 24 }} onClick={toggleEdit}>
        {children}
      </div>
    );
  }

  const options = [
    { label: 'blue', value: 'blue' },
    { label: 'hat', value: 'hat' },
    { label: 'mask', value: 'mask' },
];

  if (editableTag) {
    childNode = editingTag ? (
      <Form.Item
        style={{ margin: 0 }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        <Select
            ref={selectRef}
            mode="tags"
            style={{ width: '100%' }}
            placeholder="Tags Mode"
            onChange={save}
            options={options}
            tokenSeparators={[',']}
        />
      </Form.Item>
    ) : (
      <div className="editable-cell-value-wrap" style={{ paddingRight: 24 }} onClick={toggleEditTag}>
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

type EditableTableProps = Parameters<typeof Table>[0];

interface DataType {
  key: React.Key;
  name: string;
  date: string;
  address: string;
  tags: string[];
}

type ColumnTypes = Exclude<EditableTableProps['columns'], undefined>;

const EditableCells: React.FC<EditableCellsProps> = ({showDetails}) => {
  const [dataSource, setDataSource] = useState<DataType[]>([
    {
      key: '0',
      name: 'Video 0',
      date: '11/01/2024',
      address: 'London, Park Lane no. 0',
      tags: ['nice', 'developer'],
    },
    {
      key: '1',
      name: 'Video 1',
      date: '11/01/2024',
      address: 'London, Park Lane no. 1',
      tags: ['loser'],
    },
  ]);

  // const [count, setCount] = useState(2);

  // const handleDelete = (key: React.Key) => {
  //   const newData = dataSource.filter((item) => item.key !== key);
  //   setDataSource(newData);
  // };

  const defaultColumns: (ColumnTypes[number] & { editable?: boolean; dataIndex: string, editableTag?: boolean })[] = [
    {
      title: 'Name',
      dataIndex: 'name',
      // width: '30%',
      // editable: true,
    },
    {
      title: 'Date',
      dataIndex: 'date',
    },
    {
      title: 'Address',
      dataIndex: 'address',
    },
    {
      title: 'Tags',
      dataIndex: 'tags',
      editableTag: true,
    //   editable: true,
    //   render: (text: string) => <Tag>{text}</Tag>
      render: (_, { tags }) => (
        <>
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
        </>
      ),
    },
    {
      title: 'View',
      dataIndex: 'operation',
      render: (_, record) =>
        // dataSource.length >= 1 ? (
        //   <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.key)}>
        //     <a>Delete</a>
        //   </Popconfirm>
        // ) : null,
        <Button icon={<EyeOutlined />} onClick={() => {
            console.log(record)
            showDetails(true)
        }} type="primary">
            View
        </Button>
    },
  ];

  // const handleAdd = () => {
  //   const newData: DataType = {
  //     key: count,
  //     name: `Evidence ${count}`,
  //     date: '32',
  //     address: `London, Park Lane no. ${count}`,
  //     tags: ['sample'],
  //   };
  //   setDataSource([...dataSource, newData]);
  //   setCount(count + 1);
  // };

  const handleSave = (row: DataType) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    setDataSource(newData);
  };

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  const columns = defaultColumns.map((col) => {
    if (!col.editable) {
        if (!col.editableTag) {
            return col;
        }
      return {
        ...col,
        onCell: (record: DataType) => ({
          record,
          editableTag: col.editableTag,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave,
        }),
      };
    }
    return {
      ...col,
      onCell: (record: DataType) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    };
  });

  return (
    <div>
      {/* <Button onClick={handleAdd} type="primary" style={{ marginBottom: 16 }}>
        Add a row
      </Button>
      <Button onClick={() => console.log(dataSource)} type="primary" style={{ marginBottom: 16 }}/> */}
      <Table
        components={components}
        rowClassName={() => 'editable-row'}
        bordered
        dataSource={dataSource}
        columns={columns as ColumnTypes}
        // onRow={(record, index) => {
        //   return {
        //     onClick: event => {
        //       console.log(record, index, event)
        //     }, 
        //   };
        // }}
      />
    </div>
  );
};

export default EditableCells;
