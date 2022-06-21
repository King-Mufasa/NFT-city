import React, { useState } from 'react'
import { Helmet } from "react-helmet";
import Navbar from './navbar';
import Loading from "react-fullscreen-loading";
import "./layout.scss"
import { useAppContext } from '../contexts/AppContext';
import { Toaster } from 'react-hot-toast';
require('dotenv').config()

const Layout = ({
  children,
  title = "NFT City",
}) => {
  const context = useAppContext()
  const [expandSidebar, setExpandSidebar] = useState(false)

  // /*******************************************************
  //  * Check server
  //  *
  //  ******************************************************/
  // useEffect(() => {
  //   context.setLoading(true)
  //   axios.get(process.env.REACT_APP_SERVER_URL)
  //     .then(res => {
  //       context.setLoading(false)
  //       if (res.data === "live") {
  //         console.log("Server is Live")
  //       }
  //       else {
  //         console.log("Server is maintain", res.data)
  //         navigate("/comming")
  //       }
  //     })
  //     .catch(res => {
  //       context.setLoading(false)
  //       navigate("/comming")
  //     })
  // }, [])

  return (
    <>
      <div className='flex flex-col items-center min-h-screen justify-between relative overflow-x-hidden text-app-black-100 font-nordeco'>
        <Helmet>
          <title>{title}</title>
        </Helmet>
        {context.loading && <Loading loading={true} background="#00000059" loaderColor="#3498db" />}
        <main className="w-full flex-1 relative z-0 focus:outline-none main-content overflow-y-auto main-container section font-nordeco overflow-x-hidden"
        >
          <Toaster position="bottom-right" />
          <Navbar expand={expandSidebar} setExpand={setExpandSidebar} />
          {children}
        </main>
      </div>
    </>
  )
}

export default Layout