import React, { useState } from "react";
import { faExpand, faTools, faUser, faWallet, faXmark, faXmarkCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useLocation, useNavigate } from "react-router-dom";
import CorePage from '../../assets/icons/logo.png'
import SmallLogo from '../../assets/icons/logo_nft_city.png'
import { SideMenuButton } from "../../components/button";
import { menuList } from "./menu";
import { useAppContext } from "../../contexts/AppContext";
const Navbar = (props) => {
  const context = useAppContext()
  const location = useLocation()
  const [expand, setExpand] = useState(false)
  const navigate = useNavigate()
  const handleNavigate = (path) => {
    navigate(path)
  }


  const connectHandler = async () => {
    if (context.onBoard !== null) {
      if (!(await context.onBoard.walletSelect())) {
        return;
      }
      context.setConnected(await context.onBoard.walletCheck())
      localStorage.setItem('rg_connect', true)
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

 

  const sliceAddress = (val) => {
    return val.slice(0, 5) + '...' + val.slice(-4)
  }

  const handleConnectDisconnect = async () => {
    if (!context.connected) {
      await connectHandler();
    } else {
      logout();
    }
  }


  // console.log("double kill",route.path)

  return (
    <div className="w-full px-1 bg-black justify-between h-14 fixed top-0 left-0 z-50 flex">
      <div className="flex flex-row justify-between w-full px-2 sm:px-8">
        <div className="flex-col items-center justify-center text-white w-48 hidden sm:flex">
          <a href="http://nft-city.io/">
            <img src={CorePage} alt="core page" />
          </a>
        </div>
        <div className="flex flex-col items-center justify-center text-white w-14 sm:hidden">
          <a href="http://nft-city.io/">
            <img src={SmallLogo} alt="sm logo" />
          </a>
        </div>
        <div className="flex flex-row gap-1 items-center text-white">
          <SideMenuButton onClick={() => setExpand(!expand)} className="sm:hidden">
            <FontAwesomeIcon icon={faExpand} className="text-app-primary-light" />
          </SideMenuButton>
          {menuList.map((menu, idx) => (
            <Link to={menu.path} className={`cursor-pointer py-1 mx-4 ${location.pathname === menu.path ? "border-b-2" : "opacity-60"}`} key={idx}>
              <SideMenuButton menu={menu} onClick={() => handleNavigate(menu.path)}  className="sm:hidden">
                <FontAwesomeIcon icon={menu.icon} />
              </SideMenuButton>
              <p className={`font-bold text-xl hidden sm:block`}>{menu.label}</p>
            </Link>
          ))}
          <div className="ml-20">
            {
              context.connected && context.walletAddress ?
                <div className="btn-connect flex items-center justify-between">
                  <span className="mr-2">{sliceAddress(context.walletAddress)}</span>
                  <span className="cursor-pointer" onClick={handleConnectDisconnect}>
                    <FontAwesomeIcon icon={faXmarkCircle} className="text-app-primary-light" size="2x" />
                  </span>
                </div>
                :
                <button
                  id="btn-wallet-connect"
                  className="btn-connect cursor-pointer px-6 py-2 rounded-full border-app-primary-light border hover:scale-105 active:scale-95 transform"
                  onClick={handleConnectDisconnect}
                >
                  <span className="text-secondary tracking-wider font-recoleta-bold">Connect</span>
                </button>
            }
          </div>
          {context.isOwner && <div className="cursor-pointer" onClick={() => handleNavigate("/manage")}>
            <SideMenuButton menu={{ path: "/manage" }} >
              <FontAwesomeIcon icon={faTools} />
            </SideMenuButton>
          </div>}
        </div>
      </div>
      <div className={`h-screen flex transform tarnsform ${expand ? "tarnsform translate-x-0 " : "-translate-x-full"} duration-200 absolute left-0 w-screen bg-black sm:max-w-30`}>
        <div className="flex flex-col justify-between relative w-full">
          {expand && <button className="absolute right-2 top-4" onClick={() => setExpand(false)}>
            <FontAwesomeIcon icon={faXmark} className="w-9 text-white" size="1x" />
          </button>}
          <div className="flex flex-col justify-between pt-8 pb-4 h-full">
            <div className="flex flex-col gap-1 items-start px-6 text-white uppercase font-bold">
              <div className="flex items-center gap-4 cursor-pointer" onClick={() => setExpand(!expand)}>
                <SideMenuButton>
                  <FontAwesomeIcon icon={faExpand} className="text-app-primary-light" />
                </SideMenuButton>
                <p className="text-app-primary-light">toggle menu</p>
              </div>
              <div className="flex flex-col gap-3 mt-2">
                {menuList.map((menu, idx) => (
                  <div className="flex items-center gap-4 cursor-pointer" onClick={() => handleNavigate(menu.path)} key={idx}>
                    <SideMenuButton menu={menu} >
                      <FontAwesomeIcon icon={menu.icon} />
                    </SideMenuButton>
                    <p className="text-white">{menu.label}</p>
                  </div>
                ))}

              </div>
              <div className="flex items-center gap-4 cursor-pointer" onClick={
                () => connectHandler()
              } >
                <SideMenuButton menu={{ path: "/signin" }}>
                  <FontAwesomeIcon icon={faWallet} alt="login" />
                </SideMenuButton>
                <p className="text-white">Connect wallet</p>
              </div>
              <div className="flex items-center gap-4 cursor-pointer" onClick={() => handleNavigate("/manage")}>
                <SideMenuButton menu={{ path: "/manage" }} >
                  <FontAwesomeIcon icon={faTools} />
                </SideMenuButton>
                <p className="text-white">Manage</p>
              </div>
            </div>
            <div className="flex flex-col items-start justify-center text-white gap-3 px-6">
              <a href="http://nft-city.io/" className="flex gap-4 items-center uppercase font-bold" >
                <div className="transform hover:scale-125 duration-100">
                  <img src={CorePage} alt="core page" className="w-9 h-9" />
                </div>
                <p className="text-white">back to website</p>
              </a>
              <div className="flex items-center gap-4 cursor-pointer" onClick={() => handleNavigate("/admin")}>
                <SideMenuButton menu={{ path: "/admin" }} >
                  <FontAwesomeIcon icon={faUser} />
                </SideMenuButton>
                <p className="text-white">Login</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Navbar