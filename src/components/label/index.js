import React from 'react'

export const PageTitle = (props) => {
  const { className, children } = props
  return (
    <h5 className={`ml-3 uppercase text-white font-bold ${className}`}>{children}</h5>
  )
}