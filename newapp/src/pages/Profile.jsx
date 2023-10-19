import React, { useEffect } from 'react';
import axios_api from '../utilities/axios';

import { useState } from 'react';

const Profile = () => {
	const [userProfile, setUserProfile] = useState({})

	function handleHome() {
		location.assign("/");
	}

	useEffect(() => {
		axios_api.get("/users/me")
			.then(function (response) {
				console.log("[DEBUG]" + response.data);
				console.log(response.data);
				setUserProfile(response.data);
			}).catch(function (error) {
				console.log("[DEBUG] recv error: ", error)
			});

	}, [])

	return (
		<div className='h-screen items-center justify-center flex'>
			<a href="#" className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
				<h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{userProfile.full_name}</h5>
				<h6 className="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">{userProfile.username}</h6>
				<p className="font-normal text-gray-700 dark:text-gray-400">Email: {userProfile.email}</p>
				<p className="font-normal text-gray-700 dark:text-gray-400">Public Keys E: {userProfile.public_key_e}</p>
				<p className="font-normal text-gray-700 dark:text-gray-400">Public Keys N: {userProfile.public_key_n}</p>

				<button onClick={(event) => { location.assign("edit-profile") }} type="button" class="focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900">Edit Profile</button>
				<br/>
				<button 
						onClick={(e) => {location.assign("/") }}
						className="mt-2 focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900">
							Home
				</button>
			
			</a>
			

		</div>

	)
}

export default Profile




