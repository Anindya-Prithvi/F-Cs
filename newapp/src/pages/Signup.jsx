import { formToJSON } from "axios";
import axios_api, { baseUrl, setToken } from "../utilities/axios"
import { showAlert } from "../utilities/toast";

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
const Signup = () => {
    const singup = (e) => {
        e.preventDefault();
        var json_obj = formToJSON(e.target)
        console.log(json_obj)
        axios_api.post("/signup", json_obj)
            .then(function (response) {
                console.log(response);
                location.assign("/login")
            }).catch(function (error) {
                showAlert(error.response.data["detail"], "error");
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
                        alt="F CS"
                    />
                    <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 dark:text-gray-200">
                        Sign up to our Escrow Service
                    </h2>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form className="space-y-6" onSubmit={singup} method="POST">
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
                            <div className="flex items-center justify-between">
                                <label htmlFor="full_name" className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200">
                                    Full Name
                                </label>
                            </div>
                            <div className="mt-2">
                                <input
                                    id="full_name"
                                    name="full_name"
                                    type="text"
                                    autoComplete="full_name"
                                    required
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200">
                                    Email Address
                                </label>
                            </div>
                            <div className="mt-2">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
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
                                Sign up
                            </button>
                        </div>

                        <div className="text-sm">
                            Please complete KYC and enable 2FA after signup! 
                        </div>

                        <div className="text-sm">
                            Already a member? 
                            <a href="/login" className="font-semibold text-indigo-600 hover:text-indigo-500">
                                Sign in
                            </a>
                        </div>
                    </form>

    
                </div>
            </div>
        </>
    )
}

export default Signup
