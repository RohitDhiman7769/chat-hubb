import { useEffect, useState } from 'react'
import './App.css'
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Authenctication from './pages/auth/authentication'
import Home from './pages/home/home';



function App() {

  return (
    <>
   {/* <Authenctication /> */}
   <Routes>
   <Route path='/' Component={Home} />
   <Route path='/room' Component={Home} />
   <Route path='/log-in' Component={Authenctication} />
   <Route path='/sign-up' Component={Authenctication} />
   <Route path='/forget-password' Component={Authenctication} />
   <Route path='/home' Component={Home} />
   <Route path='/world-chat' Component={Home} />
   <Route path='/wall' Component={Home} />
   <Route path='/profile' Component={Home} />
   {/* <Route path='/forget-password' Component={Home} /> */}
   </Routes>

    </>
  )
}

export default App
