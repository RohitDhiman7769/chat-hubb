import { useState } from 'react'
import './App.css'
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Authenctication from './pages/auth/authentication'
import Home from './pages/home/home';
import Login from './components/loginComp';
import SignUp from './components/sign-up';
import ForgetPassword from './components/forgetPassowrd';
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
   {/* <Authenctication /> */}
   <Routes>
   <Route path='/' Component={Home} />
   <Route path='/home' Component={Home} />
   <Route path='/log-in' Component={Authenctication} />
   <Route path='/sign-up' Component={Authenctication} />
   <Route path='/forget-password' Component={Authenctication} />
   </Routes>

    </>
  )
}

export default App
