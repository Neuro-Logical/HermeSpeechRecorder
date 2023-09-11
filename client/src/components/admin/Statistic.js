import React, { useEffect, useState } from 'react';
import { Button, Table, Space } from 'antd';
import axios from 'fetch';

const download = async (filename)=>{

  const res = await axios.post('/api/audios/download_single_audio',{
    filename
  })

  const base64 = res.data.file;
  const raw = window.atob(base64);
  const rawLength = raw.length;
  const array = new Uint8Array(new ArrayBuffer(rawLength));

  for(let i = 0; i < rawLength; i++) {
      array[i] = raw.charCodeAt(i);
  }

  // Now 'array' is an ArrayBuffer
  const blob = new Blob([array], {type: res.data.type.mime});

  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = res.data.filename; // or any name you want
  document.body.appendChild(a);
  a.click(); // simulate a click
  a.remove(); // clean up
}

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
  },
  {
    title: 'Action',
    render: (_, record) => (
      <Space size="middle">
        <a style={{color: '#1677ff'}} onClick={()=>download(record.name)}>Download</a>
      </Space>
    ),
  },
];

const App = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([])

  useEffect(()=>{
    (async ()=>{
      const res = await axios.get('/api/audios/get_all_audios')
      const { data } = res
      const tmp = data.map((item, index)=>{
        return {
          key: item.path,
          name: item.name
        }
      })
      setData(tmp)
    })()
  },[])

  const start = () => {
    setLoading(true);
    // ajax request after empty completing
    setTimeout(() => {
      setSelectedRowKeys([]);
      setLoading(false);
    }, 1000);
  };

  const onSelectChange = (newSelectedRowKeys) => {
    console.log('selectedRowKeys changed: ', newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const hasSelected = selectedRowKeys.length > 0;

  return (
    <div>
      <div style={{ marginBottom: 16, textAlign: 'left' }}>
        <Button type="primary" onClick={start} disabled={!hasSelected} loading={loading}>
          Upload
        </Button>
        <span style={{ marginLeft: 8 }}>
          {hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}
        </span>
      </div>
      <Table rowSelection={rowSelection} columns={columns} dataSource={data} />
    </div>
  );
};

export default App;