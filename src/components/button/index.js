import React from 'react';
import { useLocation } from 'react-router-dom';


export const SideMenuButton = (props) => {
  const { className, children, menu, onClick } = props
  const path = useLocation().pathname
  return (
    <button className={`${className} hover:bg-app-primary-100 transform hover:scale-125 duration-100 ${path === menu?.path && "bg-app-primary-light"} w-9 h-9 flex items-center justify-center rounded-full`} onClick={onClick}>
      {children}
    </button>
  )
}

export const CommonButton = (props) => {
  const { className, children, onClick } = props
  return (
    <button className={`bg-white rounded-md w-12 h-12 ${className}`} onClick={onClick}>
      {children}
    </button>
  )
}

export const PrimaryButton = (props) =>{
  const {className, children, onClick} = props

  return(
    <button className={`${className}  rounded-md py-2 hover:bg-app-green duration-75 transform hover:scale-105 bg-white  hover:text-white text-black font-bold`} onClick={onClick}>
      {children}
    </button>
  )
}