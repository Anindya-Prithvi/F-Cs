import React from 'react'
import Navbar from "../components/header/Navbar"
import axios_api from '../utilities/axios';
import BuyProperty from './BuyProperty';
import EnlistProperty from './EnlistProperty';
import RentProperty from './RentProperty';

import { useState } from 'react';
import Dashboard from './Dashboard';
import SearchProperty from './Search';


function renderComponent(current_value) {
    if (current_value == "Dashboard")
        return <Dashboard />;
    if (current_value == "Buy")
        return <BuyProperty />;
    if (current_value == "Rent")
        return <RentProperty />;
    if (current_value == "Enlist")
        return <EnlistProperty />;
    if (current_value == "Search")
        return <SearchProperty />

    return <></>;
}





const Home = () => {
    const dummyreq = (e) => {
        // e.preventDefault();
        axios_api.get("/status")
            .then(function (response) {
                console.log("[DEBUG]" + response);
            }).catch(function (error) {
                console.log("[DEBUG] recv error: ", error)
            });

    };
    const [isBuyPropertiesVisible, setIsBuyPropertiesVisible] = useState("Dashboard");


    return (
        <>

            <div className='w-auto h-screen'>
                <Navbar
                    isBuyPropertiesVisible={isBuyPropertiesVisible}
                    setIsBuyPropertiesVisible={setIsBuyPropertiesVisible}
                />

                {renderComponent(isBuyPropertiesVisible)}

            </div>

        </>

    )
}

export default Home