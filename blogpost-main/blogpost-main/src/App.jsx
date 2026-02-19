import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import AuthGuard from './auth/AuthGuard'
import { ToastContainer } from "react-toastify";
import CreatePost from "./pages/CreatePost";
import PostDetails from "./pages/PostDetails";
import Analytics from "./pages/Analytics";

const DefaultRoute = () => {
  const loginData = JSON.parse(localStorage.getItem("loginData"));
  if (loginData) {
    return <Navigate to="/dashboard" replace />;
  }
  return <Navigate to="/login" replace />;
};

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <DefaultRoute />,
    },
    {
      path: "/login",
      element: <AuthGuard required ={false}><Login /></AuthGuard>,
    },
    {
      path: "/register",
      element: <AuthGuard required ={false}><Register /></AuthGuard>,
    },
    {
      path: "/dashboard",
      element: <AuthGuard required ={true}><Dashboard /></AuthGuard>,
    },
    {
      path: "/creat-post",
      element: <AuthGuard required ={true}><CreatePost /></AuthGuard>,
    },
    {
      path: "/edit-post/:id",
      element: <AuthGuard required ={true}><CreatePost /></AuthGuard>,
    },
    {
      path: "/post/:id",
      element: <AuthGuard><PostDetails /></AuthGuard>,
    },
    {
      path: "/analytics",
      element: <AuthGuard required ={true}><Analytics /></AuthGuard>
    }
  ]);

  return (
    <>
      <RouterProvider router={router} />
      
      <ToastContainer
        position="top-right"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}

export default App;
