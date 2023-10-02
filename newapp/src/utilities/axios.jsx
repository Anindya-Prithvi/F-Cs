import axios_base from "axios";
import { showAlert } from "../utilities/toast"

export const baseUrl = process.env.APIloc || "https://192.168.2.233:8000"
export const baseApi = baseUrl + "/api/v1"
export const setLoggedOut = () => {
    localStorage.clear()
    sessionStorage.clear()
    location.assign("/login")
}

const axios_api = axios_base.create({
    baseURL: baseApi
})

if (sessionStorage.getItem("token"))
    axios_api.defaults.headers.common['Authorization'] = "Bearer " + sessionStorage.getItem("token");

export const setToken = (access_token) => {
    axios_api.defaults.headers.common['Authorization'] = "Bearer " + access_token;
    sessionStorage.setItem("token", access_token)
}

axios_api.interceptors.response.use(function (response) {
    return response;
}, function (error) {
    console.log("[DEBUG], axios interceptor got triggered")
    console.log(error)
    if (error.response.status === 500)
        showAlert(
            "Unexpected error occurred. Please contact us if you see this message repeatedly.",
            "error"
        )
    else if (error.response.status === 401) {
        showAlert(
            "Authentication error. Please relogin",
            "error"
        )
        setLoggedOut()
    }
    else {
        console.log("[DEBUG] some error occured:" + error)
        throw error;
    }

    return Promise.reject(error);
});

export default axios_api