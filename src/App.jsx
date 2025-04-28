import './App.css'
import React, {lazy, Suspense} from 'react';
import Authenctication from './pages/auth/authentication'
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import Header from './components/header';

const SinglePersonChat = lazy(()=>import('./components/single-person-chat'))
const RoomChat = lazy(()=>import('./components/room-chat'))
const Wall = lazy(()=>import('./components/Wall'))
const WorldChat = lazy(()=>import('./components/world-chat'))
const Profile = lazy(()=>import('./components/profile'))

const AppLayout = () => {
  return (
    <div className="container">
      <div className="main">
        <Header />
        <div className="auth-main">
          <Outlet />
        </div>
      </div>
    </div>
  )

}

function App() {
  const isLoggedIn = localStorage.getItem('user_id')
  const router = createBrowserRouter([
    {
      path: "/",
      element: isLoggedIn ? <AppLayout /> : <Authenctication />,
      children: [
        {
          path: "/home",
          element:<Suspense> <SinglePersonChat /></Suspense>,
        },
        {
          path: "/room",
          element: <Suspense><RoomChat /></Suspense>,
        },
        {
          path: "/world-chat",
          element:<Suspense> <WorldChat /></Suspense>,
        },
        {
          path: "/wall",
          element:<Suspense> <Wall /></Suspense>,
        },
        {
          path: "/profile",
          element:<Suspense> <Profile /></Suspense>,
        },
      ]
    },
    {
      path: "/log-in",
      element: <Authenctication />,
    },
    {
      path: "/sign-up",
      element: <Authenctication />,
    },
    {
      path: "/forget-password",
      element: <Authenctication />,
    },
  ]);
  return (
    <RouterProvider router={router} />
  )
}

export default App
