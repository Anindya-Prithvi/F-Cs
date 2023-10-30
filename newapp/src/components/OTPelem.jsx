import { useState } from "react";
import axios_api, { baseUrl, setToken } from "../utilities/axios"
import { showAlert } from "../utilities/toast";

const OTPelem = () => {
    const otpsend = (e) => {
        e.preventDefault();
        console.log("[DEBUG] OTP Send triggered");
        axios_api.post("/verifyloginotp", e.target)
            .then(function (response) {
                console.log("[DEBUG]" + response);
                if (response.data["verified"]) {
                    setToken(response.data["newtoken"]["access_token"])
                    location.assign("/")
                } else {
                    showAlert("Wrong OTP", "error")
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
    return (

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form className="space-y-6" onSubmit={otpsend} method="POST">
                <div>
                    <label htmlFor="otp" className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200">
                        OTP
                    </label>
                    <div className="mt-2">
                        <input
                            maxLength={6}
                            id="otp"
                            name="otp"
                            type="number"
                            required
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                    </div>
                </div>

                <div>
                    <button
                        type="submit"
                        className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        Submit OTP
                    </button>
                </div>
            </form>
        </div>


    )
}

export default OTPelem