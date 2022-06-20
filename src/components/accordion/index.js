import { faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react'
import Expand from 'react-expand-animated';


const Accordion = (props) => {

  const { children, summary, className, subClassname, mode, autoclose, sort } = props
  const [expand, setExpand] = useState(false)
  return (
    <div className={`${className} px-4 flex-col flex ${mode === "dark" ? "text-app-black-100" : "text-white"}`}>
      <div className={`flex justify-between items-center w-full ${subClassname}`} onClick={() => { setExpand(!expand) }}>
        <div className='w-full'>{summary}</div>
        <div alt='expand' className={`transform ${expand ? "rotate-180" : "rotate-0"} ${sort && "hidden md:block"} duration-300 flex-shrink-0`} >
          <FontAwesomeIcon icon={faAngleUp} />
        </div>
      </div>
      <Expand open={expand} >
        <div onClick={() => { autoclose && setExpand(false) }} className='w-full'>
          {children}
        </div>
      </Expand>
    </div>
  )
}

Accordion.defaultProps = {
  mode: "dark",
  autoclose: false,
  sort: false
}

export default Accordion