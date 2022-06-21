import React, { createContext, useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { nft_city_abi } from '../utils/abi/abi-citytoken';
import { CONTRACT_ADDRESS_TOKEN } from '../utils/address';
import { ChainID, getOnBoard, getWeb3, initNotify } from '../utils/wallet';

export const AppContext = createContext();

const AppContextProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [user, setUser] = useState()
  const [setting, setSetting] = useState()
  const [cityContract, setCityContract] = useState(null)


  const [onBoard, setOnBoard] = useState(null)
  const [notify, setNotify] = useState(null)
  const [wallet, setWallet] = useState(null)
  const [address, setAddress] = useState("");
  const [unitCost, setUnitCost] = useState(null)
  const [web3, setWeb3] = useState(null)
  const [connected, setConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState(null)
  const [isOwner, setIsOwner] = useState(false)

  useEffect(() => {
    setWeb3(window.__web3 || null);
    setOnBoard(window.__onBoard || null);
    setWalletAddress(window.__walletAddress || null);
    setConnected(window.__connected || false);
  }, []);

  useEffect(() => {
    window.__web3 = web3;
  }, [web3]);
  useEffect(() => {
    window.__onBoard = onBoard;
  }, [onBoard]);
  useEffect(() => {
    window.__walletAddress = walletAddress;
  }, [walletAddress]);
  useEffect(() => {
    window.__connected = connected;
  }, [connected]);

  useEffect(() => {
    const addressAvailable = () => {
      if (walletAddress) {
        return;
      }

      if (web3 && web3.currentProvider && web3.currentProvider.selectedAddress &&
        (web3.currentProvider.selectedAddress.length > 0)) {
        setWalletAddress(web3.currentProvider.selectedAddress);
      } else {
        setTimeout(addressAvailable, 100);
      }
    }

    if (web3) {
      addressAvailable();
    }
    setNotify(initNotify())
  }, [web3, walletAddress]);

  useEffect(() => {
    const walletInitialize = async () => {
      const _web3 = await getWeb3()
      const _onBoard = await getOnBoard()
      const _chainId = await _web3.eth.getChainId()
      const _address = await _web3.eth.getAccounts()

      setWeb3(_web3)
      setOnBoard(_onBoard)

      const connectStatus = localStorage.getItem('rg_connect')
      if (connectStatus === null || connectStatus === 'true') {
        if (_address[0] && _chainId === ChainID)
          setConnected(true)
        setWalletAddress(_address[0])
      }
    }

    const logout = () => {
      if (onBoard != null) {
        onBoard.walletReset();
      }
      setWalletAddress(null);
      setConnected(false)
      localStorage.setItem('rg_connect', false)
    }

    const handleNetworkChange = (networkId) => {
      logout();
      if (networkId !== '0x1') {
        // displayNotify("warning", "You've just changed the Ethereum network! The app will not function properly if you selected the wrong network.")
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


  /**
   * check if current user is owner
   */
  useEffect(() => {
    const checkOwner = async () => {
      const owner = await cityContract.methods.owner().call()
      setIsOwner(walletAddress === owner)
    }
    if (cityContract) {
      checkOwner()
    }
  }, [cityContract, walletAddress])




  useEffect(() => {
    if (connected && web3) {
      const _NftCityContract = new web3.eth.Contract(nft_city_abi, CONTRACT_ADDRESS_TOKEN)
      setCityContract(_NftCityContract)
    }
  }, [connected, web3])






  /**
   * fetch base price from contract once every 15 sec.
   */

  useEffect(() => {
    const fetchUnitCost = async () => {
      // const basePrice = await context.cityContract.methods._basePrice().call()
      const basePrice = "16000000000000000"
      setUnitCost(web3.utils.fromWei(basePrice, 'ether'))
    }
    if (connected && cityContract && web3)
      fetchUnitCost()
  }, [connected, cityContract, web3])

  return (
    <AppContext.Provider
      value={{
        loading,
        setLoading,
        address,
        setAddress,
        status,
        setStatus,
        user,
        setUser,
        isOwner,
        setIsOwner,
        setting,
        setSetting,
        cityContract,
        setCityContract,
        onBoard,
        setOnBoard,
        notify,
        setNotify,
        wallet,
        setWallet,
        web3,
        setWeb3,
        unitCost,
        setUnitCost,
        connected,
        setConnected,
        walletAddress,
        setWalletAddress
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

AppContextProvider.propTypes = {
  children: PropTypes.object,
};

export default AppContextProvider;
export const useAppContext = () => useContext(AppContext);