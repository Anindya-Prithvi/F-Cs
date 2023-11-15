import React, { useEffect, useState } from 'react';
import PropertyCard from '../components/Property-card';
import BuyPropertyCard from '../components/Buy-card';
import { Tilt } from "react-tilt";
import axios_api from '../utilities/axios';
import { showAlert } from '../utilities/toast';

const BuyProperty = () => {

	const [temp_array, set_temp_array] = useState([])

	useEffect(() => {
		axios_api.get("/list_properties").then((value) => {
      let verified_props = []
      for (let i = 0; i < value.data["documents"].length; i++) {
        if (value.data["documents"][i].is_verified == true && value.data["documents"][i].is_sale == true) {
          verified_props.push(value.data["documents"][i])
        }
      }
      set_temp_array(verified_props)
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
						><BuyPropertyCard className="h-auto max-w-full rounded-lg" property={property} /></Tilt> </div>
				))}


			</div>

		</>
	)
}


export default BuyProperty