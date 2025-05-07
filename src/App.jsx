import './App.css'
import React, { lazy, Suspense } from 'react';
import Authenctication from './pages/auth/authentication'
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import Header from './components/header/Header';
import { Provider } from 'react-redux';
import appStore from './utils/appStore';

const SinglePersonChat = lazy(() => import('./components/single_person_chat/single-person-chat'))
const RoomChat = lazy(() => import('./components/room_chat/room-chat'))
const Wall = lazy(() => import('./components/wall/wall'))
const WorldChat = lazy(() => import('./components/world_chat/world-chat'))
const Profile = lazy(() => import('./components/profile/profile'))

const AppLayout = () => {
  return (
    <div className="container">
      <div className="main">
        <Provider store={appStore}>
          <Header />
          <div className="auth-main">
            <Outlet />
          </div>
        </Provider>
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
          element: <Suspense> <SinglePersonChat /></Suspense>,
        },
        {
          path: "/room",
          element: <Suspense><RoomChat /></Suspense>,
        },
        {
          path: "/world-chat",
          element: <Suspense> <WorldChat /></Suspense>,
        },
        {
          path: "/wall",
          element: <Suspense> <Wall /></Suspense>,
        },
        {
          path: "/profile",
          element: <Suspense> <Profile /></Suspense>,
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
