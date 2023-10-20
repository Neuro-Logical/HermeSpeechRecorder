import React, { useEffect, useState } from 'react';
import { Button, Table, Space, Input} from 'antd';
import axios from 'fetch';

const { Search } = Input;

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
  const [oriData, setOriData] = useState([])

  useEffect(()=>{
    (async ()=>{
      const res = await axios.get('/api/audios/get_all_audios')
      const { data } = res
      const tmp = data.map((item, index)=>{
        return {
          key: item.name,
          name: item.name
        }
      })
      setData(tmp)
      setOriData(tmp)
    })()
  },[])

  const start = async () => {
    setLoading(true);

    const res = await axios.post('/api/audios/download_in_zip',{
      filenames: selectedRowKeys
    },{
      responseType: 'blob'
    })

    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement('a');
    link.href = url;
    const contentDisposition = res.headers['content-disposition'];
    let filename = 'default-filename.zip'; // Default name if no content-disposition header

    // Extract filename from HTTP headers if available
    if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?(.+)"?\b/);
        if (filenameMatch.length >= 2) {
            filename = filenameMatch[1];
        }
    }

    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url); // Clean up

    setSelectedRowKeys([]);
    setLoading(false);
  };

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const hasSelected = selectedRowKeys.length > 0;

  const onSearch = (value, _e, info) => {
    if(value == ''){
      setData(oriData)
    }else{
      let tmp = data.filter(item => item.name.indexOf(value) > -1)
      console.log(tmp)
      setData(tmp)
    }
  }

  return (
    <div>
      <div style={{ marginBottom: 16, textAlign: 'left' }}>
        <Space size="middle">
            <Button type="primary" onClick={start} disabled={!hasSelected} loading={loading}>
              Download
            </Button>
            <Button type="primary" onClick={()=>{}} disabled={!hasSelected} loading={loading}>
              Upload
            </Button>
            <Search placeholder="Search something" onSearch={onSearch} enterButton />
        </Space>
        <span style={{ marginLeft: 8 }}>
          {hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}
        </span>
      </div>
      <Table rowSelection={rowSelection} columns={columns} dataSource={data} />
    </div>
  );
};

export default App;