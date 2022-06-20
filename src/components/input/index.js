import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useState, useEffect } from 'react'

export const InputUnit = (props) => {
  const { type, value, label, setValue, className, validate, placeholder, disabled } = props
  const [error, setError] = useState(false)
  const [errormsg, setErrorMsg] = useState("")
  useEffect(() => {
    let msg = ""
    if ((validate?.require && value === "") || (validate?.length && value?.length < validate?.length)) {
      if (validate?.require && value === "") {
        msg = label + " is required"
      }
      else if (validate?.length && value?.length < validate?.length) {
        msg = msg + "\n" + label + " must be at least " + validate?.length + " characters long."
      }
      setErrorMsg(msg)
      setError(true)
    }
    else {
      setError(false)
      setErrorMsg("")
    }
  }, [value, label, validate])
  return (
    <div className='text-left'>
      <label className='text-white text-sm'>{label}</label>
      <input type={type} value={value || ""} onChange={(e) => setValue(e.target.value)} className={`${className} bg-white w-full text-black rounded-md outline-none px-4 py-2`} placeholder={placeholder} disabled={disabled}/>
      {error && <p className='text-red-500 text-sm'>{errormsg}</p>}
    </div>
  )
}


export const Search = (props) => {
  const { className, value, setValue } = props
  return (
    <div className={`flex bg-white outline-none items-center gap-2  rounded-md ${className}`}>
      <input type="text" placeholder="Search username" id="formulate--marketplace-1" name="search" className={`outline-none block pr-10 w-full rounded-md text-ne-style shadow placeholder-ne-style override:text-base py-1.5 px-3`} value={value || ""} onChange={(e) => setValue(e.target.value)}></input>
      <FontAwesomeIcon icon={faSearch} className='p-2 text-gray-700' />
    </div>
  )
}

export const Input = (props) => {
  const { className, type, value, setValue, placeholder } = props
  return (
    <input type={type} placeholder={placeholder} className={`outline-none text-black block w-full rounded-md text-ne-style shadow placeholder-ne-style override:text-base py-1.5 px-3 ${className}`} value={value || ""} onChange={(e) => setValue(e.target.value)} />
  )
}


export const CheckUnit = (props) => {
  const { className, icon, label, value, setValue } = props
  return (
    <div data-classification="box" data-type="checkbox" className={`${className} formulate-input`}>
      <div className="flex flex-row-reverse items-center justify-between">
        <div data-type="checkbox" className="formulate-input-element formulate-input-element--checkbox rounded-md bg-white items-center flex justify-center w-6 h-6">
          <input type="checkbox" id={label} name="nonUrbanTiles" className="h-4 w-4 rounded-md ring ring-white outline-none border-none text-ne-deepPurple" value={value || ""} onChange={(e) => setValue(e.target.value)} />
        </div>
        <label htmlFor={label} className="flex items-center gap-2">
          {icon && <div className='w-6 h-6 items-center justify-center flex'>
            <FontAwesomeIcon icon={icon} size='lg' />
          </div>}
          {label}
        </label>
      </div>
    </div>
  )
}