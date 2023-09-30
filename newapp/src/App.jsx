import React from 'react'
import './App.css'
import Navbar from './components/header/Navbar'
import axios from './utilities/axios'
import { ToastContainer } from 'react-toastify'
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";
import Login from './pages/Login'
import Home from './pages/Home'
import ForgotPassword from './pages/ForgotPassword'

function App() {
    return (
        <>
            <ToastContainer containerId={1} />
            <Router>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    {/* <Route path="/forgor-password" element={<ForgotPassword />} /> */}
                    <Route path="*" element={<Home />} />
                </Routes>
            </Router>
        </>
    )
}

export default App
