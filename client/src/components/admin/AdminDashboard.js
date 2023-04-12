import React from 'react'
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import UserTab from './UserTab';

function AdminDashboard() {
    return (
        <div className='my-4 mx-4'>
        <Tabs
          defaultActiveKey="users"
          id="admin-main-tab"
          className="mb-3"
        >
          <Tab eventKey="users" title="Users">
            {UserTab()}
          </Tab>
          <Tab eventKey="scripts" title="Scripts">
            #2
          </Tab>
          <Tab eventKey="contact" title="Contact" disabled>
            #3
          </Tab>
        </Tabs>
        </div>
      );
}

export default AdminDashboard