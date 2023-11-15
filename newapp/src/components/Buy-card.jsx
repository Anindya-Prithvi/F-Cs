
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
import { showAlert } from "../utilities/toast";
import { ethers } from "ethers";
import { abiCode, contractAddress } from "../utilities/contractConstants";
import axios_api from "../utilities/axios";


const BuyPropertyCard = ({ property }) => {
    const [amenities, setAmenities] = useState(false)
    function showAmenities() {
        setAmenities(!amenities);
    }

    function buyProperty(e, value) {
        e.preventDefault();
        console.log("BUYING PROPERTY");
        // propertyPrice, properyHmac, propertyId
        let propertyPrice = property.cost;
        let properyHmac = property.hmac;
        let propertyId = property._id;
        // TODO: Initiate transaction
        if (window.ethereum) {
            const provider = new ethers.BrowserProvider(window.ethereum);
            provider.getSigner().then((x) => {

                const fcsContract_rw = new ethers.Contract(contractAddress, abiCode, x);

                console.log(fcsContract_rw);
                console.log("SIGNER", x)

                const test = fcsContract_rw.buyProperty(propertyId, { value: propertyPrice }).then((x) => {
                    console.log("SUCCESS????");
                    console.log(x);
                    showAlert("Uploaded Transaction!!.. Updating Database!", "success");
                    axios_api.post("/contract_accepted", { "property_id": propertyId }).then((x) => {
                        showAlert("Database Updated!", "success");
                    }).catch((x) => {
                        showAlert("Couldn't update database but transaction was successful!", "success");
                        console.log("Couldn't update database but transaction was successful!");
                    });
                    // setTimeout(() => location.assign("/"), 1000);
                }).catch((x) => {
                    showAlert("Coudln't buy LOLL", "failure");
                    if(x.toString().includes("Property already sold")) {
                        showAlert("Property already sold!", "failure");
                    }else {
                        showAlert(x.message, "failure");
                    }
                    console.log(x);
                });
            });

        }

        showAlert("LESGOOO", "success")
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
                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">Property Verified: {property.is_verified.toString()}</p>
                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">Property HMAC: {property.hmac}</p>
                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">Property for rent: {property.is_rent.toString()}</p>
                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">Property for sale: {property.is_sale.toString()}</p>

                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse chronological order.</p>
                <button onClick={showAmenities} className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                    {amenities ? 'Hide' : 'Show'} Amenities
                    <svg className="w-3.5 h-3.5 ml-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
                    </svg>
                </button>

                <br />
                {
                    property.contract_accepted ?
                        <button onClick={buyProperty} disabled className="my-3 inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                            Buy
                        </button>
                        :
                        <button onClick={buyProperty} className="my-3 inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                            Buy
                        </button>
                }


                {amenities && <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{property.amenities}</p>}
            </div>
        </div>

    )
}

export default BuyPropertyCard;