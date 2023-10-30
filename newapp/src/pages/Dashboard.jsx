import React, { useEffect, useState } from 'react';
import PropertyCard from '../components/Property-card';
import { Tilt } from "react-tilt";
import axios_api from '../utilities/axios';

const Dashboard = () => {

	const [temp_array, set_temp_array] = useState([])

	useEffect(() => {
		axios_api.get("/list_user_properties").then((value) => {
			set_temp_array(value.data["documents"])
		}).catch(function (error) {
			console.log("[DEBUG] recv error: ", error)
			var emsg = error.message
			if (error.response != undefined) {
				emsg = error.response.data["detail"]
			}
			showAlert(emsg, "error");
		});

	}, [])

	return (
		<>
			<div className="grid grid-cols-2 md:grid-cols-3 gap-1 ">
				{temp_array.map((property) => (
					<div key={property.address}>
						<Tilt options={{
							max: 25,
							scale: 1,
							speed: 0.1,
							reverse: true,
							easing: "cubic-bezier(.03,.98,.52,.99)"
						}}
							className='bg-tertiary  w-full'
						><PropertyCard className="h-auto max-w-full rounded-lg" property={property} /></Tilt> </div>
				))}


			</div>

		</>
	)
}


export default Dashboard