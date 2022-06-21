import axios from 'axios';
import React, { useEffect, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import APIkit from '../../components/axios';
import { PrimaryButton } from '../../components/button'
import { InputUnit } from '../../components/input'
import { Notification } from '../../components/notification';
import { useAppContext } from '../../contexts/AppContext';
import Layout from "../../layout/layout";
import { connectWallet } from '../../utils';




const AdminPage = () => {
  const context = useAppContext()
  const navigate = useNavigate()
  const [frame, setFrame] = useState(0) //0: login, 1:register, 2:reset password
  const [name, setName] = useState()
  const [password, setPassword] = useState()


  /**
   * check if there is admin in database
   */
  const checkAdmin = () => {
    axios.get(process.env.REACT_APP_SERVER_URL + "user/admin")
      .then((response) => {
        setFrame(response.data.admin === 0 ? 1 : 2)
      }).catch(response => console.log(response))
  }

  const getProfile = () => {
    APIkit.get(process.env.REACT_APP_SERVER_URL + "auth/profile").then(
      res => {
        context.setUser(res.data)
        navigate("/manage")
      }
    ).catch(res => console.log(res))
  }

  const validate = () => {
    if (context.walletAddress.length < 40) {
      toast.custom(<Notification>Please connect wallet</Notification>, { duration: 1000 })
      return false
    }
    else if (name === undefined || name?.length === 0) {
      toast.custom(<Notification>Please input Name</Notification>, { duration: 1000 })
      return false
    }
    else if (password === undefined || password?.length < 6) {
      toast.custom(<Notification>Password length should be at least 6</Notification>, { duration: 1000 })
      return false
    }
    else
      return true
  }

  const signIn = () => {
    if (validate()) {
      axios({
        method: "POST",
        url: process.env.REACT_APP_SERVER_URL + "auth/login",
        data: {
          username: context.walletAddress,
          password: password
        }
      }).then(
        (response) => {
          APIkit.defaults.headers.common["Authorization"] = 'Bearer ' + response.data.access_token
          localStorage.setItem("token", response.data.access_token)
          getProfile()
        }
      )
        .catch(
          (response) =>
            toast.custom(<Notification type="error">Authentication Failed</Notification>, { duration: 1000 })
        )
    }
  }


  const signUp = () => {
    if (validate()) {
      axios({
        method: "POST",
        url: process.env.REACT_APP_SERVER_URL + "user/create",
        params: {
          wallet: context.walletAddress,
          username: name,
          role: "admin",
          password: password
        }
      })
        .then(
          (response) => {
            console.log("created", response)
            setFrame(2)
          })
        .catch(
          (response) => console.log("error", response)
        )
    }
  }

  const handleConnectWallet = async () => {
    if (context.status !== 1) {
      const walletResponse = await connectWallet();
      context.setStatus(walletResponse.status);
      context.setWallet(walletResponse.address);
    }
    else {
      toast.custom(<Notification>Wallet Already Connected</Notification>, { duration: 1000 })
    }
  }

  const ConnectButton = () => {
    return (
      <PrimaryButton className="mt-6" onClick={() => handleConnectWallet()}>Connect Wallet</PrimaryButton>
    )
  }

  useEffect(() => {
    checkAdmin()
  }, [])

  return (
    <Layout>
      <div className='login-container h-screen w-full'>
        <Toaster position="bottom-right" />
        <div className='bg-app-primary flex items-center justify-center bg-opacity-70 w-full h-full px-4 flex-col'>
          {frame === 2 && <div className='sm:w-1/2 mg:w-1/3 xl:w-1/4  font-bold text-white text-center flex flex-col gap-2'>
            <h1 className='text-5xl'>NFT-CITY Admin</h1>
            <InputUnit type="text" label="User Name" value={name} setValue={setName} validate={{ require: true }} placeholder="User Name" />
            <InputUnit type="password" label="Password" value={password} setValue={setPassword} validate={{ require: true, length: 6 }} placeholder="Password" />

            {context.walletAddress.length > 40 ? <InputUnit type="text" disabled={true} label="Wallet address" value={context.walletAddress.substring(0, 10) + " · · · · · " + context.walletAddress.substring(40)} setValue={() => { }} validate={{ require: true }} placeholder="Wallet address" /> : <ConnectButton />}
            <PrimaryButton className="text-lg uppercase w-full mt-8" onClick={() => signIn()}>log in</PrimaryButton>
          </div>}
          {frame === 1 && <div className='sm:w-1/2 mg:w-1/3 xl:w-1/4  font-bold text-white text-center flex flex-col gap-2'>
            <h1 className='text-5xl'>NFT-CITY Admin</h1>
            <p>Create Admin</p>
            <InputUnit type="text" label="User Name" value={name} setValue={setName} validate={{ require: true }} placeholder="User Name" />
            {/* <InputUnit type="text" label="User Name" value={email} setValue={setEmail} validate={{ require: true }} placeholder="User Name" /> */}
            <InputUnit type="password" label="Password" value={password} setValue={setPassword} validate={{ require: true, length: 6 }} placeholder="Password" />
            {context.walletAddress.length > 40 ? <InputUnit type="text" disabled={true} label="Wallet address" value={context.walletAddress.substring(0, 10) + " · · · · · " + context.walletAddress.substring(40)} setValue={() => { }} validate={{ require: true }} placeholder="Wallet address" /> : <ConnectButton />}
            <PrimaryButton className="text-lg uppercase w-full mt-8" onClick={() => signUp()}>Sign Up</PrimaryButton>
          </div>}
          {/* {error?.error && <p className='text-red-500 font-semibold'>{error.error}</p>} */}
        </div>
      </div>
    </Layout>
  )
}

export default AdminPage