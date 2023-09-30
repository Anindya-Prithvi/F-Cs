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
            <Router>
                <Routes>
                    <Route exact path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="*" element={<Home />} />
                </Routes>
            </Router>
        </>
    )
}

export default App
