import { faCheck, faInfoCircle, faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

export const Notification = (props) => {
  const { className, children, type } = props
  return (
    <div className={`${className} px-5 py-4 ${type === "success" ? "bg-app-green" : type === "error" ? "bg-app-red" : "bg-app-blue"} rounded-md flex gap-2 text-white items-center`}>
      <FontAwesomeIcon icon={type==="success"?faCheck:type==="error"?faXmark:faInfoCircle} size='lg'/>
      <p className='text-lg'>{children}</p>
    </div>
  )
}