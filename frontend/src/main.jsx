import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import ReactDom from "react-dom/client"
import { BrowserRouter as Router, RouterProvider, createBrowserRouter } from 'react-router-dom';
import Profile from "./component/Profile.jsx"
import Forget_password  from './component/Forget_password.jsx'

const router= createBrowserRouter([
  {
    path:'/',
    element:<Profile/>,
    children:[
    {  path:"forget",
      element:<Forget_password/>}
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
