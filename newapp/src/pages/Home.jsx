import React from 'react'
import Navbar from "../components/header/Navbar"
import axios_api from '../utilities/axios';

const Home = () => {
    const dummyreq = (e) => {
        // e.preventDefault();
        axios_api.get("/status")
            .then(function (response) {
                console.log("[DEBUG]" + response);
            }).catch(function (error) {
                console.log("[DEBUG] recv error: ", error)
            });
    }
    return (
        <>
            <div className='w-screen h-screen'>
                <Navbar />
                <button type='button' className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded-full" onClick={dummyreq}>
                    RED BUTTON!
                </button>
            </div>
        </>

    )
}

export default Home