import React, { useEffect, useState } from 'react'
import './App.css'
import { ToastContainer } from 'react-toastify'
import {
    BrowserRouter as Router,
    Routes,
    Route
} from "react-router-dom";
import Login from './pages/Login'
import Home from './pages/Home'
import ForgotPassword from './pages/ForgotPassword'
import Signup from './pages/Signup';
import { Navigate } from 'react-router-dom/dist'
import { showAlert } from "./utilities/toast"
import Error404 from './pages/Error404';
import BuyProperty from './pages/BuyProperty';
import RentProperty from './pages/RentProperty';
import EnlistProperty from './pages/EnlistProperty';
import FileVar from './pages/FileVar';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import Search from "./pages/Search"
import SettingsPage from './pages/SettingsPage';
import Web3Testpage from './pages/Web3Testpage';





function App() {
    const Redirector = () => {
        if (!sessionStorage.getItem("token")) {
            // TODO CHECK SESSION EXPIRY
            console.log("[DEBUG] No token present")
            if (
                !["/login", "/signup", "/forgot-password"]
                    .includes(window.location.pathname)
            ) {
                showAlert("Please login or signup.", "warning")
                return (
                    <>
                        <Navigate to="/login" replace={true} />
                    </>
                )
            }
        }
    }



    return (
        <>

            <ToastContainer containerId={1} />
            <Router>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="*" element={<Error404 />} />
                    <Route path="/buyproperty" element={<BuyProperty />} />
                    <Route path="/rentproperty" element={<RentProperty />} />
                    <Route path="/enlistproperty" element={<EnlistProperty />} />
                    <Route path="/filevarpath" element={<FileVar />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/edit-profile" element={<EditProfile />} />
                    <Route path="/searchproperty" element={<Search />} />
                    <Route path="/settings" element={<SettingsPage />} />
                    <Route path="/test" element={<Web3Testpage/>}/>
                </Routes>

                <Redirector />
            </Router>
        </>
    )
}

export default App
