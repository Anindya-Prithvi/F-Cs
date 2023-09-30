import React from 'react'
import axios from '../utilities/axios';

const Login = () => {
    React.useEffect(() => {
        axios.get("/token").then((response) => {
            console.log(response.data);
            console.log(response.status);
            console.log(response.statusText);
            console.log(response.headers);
            console.log(response.config);
        });
    }, [])
    return (
        <>
            <div>Loginpage</div>
            <h1>YOKHOSO</h1>
        </>
    )
}

export default Login