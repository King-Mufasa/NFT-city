import React, { useState } from 'react'
import { PrimaryButton } from '../../components/button'
import { InputUnit } from '../../components/input'
import Layout from '../../layout/layout'
import "./login.scss"
const LoginPage = () => {
  const [frame, setFrame] = useState(0) //0: login, 1:register, 2:reset password
  const [email, setEmail] = useState()
  const [password, setPassword] = useState()
  const [confirm, setConfirm] = useState()
  const [userName, setUserName] = useState()
  const [firstName, setFirstName] = useState()
  const [lastName, setLastName] = useState()
  return (
    <Layout>
      <div className='login-container h-screen w-full'>
        <div className='bg-app-primary flex items-center justify-center bg-opacity-70 w-full h-full px-4'>
          {frame === 0 && <div className='sm:w-1/2 mg:w-1/3 xl:w-1/4  font-bold text-white text-center flex flex-col gap-2'>
            <p className='capitalize text-xl'>Welcome to the nft city project</p>
            <h1 className='text-5xl'>LOGIN</h1>
            <InputUnit type="text" label="Email address" value={email} setValue={setEmail} validate={{ require: true }} placeholder="Email address"/>
            <InputUnit type="password" label="Password" value={password} setValue={setPassword} validate={{ require: true, length: 6 }} placeholder="Password"/>
            <PrimaryButton className="text-lg uppercase w-full mt-8">log in</PrimaryButton>
            <div className='flex justify-between underline'>
              <button className='font-semibold' onClick={() => setFrame(2)}>Forgot password?</button>
              <button className='font-semibold' onClick={() => setFrame(1)}>Sign up</button>
            </div>
          </div>}
          {
            frame === 1 && <div className='sm:w-1/2 mg:w-1/3 xl:w-1/4  font-bold text-white text-center gap-2 flex flex-col'>
              <p className='capitalize text-xl'>Welcome to the nft city project</p>
              <h1 className='text-5xl'>REGISTER</h1>
              <InputUnit type="text" label="Username" value={userName} setValue={setUserName} validate={{ require: true }} placeholder="Username"/>
              <InputUnit type="text" label="First name" value={firstName} setValue={setFirstName} validate={{ require: true }} placeholder="First name"/>
              <InputUnit type="text" label="Last name" value={lastName} setValue={setLastName} validate={{ require: true }} placeholder="Last name"/>
              <InputUnit type="text" label="Email address" value={email} setValue={setEmail} validate={{ require: true }} placeholder="Email address"/>
              <div>
                <InputUnit type="password" label="Password" value={password} setValue={setPassword} validate={{ require: true }} placeholder="Password"/>
                <p className='text-left leading-4 text-sm'>Passwords must be at least 8 characters with one uppercase letter, one number, and one special character.</p>
              </div>
              <InputUnit type="password" label="Confirm password" value={confirm} setValue={setConfirm} validate={{ require: true }} placeholder="Confirm password"/>
              <PrimaryButton className="text-lg uppercase w-full mt-8">register</PrimaryButton>
              <div className='flex justify-between underline'>
                <button className='font-semibold' onClick={() => setFrame(2)}>Forgot password?</button>
                <button className='font-semibold' onClick={() => setFrame(0)}>login</button>
              </div>
            </div>
          }{
            frame === 2 && <div className='sm:w-1/2 mg:w-1/3 xl:w-1/4  font-bold text-white text-center flex flex-col gap-2'>
              <h1 className='text-5xl uppercase whit'>reset password</h1>
              <p className='capitalize text-sm'>Enter your email address and we'll send you a link to get back into your account.</p>
              <InputUnit type="text" label="Email address" value={email} setValue={setEmail} validate={{ require: true }} placeholder="Email address"/>
              <PrimaryButton className="text-lg uppercase w-full mt-8">reset</PrimaryButton>
              <div className='flex justify-between underline'>
                <button className='font-semibold' onClick={() => setFrame(1)}>Sign up</button>
                <button className='font-semibold' onClick={() => setFrame(0)}>Login</button>
              </div>
            </div>
          }
        </div>
      </div>
    </Layout>
  )
}
export default LoginPage