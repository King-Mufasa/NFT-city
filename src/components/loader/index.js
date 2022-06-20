import React from 'react'
import ScaleLoader from "react-spinners/ScaleLoader";
import "./loader.scss"

export const Loader = () => {
  return (
    <div className='right-0 bottom-0 absolute top-0 left-0  rounded-xl '>
      <div className='w-full h-full loader bg-app-black-transparent rounded-xl'></div>
      <div className='px-8 py-4 rounded-md bg-white absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 '>
        <ScaleLoader size={150} color='#000000' />
      </div>
    </div>
  )
}


export const FullscreenLoader = (props) => {
  const { msg } = props
  return (
    <div className='w-screen h-screen absolute left-0 top-0 z-10 bg-black bg-opacity-80'>
      <div className='px-8 py-4 rounded-md bg-white absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center'>
        <ScaleLoader size={150} color='#000000' />
        <p className='text-center'>{msg}</p>
      </div>
    </div>
  )
}