import React, { useState } from 'react'
import { showAlert } from '../utilities/toast';
import axios_api from '../utilities/axios';
import Authqrcode from '../components/Authqrcode';

const SettingsPage = () => {
    const kycvify = (e) => {
        e.preventDefault();
        axios_api.post("/kyc", e.target)
            .then(function (response) {
                console.log("[DEBUG]" + response);
                if (response.data["status"] == "success") {
                    showAlert("KYCied!!", "success");
                } else {
                    showAlert("Not KYCied :<", "error");
                }
            }).catch(function (error) {
                console.log("[DEBUG] recv error: ", error)
                var emsg = error.message
                if (error.response != undefined) {
                    emsg = error.response.data["detail"]
                }
                showAlert(emsg, "error");
            });
    }

    const [qr, setqr] = useState(false);
    const [qrurl, setqrurl] = useState("");

    const enableauthenticator = (e) => {
        e.preventDefault();
        console.log("Button was clicked");
        axios_api.get("/otp/add2FA")
            .then(function (response) {
                console.log("[DEBUG]" + response);
                showAlert("Please scan using an Authenticator app", "success");
                setqr(true);
                setqrurl(response.data["url"]);
            }).catch(function (error) {
                if (error.response.status = 418) {
                    showAlert("Already set up. Disable to renew", "error");
                }
            });
    }


    return (<div>
        <button
            onClick={(e) => { location.assign("/") }}
            className="mt-2 focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900">
            Home
        </button>
        <div className='h-screen items-center justify-center flex'>
            <div class="h-56 grid grid-cols-2 gap-4 content-center">
                <div>
                    <div className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                        <a href="/api/v1/otp/disable2FA" className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                            Disable2FA
                        </a>

                        <div class="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                            <form className="space-y-6" onSubmit={kycvify} method="POST">
                                <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Verify your KYC</h5>
                                <div>
                                    <label htmlFor="kyc_email" className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200">
                                        kyc email
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            id="kyc_email"
                                            name="kyc_email"
                                            type="text"
                                            autoComplete="kyc_email"
                                            required
                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="kyc_password" className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200">
                                        kyc password
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            id="kyc_password"
                                            name="kyc_password"
                                            type="password"
                                            autoComplete="kyc_password"
                                            required
                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        />
                                    </div>
                                </div>
                                <button type="submit" className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                                    Submit
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
                <div>
                    <div className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                        <button onClick={enableauthenticator} className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                            Enable OTP Auth
                        </button>

                        {qr && <Authqrcode qrurl={qrurl} />}
                    </div>
                </div>
            </div>
        </div>
    </div>
    )
}

export default SettingsPage