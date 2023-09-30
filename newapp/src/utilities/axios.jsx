import axios_base from "axios";
import { showAlert } from "../utilities/toast"

export const baseUrl = (process.env.APIloc || "https://192.168.2.233:8000") + "/api/v1"

const axios = axios_base.create({
    baseURL: baseUrl
})

if (sessionStorage.getItem("token"))
    axios.defaults.headers.common['Authorization'] = "Token " + sessionStorage.getItem("token");

export const setToken = (access_token) => {
    axios.defaults.headers.common['Authorization'] = "Token " + access_token;
    sessionStorage.setItem("token", access_token)
}

axios.interceptors.response.use(function (response) {
    return response;
}, function (error) {
    console.log("[DEBUG], got triggered" + error)

    if (error.response.status === 500)
        showAlert(
            "Unexpected error occurred. Please contact us if you see this message repeatedly.",
            "error"
        )
    else if (error.response.status === 401) {
        showAlert(
            "Authentication error",
            "error"
        )
        //TODO: set logout
        setLoggedOut()
    }
    else {
        console.log("[DEBUG]; executing showalert")
        showAlert("See for yourself: " + error.response.status, "error")
    }

    return Promise.reject(error);
});

export default axios