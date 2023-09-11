import React from 'react'
import CreateUserModal from './CreateUserModal'
import UserAccordionComponent from './UserAccordionComponent'

function UserTab() {
  return (
    <div>
      <div className='padding_bottom_20'>
        <CreateUserModal/>
      </div>
        <UserAccordionComponent/>
    </div>
  )
}

export default UserTab