import React, { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Navbar from './components/header/Navbar'
import axios from './utilities/axios'
import { ToastContainer } from 'react-toastify'

function App() {
    React.useEffect(() => {
        axios.get("/token").then((response) => {
            console.log(response.data);
            console.log(response.status);
            console.log(response.statusText);
            console.log(response.headers);
            console.log(response.config);
        });
    }, [])
    return (
        <>
            <ToastContainer containerId={1} />
            <div className='w-screen h-screen'>
                <Navbar />
            </div>
        </>
    )
}

export default App
