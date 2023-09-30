import axios_base from "axios";
import { showAlert } from "../utilities/toast"

export const baseUrl = process.env.APIloc || "https://192.168.2.233:8000"
export const baseApi = baseUrl + "/api/v1"

const axios_api = axios_base.create({
    baseURL: baseApi
})

if (sessionStorage.getItem("token"))
    axios_api.defaults.headers.common['Authorization'] = "Token " + sessionStorage.getItem("token");

export const setToken = (access_token) => {
    axios_api.defaults.headers.common['Authorization'] = "Token " + access_token;
    sessionStorage.setItem("token", access_token)
}

// axios_api.interceptors.response.use(function (response) {
//     return response;
// }, function (error) {
//     console.log("[DEBUG], got triggered" + error)

//     if (error.response.status === 500)
//         showAlert(
//             "Unexpected error occurred. Please contact us if you see this message repeatedly.",
//             "error"
//         )
//     else if (error.response.status === 401) {
//         showAlert(
//             "Authentication error",
//             "error"
//         )
//         //TODO: set logout
//         setLoggedOut()
//     }
//     else {
//         console.log("[DEBUG]; some error occured" + error)
//         showAlert("See for yourself: " + error.response.data["detail"], "error")
//     }

//     return Promise.reject(error);
// });

export default axios_api