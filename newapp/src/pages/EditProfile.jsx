import { formToJSON } from "axios";
import axios_api, { baseUrl, setToken } from "../utilities/axios"
import { showAlert } from "../utilities/toast";
import { useMemo, useState } from 'react';
import { useEffect } from 'react';

const EditProfile = () => {
	const [userProfile, setUserProfile] = useState({})
	const [isEdited, setIsEdited] = useState(false)

	function getInitialUserProfile() {
		axios_api.get("/users/me")
			.then(function (response) {
				console.log("[DEBUG]" + response.data);
				console.log(response.data);
				setUserProfile(response.data);
			}).catch(function (error) {
				console.log("[DEBUG] recv error: ", error);
			});
	}

	async function handleSubmit(e) {
		e.preventDefault();

		editProfile(e);
	}

	async function handleCancel(e) {
		e.preventDefault();
		location.assign("/")
	}

	const editProfile = (e) => {
		var json_obj = formToJSON(e.target);
		if(json_obj["new_password"] === "") {
			json_obj["new_password"] = null;
		}
		if(json_obj["otp"] === "") {
			json_obj["otp"] = null;
		}
		
		console.log(json_obj)
		axios_api.post("/users/me/update", json_obj)
			.then(function (response) {
				console.log(response);
				showAlert("Success.. redirecting to dashboard", "success")
				setTimeout(
					() => location.assign("/"),
					1000
				)
				
			}).catch(function (error) {
				showAlert(error.response.data["detail"], "error");
			});
	}

	function handleTextChange(e) {
		e.preventDefault();
		console.log(e.target.id);
		let newUserProfile = {...userProfile};
		console.log(newUserProfile[e.target.id])
		newUserProfile[e.target.id] = e.target.value;
		setUserProfile(newUserProfile);
		setIsEdited(true)
	}


	useEffect(() => {
		getInitialUserProfile();
	}, []);





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
						Edit Your Profile
					</h2>
				</div>

				<div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
					<form className="space-y-6" onSubmit={handleSubmit} method="POST">
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
									value={userProfile?.username}
									disabled
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
								{/* TODO: Add toggle for "keep same as old password" */}
								<label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200">
									New Password
								</label>
							</div>
							<div className="mt-2">
								<input
									id="new_password"
									name="new_password"
									type="password"
									className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
									onChange={handleTextChange}
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
									value={userProfile?.full_name}
									onChange={handleTextChange}
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
									value={userProfile?.email}
									onChange={handleTextChange}
								/>
							</div>
						</div>

				


						<div>
							<div className="flex items-center justify-between">
								<label htmlFor="otp" className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200">
									OTP (if applicable)
								</label>
							</div>
							<div className="mt-2">
								<input

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
								className="flex w-full justify-center rounded-md disabled:bg-gray-600 bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
								disabled={!isEdited}
							>
								Update Profile
							</button>
						</div>

					</form>
					<button 
						onClick={handleCancel}
						className="mt-2 flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
							Cancel
						</button>
				</div>
			</div>
		</>
	)
}

export default EditProfile
