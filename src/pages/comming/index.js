import React, { useEffect } from 'react'
import Layout from '../../layout/layout'
import CorePage from '../../assets/icons/logo_nft_city.png'
import "./comming.scss"
import { useAppContext } from '../../contexts/AppContext'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

let request

const CommingSoonPage = () => {
  const context = useAppContext()
  const navigate = useNavigate()

  /*******************************************************
   * Check server
   *
   ******************************************************/
  // const checkServer = () => {
  //   request = setTimeout(() => {
  //     axios.get(process.env.REACT_APP_SERVER_URL)
  //       .then(res => {
  //         context.setLoading(false)
  //         if (res.data === "live") {
  //           console.log("Server is Live")
  //           clearTimeout(request)
  //           navigate("/")
  //         }
  //         else {
  //           console.log("Server is", res.data)
  //           // checkServer()
  //         }
  //       })
  //       .catch(res => {
  //         // checkServer()
  //       })
  //   }, 10000)
  // }

  useEffect(() => {
    // checkServer()
    return () => {
      clearTimeout(request)
    }
  }, [])

  return (
    <Layout>
      <div className='w-screen h-screen flex items-center justify-center bg-gradient-to-r from-white flex-col to-app-primary-light comming-container'>
        <img src={CorePage} className='w-20 sm:w-48 animate-bounce' alt='logo' />
        <h1 className='text-2xl sm:text-5xl font-bold text-white capitalize text-center px-2 sm:px-12'><p className='name'>NFT-CITY</p> Server is on Maintain, please try again later...</h1>
      </div>
    </Layout>
  )
}


export default CommingSoonPage