import { useEffect, useState } from 'react'
import './App.css'
import React from 'react';
import { Route, Router, Routes } from 'react-router-dom';
import Authenctication from './pages/auth/authentication'
import Home from './pages/home/home';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";




function App() {
  const isLoggedIn = localStorage.getItem('user_id')
  console.log(isLoggedIn)

  const router = createBrowserRouter([
    {
      path: "/",
      element : isLoggedIn ? <Home/> : <Authenctication/> ,
    },
    {
      path: "/room",
      element : isLoggedIn ? <Home/> : <Authenctication/> ,
    },
    {
      path: "/log-in",
      element :  <Authenctication/> ,
    },
    {
      path: "/sign-up",
      element :  <Authenctication/> ,
    },
    {
      path: "/forget-password",
      element : <Authenctication/> ,
    },
    {
      path: "/home",
      element : isLoggedIn ? <Home/> : <Authenctication/> ,
    },
    {
      path: "/world-chat",
      element : isLoggedIn ? <Home/> : <Authenctication/> ,
    },
    {
      path: "/wall",
      element : isLoggedIn ? <Home/> : <Authenctication/> ,
    },
    {
      path: "/profile",
      element : isLoggedIn ? <Home/> : <Authenctication/> ,
    },
    
  ]);
  return (
      <RouterProvider router={router} />

  )
}

export default App
