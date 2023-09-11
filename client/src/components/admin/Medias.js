import React, { useEffect, useState } from 'react';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Select, Button, Table, message, Form, Modal, Space, Input, Radio  } from 'antd';
import axios from 'fetch';

const { Column } = Table;

const normFile = (e) => {
  console.log('Upload event:', e);
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};

const App = () => {
  const [data, setData] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [formAssign] = Form.useForm();
  const [user_ids, setUid] = useState([]);

  useEffect(()=>{
    axios.get('/api/media/get_all_medias').then(res=>{
      const tmp = res.data.map((item, index)=>{
        return {
          key: item.id,
          name: item.id,
          addr: item.addr,
          desc: item.desc,
          type: item.type
        }
      })
      setData(tmp)
    })
  }, [])

  const handleFileChange = (e) => {
    // Manually update form field
    form.setFieldsValue({
      upload: e.target.files[0]
    });
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    form.resetFields();
    setIsModalOpen(false);
  };

  const handleAssginCancel = () => {
    formAssign.resetFields()
    setIsAssignModalOpen(false);
  };

  const showAssignModal = (record)=>{

    formAssign.setFieldsValue({
      script_id: record.name,
      desc: record.desc
    })

    axios.get('/api/user/get_all_users').then(res=>{
      const data = res.data
      let tmp = data.map(item=>{
        return {
          value: item.id,
          label: item.id
        }
      })
      setUid(tmp);
    })
    
    setIsAssignModalOpen(true);
  }

  const onFinish = async (values) => {    

    // check description
    if(!values.desc || values.desc?.length == 0) {
      message.error('Please add a description')
      return;
    }

    const desc = values.desc?.map(item=>item.desc)

    // Create FormData for file uploading, for example:
    const formData = new FormData();
    formData.append('filename', values.upload);
    formData.append('desc', JSON.stringify(desc));

    await axios.post('/api/media/create', formData, {
      headers: {
          'Content-Type': 'multipart/form-data'
        }
    })

    axios.get('/api/media/get_all_medias').then(res=>{
      const tmp = res.data.map((item, index)=>{
        return {
          key: item.id,
          name: item.id,
          addr: item.addr,
          desc: item.desc,
          type: item.type
        }
      })
      setData(tmp)
    })

    form.resetFields();

    message.success(`Successfully created!`)

    setIsModalOpen(false);
  };

  const onAssignFinish = async (values)=>{
    console.log('assign values:', values)
    const { user_id, script_id, desc} = values
  
    await axios.post('/api/media/assign', {
      user_id,
      script_id,
      desc
    })

    formAssign.resetFields();

    message.success(`Assigned to ${user_id}`)

    setIsAssignModalOpen(false);
  }

  return (
    <div>
      <div style={{ marginBottom: 16, textAlign: 'left' }}>
          <Button style={{marginRight: '16px'}} type="primary" onClick={showModal}>
            Create
          </Button>
          <Modal title="Upload Media" open={isModalOpen} onCancel={handleCancel} footer={null}>
            <Form
              form={form}
              name="create"
              onFinish={onFinish}
              layout="vertical"
            >
              <Form.Item
                name="upload"
                label="Upload"
                valuePropName="fileList"
                getValueFromEvent={normFile}
                rules={[{ required: true, message: 'Please upload your image!' }]}
              >
                <input type="file" name="upload" onChange={handleFileChange} />
              </Form.Item>
              <Form.List 
                name="desc"
              >
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }, index) => (
                    <Space key={key} style={{ marginBottom: 8, width: '460px' }} align="baseline">
                      <Form.Item
                        {...restField}
                        name={[name, 'desc']}
                        label={`Description${index+1}`}
                        style={{ width: '460px'}}
                        rules={[{ required: true, message: 'Missing description' }]}
                      >
                          <Input.TextArea style={{ width: '100%'}} placeholder="Enter your description" />
                      </Form.Item>
                      <MinusCircleOutlined onClick={() => remove(name)} />
                    </Space>
                  ))}
                  <Form.Item>
                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                      Add Description
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
            <Form.Item style={{textAlign: 'center'}}>
              <Space>
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
                <Button htmlType="reset">reset</Button>
              </Space>
            </Form.Item>
            </Form>
          </Modal>
          <Modal title="Assign to an User" open={isAssignModalOpen} onCancel={handleAssginCancel} footer={null}>
          <Form
            name="assign"
            onFinish={onAssignFinish}
            autoComplete="off"
            layout="vertical"
            form={formAssign}
          >
            <Form.Item
              label="User_id"
              name="user_id"
              rules={[{ required: true, message: 'Please select your user_id!' }]}
            >
              <Select
                options={user_ids}
              />
            </Form.Item>

            <Form.Item
              label="Media_id"
              name="script_id"
              rules={[{ required: true, message: 'Please input your media_id' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item 
              label="Description" 
              name="desc" 
              rules={[{ required: true, message: 'Please select your description!' }]}
            >
              <Radio.Group>
                {formAssign.getFieldValue('desc') ? formAssign.getFieldValue('desc')?.map((item, index)=>(
                  <Radio value={index}> {`Desc${index+1}`} </Radio>
                )) : null}
              </Radio.Group>
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Space>
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
                <Button htmlType="reset">Reset</Button>
              </Space>
            </Form.Item>
          </Form>
          </Modal>
      </div>
      <Table dataSource={data}>
        <Column width={100} title="Media" dataIndex="addr" key="addr" render={(addr) => (<img
              alt="example"
              style={{
                width: '50px',
              }}
              src={addr}
        />)} />
        <Column width={100} title="Name" dataIndex="name" key="name" />
        <Column width={100} title="Type" dataIndex="type" key="type" />
        <Column title="Description" dataIndex="desc" key="desc" render={(desc)=>{
          return Array.isArray(desc) ? desc.map((item, index)=>(
            (<div>
              <div style={{fontWeight: 700}}>{`Description ${index+1}`}</div>
              <div>{item}</div>
            </div>)
          )) : null
        }} />
        <Column width={100} title="Action" render={(_, record)=>(
          <Space size="middle">
            <a style={{color: '#1677ff'}} onClick={()=>showAssignModal(record)}>Assign</a>
          </Space>
          )}/>
      </Table>
    </div>
  );
};

export default App;