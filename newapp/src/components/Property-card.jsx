
// seller_username: str
// address: str
// is_rent: bool
// is_sale: bool
// amenities: List[str]
// bhk: int # BHK
// carpet_area: float
// super_area: float 
// cost: float

import { useState } from "react";
import { ethers } from "ethers";
import axios_api from "../utilities/axios";
import { showAlert } from "../utilities/toast";
import { contractAddress, abiCode } from "../utilities/contractConstants";

const PropertyCard = ({ property }) => {
    const [amenities, setAmenities] = useState(false)
    function showAmenities() {
        setAmenities(!amenities);
    }

    function deleteProperty() {
        console.log("DELETING PROPERTY");

        let propertyId = property._id;

        if (window.ethereum) {
            const provider = new ethers.BrowserProvider(window.ethereum);
            provider.getSigner().then((x) => {
    
                const fcsContract_rw = new ethers.Contract(contractAddress, abiCode, x);
    
                console.log(fcsContract_rw);
                console.log("SIGNER", x)

                const test = fcsContract_rw.delete_property(propertyId).then(() => {
                    console.log("SUCCESS????");
                    showAlert("Uploaded Transaction!!.. Propery Deteled from Chain!", "success");
                    axios_api.get("/delete_property", {params: {property_id: propertyId}}).then(() => {
                        showAlert("Database Updated!", "success");
                    }).catch(() => {
                        showAlert("Couldn't update database but transaction was successful!", "success");
                        console.log("Couldn't update database but transaction was successful!");
                    });
                    setTimeout( () => location.assign("/"), 1000);  
                }).catch((error) => {
                    showAlert("Transacation Failed. Please Try Again!", "failure");
                    console.log(error);
                });
            });
    
        }
    



    }

    return (
        <div className="w-auto p-5 mt-4 ml-4 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
            <a href="#">
                <img className="rounded-t-lg" src="https://images.pexels.com/photos/186077/pexels-photo-186077.jpeg?cs=srgb&dl=pexels-binyamin-mellish-186077.jpg&fm=jpg" alt="" />
            </a>
            <div className="p-5">
                <a href="#">
                    <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{property.address}</h5>
                </a>
                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">BHK: {property.bhk}</p>
                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">Carpet Area: {property.carpet_area}</p>
                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">Super Area: {property.super_area}</p>
                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">Cost: {property.cost}</p>
                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">Property ID: {property._id}</p>
                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">Property Verified: {property.is_verified.toString()}</p>

                <button onClick={showAmenities} className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                    {amenities ? 'Hide' : 'Show'} Amenities
                    <svg className="w-3.5 h-3.5 ml-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
                    </svg>
                </button>
                {/* <br /> */}
                <button onClick={deleteProperty} className="inline-flex items-center m-3 px-3 py-2 text-sm font-medium text-center text-white bg-red-700 rounded-lg hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800">
                    Remove Property
                </button>
                {amenities && <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{property.amenities}</p>}
            </div>
        </div>

    )
}

export default PropertyCard;