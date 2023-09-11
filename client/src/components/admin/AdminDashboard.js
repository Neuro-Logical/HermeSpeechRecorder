import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom"
import {
  AppstoreOutlined,
  BarChartOutlined,
  CloudOutlined,
  ShopOutlined,
  TeamOutlined,
  UploadOutlined,
  UserOutlined,
  PlayCircleOutlined,
} from '@ant-design/icons'
import { Layout, Menu, theme } from 'antd';

import UserTab from './UserTab';
import ScriptTab from './ScriptTab';
import Statistic from './Statistic'
import Medias from './Medias'

import axios from 'fetch';

const { Header, Content, Footer, Sider } = Layout;

const items = [{
 key:'users',
 icon: React.createElement(UserOutlined),
 label:'Users' 
},
{
  key:'scripts',
  icon: React.createElement(BarChartOutlined),
  label:'Scripts' 
 },
 {
  key:'audios',
  icon: React.createElement(UploadOutlined),
  label:'Audios' 
 },
 {
  key:'medias',
  icon: React.createElement(PlayCircleOutlined),
  label:'Medias' 
 }]

const AdminDashboard = () => {
  const [key, setKey] = useState('users')

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const navigate = useNavigate();

  useEffect(()=>{
    axios.get('/api/auth/admin').then(res=>{
      if(res.status !== 200) { navigate("/admin/login") }
    })
  }, [])

  return (
    <Layout hasSider>
      <Sider
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        <div className="demo-logo-vertical">Herme Admin</div>
        <Menu theme="dark" mode="inline" defaultSelectedKeys={['users']} selectedKeys={[key]} items={items} onClick={(e)=>{
          console.log('e=====>', e)
          setKey(e.key)
        }}/>
      </Sider>
      <Layout className="site-layout" style={{ marginLeft: 200, minHeight: '100vh' }}>
        <Header style={{ padding: 0, background: colorBgContainer}} />
        <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
          <div style={{ padding: 24, textAlign: 'center', background: colorBgContainer}}>
            {key == 'users' && <UserTab/>}
            {key == 'scripts' && <ScriptTab/>}
            {key == 'audios' && <Statistic />}
            {key == 'medias' && <Medias />}
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>Herme Speech ©2023 Created by JHU ECE</Footer>
      </Layout>
    </Layout>
  );
};

export default AdminDashboard;