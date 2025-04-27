import { useEffect, useState } from 'react'
import './App.css'
import React from 'react';
import { Route, Router, Routes } from 'react-router-dom';
import Authenctication from './pages/auth/authentication'
import Home from './pages/home/home';



function App() {
  const isLoggedIn = localStorage.getItem('user_id')
  return (
      <Routes>
        <Route exact path='/' element={isLoggedIn ? <Home/> : <Authenctication/> } />
        <Route path='/room' element={isLoggedIn ? <Home/> : <Authenctication/> } />
        <Route path='/log-in' Component={Authenctication} />
        <Route path='/sign-up' Component={Authenctication} />
        <Route path='/forget-password' Component={Authenctication} />
        <Route path='/home' element={isLoggedIn ? <Home/> : <Authenctication/> } />
        <Route path='/world-chat' element={isLoggedIn ? <Home/> : <Authenctication/> } />
        <Route path='/wall' element={isLoggedIn ? <Home/> : <Authenctication/> } />
        <Route path='/profile' element={isLoggedIn ? <Home/> : <Authenctication/> } />
      </Routes>

  )
}

export default App
