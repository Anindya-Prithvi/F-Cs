import axios_api, { baseUrl, setToken } from "../utilities/axios"
import { showAlert } from "../utilities/toast";

import { UserDetailsContext } from "../UserDetailsContext";
import { useContext } from "react";

/*
  This example requires some changes to your config:
  
  ```
  // tailwind.config.js
  module.exports = {
    // ...
    plugins: [
      // ...
      require('@tailwindcss/forms'),
    ],
  }
  ```
*/
export default function Login() {
    const {currentUser, setCurrentUser} = useContext(UserDetailsContext);
    console.log("AASDASDASD",useContext(UserDetailsContext) )

    const signin = (e) => {
        e.preventDefault();
        var username = e.target.username.value;
        var password = e.target.password.value;
        var credsobj = new FormData();
        credsobj.append("username", username)
        credsobj.append("password", password)
        axios_api.post("/token", credsobj)
            .then(function (response) {
                console.log("[DEBUG]" + response);
                setToken(response.data["access_token"])

                console.log("BEFORE CURRENT", currentUser);
                
                axios_api.get("/users/me")
                .then(function (response) {
                    console.log("[DEBUG]", response.data);
                    console.log("USER RESPONSE", response.data);
                    setCurrentUser(response.data);
                    console.log("AFTER CURRENT", currentUser);
                    console.log("AAAA", currentUser, setCurrentUser)
                    

                }).then(() => {
                    console.log("AFTER CURRENT222", currentUser);
                    setTimeout(() => {
    
                        location.assign("/")
                    }, 20000);
                    
                }).catch(function (error) {
                    console.log("[DEBUG] recv error: ", error)
                    // setCurrentUser(null)
                });

                // setTimeout(() => {
                //     location.assign("/")
                // }, 20000);
                
            }).catch(function (error) {
                console.log("[DEBUG] recv error: ", error)
                var emsg = error.message
                if (error.response != undefined) {
                    emsg = error.response.data["detail"]
                }
                showAlert(emsg, "error");
                console.log(currentUser)
            });
    }
    return (
        <>
            {/*
          This example requires updating your template:
  
          ```
          <html class="h-full bg-white">
          <body class="h-full">
          ```
        */}
            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <img
                        className="mx-auto h-10 w-auto"
                        src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                        alt="Your Company"
                    />
                    <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 dark:text-gray-200">
                        Sign in to your account
                    </h2>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form className="space-y-6" onSubmit={signin} method="POST">
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200">
                                Username
                            </label>
                            <div className="mt-2">
                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    autoComplete="username"
                                    required
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200">
                                    Password
                                </label>
                            </div>
                            <div className="mt-2">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
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
                                Sign in
                            </button>
                        </div>

                        <div className="text-sm">
                            <a href="/forgor-password" className="font-semibold text-indigo-600 hover:text-indigo-500">
                                Forgot password?
                            </a>
                        </div>
                    </form>

                    <p className="mt-10 text-center text-sm text-gray-500">
                        Not a member?{' '}
                        <a href="/signup" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                            Signup
                        </a>
                    </p>
                </div>
            </div>
        </>
    )
}
