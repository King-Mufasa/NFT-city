import React, { useEffect, useState } from 'react'
import { Helmet } from "react-helmet";
import Navbar from './navbar';
import Loading from "react-fullscreen-loading";
import "./layout.scss"
import { useAppContext } from '../contexts/AppContext';
import  { Toaster } from 'react-hot-toast';
import axios from 'axios';
import { ChainID, getOnBoard, getWeb3, initNotify } from '../utils/wallet';
import { nft_city_abi } from '../utils/abi/abi-citytoken';
import { CONTRACT_ADDRESS_TOKEN } from '../utils/address';
import { useNavigate } from 'react-router-dom';
require('dotenv').config()

const Layout = ({
  children,
  title = "NFT City",
}) => {
  const context = useAppContext()
  const navigate = useNavigate()
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

  useEffect(() => {
    context.setWeb3(window.__web3 || null);
    context.setOnBoard(window.__onBoard || null);
    context.setWalletAddress(window.__walletAddress || null);
    context.setConnected(window.__connected || false);
  }, []);

  useEffect(() => {
    window.__web3 = context.web3;
  }, [context.web3]);
  useEffect(() => {
    window.__onBoard = context.onBoard;
  }, [context.onBoard]);
  useEffect(() => {
    window.__walletAddress = context.walletAddress;
  }, [context.walletAddress]);
  useEffect(() => {
    window.__connected = context.connected;
  }, [context.connected]);

  useEffect(() => {
    const addressAvailable = () => {
      if (context.walletAddress) {
        return;
      }

      if (context.web3 && context.web3.currentProvider && context.web3.currentProvider.selectedAddress &&
        (context.web3.currentProvider.selectedAddress.length > 0)) {
        context.setWalletAddress(context.web3.currentProvider.selectedAddress);
      } else {
        setTimeout(addressAvailable, 100);
      }
    }

    if (context.web3) {
      addressAvailable();
    }
    context.setNotify(initNotify())
  }, [context.web3, context.walletAddress]);

  useEffect(() => {
    const walletInitialize = async () => {
      const _web3 = await getWeb3()
      const _onBoard = await getOnBoard()
      const _chainId = await _web3.eth.getChainId()
      const _address = await _web3.eth.getAccounts()

      context.setWeb3(_web3)
      context.setOnBoard(_onBoard)

      const connectStatus = localStorage.getItem('rg_connect')
      if (connectStatus === null || connectStatus === 'true') {
        if (_address[0] && _chainId === ChainID)
          context.setConnected(true)
        context.setWalletAddress(_address[0])
      }
    }

    if (typeof window !== "undefined") {
      if (window.ethereum) {
        window.ethereum.on('chainChanged', handleNetworkChange);
        window.ethereum.on('disconnect', logout);
        window.ethereum.on('accountsChanged', logout);
      }
    }

    walletInitialize()
  }, [])

  useEffect(() => {
    if (context.connected) {
      const _NftCityContract = new context.web3.eth.Contract(nft_city_abi, CONTRACT_ADDRESS_TOKEN)
      context.setCityContract(_NftCityContract)
    }
  }, [context.connected])

  const handleNetworkChange = (networkId) => {
    logout();
    if (networkId !== '0x1') {
      // displayNotify("warning", "You've just changed the Ethereum network! The app will not function properly if you selected the wrong network.")
    }
  }
  
  const logout = () => {
    if (context.onBoard != null) {
      context.onBoard.walletReset();
    }
    context.setWalletAddress(null);
    context.setConnected(false)
    localStorage.setItem('rg_connect', false)
  }


  /**
   * check if current user is owner
   */
  useEffect(() => {
    const checkOwner = async () => {
      const owner = await context.cityContract.methods.owner().call()
      context.setIsOwner(context.walletAddress === owner)
    }

    if (context.cityContract) {
      checkOwner()
    }
  }, [context.cityContract, context.walletAddress])


  /**
   * fetch base price from contract once every 15 sec.
   */

  useEffect(() => {
    const fetchUnitCost = async () => {
      // const basePrice = await context.cityContract.methods._basePrice().call()
      const basePrice = 10000000000000000
      context.setUnitCost(context.web3.utils.fromWei(basePrice, 'ether'))
    }
    if (context.connected && context.cityContract)
      fetchUnitCost()
    setInterval(() => {
      if (context.connected && context.cityContract)
        fetchUnitCost()
    }, 15000)
  }, [context.connected, context.cityContract])

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