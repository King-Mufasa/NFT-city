import React, { createContext, useState, useContext } from 'react';
import PropTypes from 'prop-types';

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