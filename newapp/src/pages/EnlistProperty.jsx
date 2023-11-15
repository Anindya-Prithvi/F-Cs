import React, { useEffect, useState } from 'react'
import { formToJSON } from "axios";
import axios_api from '../utilities/axios';
import { ethers } from 'ethers';
import { abiCode, contractAddress } from '../utilities/contractConstants';
import { showAlert } from '../utilities/toast';

const uploadProperty = (propertyPrice, properyHmac, propertyId) => {

    if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        provider.getSigner().then((x) => {

            const fcsContract_rw = new ethers.Contract(contractAddress, abiCode, x);

            console.log(fcsContract_rw);
            console.log("SIGNER", x)

            const test = fcsContract_rw.enlistProperty(propertyPrice, properyHmac, propertyId).then((x) => {
                console.log("SUCCESS????");
                console.log(x);
                showAlert("Uploaded Transaction!!.. redirecting to dashboard", "success");
                setTimeout( () => location.assign("/"), 1000);  
                }).catch((x) => {
                    console.log(x);
                });
        });

    }

};

const EnlistProperty = () => {

    const [userProfile, setUserProfile] = useState({});

    function getInitialUserProfile() {
        axios_api.get("/users/me")
            .then(function (response) {
                console.log("[DEBUG]" + response.data);
                console.log(response.data);
                setUserProfile(response.data);
            }).catch(function (error) {
                console.log("[DEBUG] recv error: ", error)
            });
    }


    useEffect(() => {
        getInitialUserProfile();
    }, []);

    const propertyStructure = { "address": "text", "amenities": "text", "bhk": "number", "carpet_area": "number", "super_area": "number", "cost": "number" };

    const [propertFile, setPropertyFile] = useState(null);

    const enlistProperty = (e) => {
        e.preventDefault();
        var json_obj = formToJSON(e.target);
        json_obj["amenities"] = [json_obj["amenities"]];

        if (json_obj["rent_sale"] == "is_rent") {
            json_obj["is_sale"] = false;
            json_obj["is_rent"] = true;
        } else {
            json_obj["is_sale"] = true;
            json_obj["is_rent"] = false;
        }
        
        if (json_obj["otp"] === "") {   
            delete json_obj["otp"];
        }

        delete json_obj["rent_sale"];
        delete json_obj["property_document"];

        let data = new FormData();
        json_obj["seller_username"] = userProfile["username"];
        // data.append('property', JSON.stringify(json_obj));


        axios_api.post('/add_property', json_obj)
            .then(function (response) {
                console.log(response);
                let propertyId = response.data["property_id"];
                console.log("PROPERTY ID", response.data["property_id"]);
                let document_data = new FormData();
                // document_data.append('property_id', property_id);
                document_data.append('property_documents', propertFile);
                axios_api.post("/add_property_document", document_data, {params: {property_id: propertyId}}).then(function (response) {
                    showAlert("Success.. redirecting to dashboard", "success");
                    // TODO: Upload to blockchain!
                    console.log(json_obj["cost"], "0x"+response.data["hmac"], propertyId);
                    uploadProperty(json_obj["cost"], "0x"+response.data["hmac"], propertyId);
                    // location.assign("/")
                }).catch(function (error) { 
                    console.log(error);
                    // showAlert(error.response.data["detail"], "error"); 
                });

            })
            .catch(function (error) {
                console.log(error);
                showAlert(error.response.data["detail"], "error");
            });

    }


    const handleFileUpload = (e) => {
        setPropertyFile(e.target.files[0]);
        console.log(e.target.files[0]);
    };





    return (
        <>

            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <img
                        className="mx-auto h-10 w-auto"
                        src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                        alt="F CS"
                    />
                    <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 dark:text-gray-200">
                        Enlist Property
                    </h2>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form className="space-y-6" onSubmit={enlistProperty} method="POST">
                        {Object.entries(propertyStructure).map(([fieldName, fieldType]) => {
                            return (<div key={fieldName}>
                                <label htmlFor={fieldName} className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200">
                                    {fieldName}
                                </label>
                                <div className="mt-2">
                                    <input
                                        id={fieldName}
                                        name={fieldName}
                                        // value={propertyDetails[fieldName]}
                                        // onChange={handleTextChange}
                                        type={fieldType}
                                        required
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>);

                        })}


                        <div class="flex items-center mb-4">
                            <input id="is_rent" type="radio" value="is_rent" name="rent_sale" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                            <label for="is_rent" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Rent</label>
                        </div>
                        <div class="flex items-center">
                            <input checked id="is_sale" type="radio" value="is_sale" name="rent_sale" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                            <label for="is_sale" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Sale</label>
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="otp" className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200">
                                    OTP (if applicable)
                                </label>
                            </div>
                            <div className="mt-2">
                                <input
                                    id="otp"
                                    name="otp"
                                    type="number"
                                    autoComplete="otp"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                Add Property!
                            </button>
                        </div>

                        {/* upload file div */}

                        <div>
                            <input type="file" id="property_document" name="property_document" onChange={handleFileUpload} />
                        </div>



                    </form>

                </div>
            </div>
        </>
    )
}



export default EnlistProperty
