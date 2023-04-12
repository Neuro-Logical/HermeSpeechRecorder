import React from 'react'
import CreateUserModal from './CreateUserModal'
import UserAccordionComponent from './UserAccordionComponent'

function UserTab() {
  return (
    <div>
        {CreateUserModal()}
        <br></br>
        {UserAccordionComponent()}
    </div>
  )
}

export default UserTab