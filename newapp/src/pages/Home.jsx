import React from 'react'
import Navbar from "../components/header/Navbar"
import { Router, Navigate } from 'react-router-dom/dist'

const Home = () => {
    if (!sessionStorage.getItem("token")) {
        console.log("[DEBUG] No token present")
        return (
            <>
                <Navigate to="/login" replace={true} />
            </>
        )
    }
    return (
        <div className='w-screen h-screen'>
            <Navbar />
        </div>
    )
}

export default Home