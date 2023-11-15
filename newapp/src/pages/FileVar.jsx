import React, { useState } from 'react';
import axios_api from '../utilities/axios';
import forge from 'node-forge';

function FileVar() {
  const [file, setFile] = useState(null);
  const [d, setD] = useState('');
  const [n, setN] = useState('');

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
  };

  const handleGenerateSignature = async () => {
    if (!file || !d || !n) {
      alert('Please fill in all fields.');
      return;
    }

    const reader = new FileReader();

    reader.onload = async () => {
      const data = new Uint8Array(reader.result);
      console.log(data);
      const hashedData = await hashData(data);
      const signature = generateSignature(hashedData, d, n);

      const requestData = {
        file: file,
        signature: signature,
      };

      console.log("file", requestData.file)

      axios_api.post('/verify_upload_file', requestData)
        .then((response) => {
          console.log('Signature sent to the backend:', response.data);
        })
        .catch((error) => {
          console.log("file???????", requestData.file)
          console.error('Error sending signature to the backend:', error);
        });
    };

    reader.readAsArrayBuffer(file);
  };

  const hashData = async (data) => {
    console.log(data)
    const md = forge.md.sha256.create();
    md.update(forge.util.createBuffer(data));
    console.log(md.digest().toHex());
    return md.digest().toHex();
  };

  const generateSignature = (hashedData, d, n) => {
    const privateExponent = BigInt(d);
    const modulus = BigInt(n);

    const hashInt = BigInt('0x' + hashedData);
    const signature = (hashInt ** privateExponent) % modulus;
    // console.log("sig", signature);
    // const integerValue = parseInt(signature, 16);
    console.log("sig in int", signature.toString().slice(0, signature.length)); // This will output the integer value

    return signature.toString().slice(0, signature.length);
  };

  return (
    <div>
      <h1>eSIGN</h1>
      <input type="file" onChange={handleFileChange} />
      <input type="text" placeholder="d" value={d} onChange={(e) => setD(e.target.value)} />
      <input type="text" placeholder="n" value={n} onChange={(e) => setN(e.target.value)} />
      <button onClick={handleGenerateSignature}>Generate and Send Signature</button>
    </div>
  );
}

export default FileVar;













// import React, { useState } from 'react';
// import axios_api from '../utilities/axios';

// function FileVar() {
//   const [file, setFile] = useState(null);
//   const [d, setD] = useState('');
//   const [n, setN] = useState('');

//   const handleFileChange = (event) => {
//     const selectedFile = event.target.files[0];
//     setFile(selectedFile);
//   };

//   const handleGenerateSignature = async () => {
//     if (!file || !d || !n) {
//       alert('Please fill in all fields.');
//       return;
//     }

//     const reader = new FileReader();

//     reader.onload = async () => {
//       const data = reader.result;
//       const hashedData = await hashData(data);
//       const signature = generateSignature(hashedData, d, n);

//       const requestData = {
//         file: file,
//         signature: signature,
//       };

//       console.log(requestData)

      
//       axios_api.post('/verify_upload_file', requestData)
//         .then((response) => {
//           console.log('Signature sent to the backend:', response.data);
//         })
//         .catch((error) => {
//           console.error('Error sending signature to the backend:', error);
//         });
//     };

//     reader.readAsArrayBuffer(file);
//   };

//   const hashData = async (data) => {
//     const arrayBuffer = await crypto.subtle.digest('SHA-256', data);
//     return new Uint8Array(arrayBuffer);
//   };

//   const generateSignature = (hashedData, d, n) => {
//     const privateExponent = BigInt(d);
//     const modulus = BigInt(n);

//     const hashInt = BigInt('0x' + Buffer.from(hashedData).toString('hex'));
//     const signature = hashInt ** privateExponent % modulus;
//     return signature.toString();
//   };

//   return (
//     <div>
//       <h1>eSIGN</h1>
//       <input type="file" onChange={handleFileChange} />
//       <input type="text" placeholder="d" value={d} onChange={(e) => setD(e.target.value)} />
//       <input type="text" placeholder="n" value={n} onChange={(e) => setN(e.target.value)} />
//       <button onClick={handleGenerateSignature}>Generate and Send Signature</button>
//     </div>
//   );
// }

// export default FileVar;
















// import React from 'react'

// const FileVar = () => {
//   return (
//     <div className='h-screen'>
//         BuyProperty
// 	  Jello world
//     </div>
//   )
// }

// export default FileVar

// import React, { useState } from 'react';
// import forge from 'node-forge';
// import axios from 'axios';
// import { JSEncrypt } from "jsencrypt";

// function mod_exp(x, y, p) {
//   let result = 1;
//   x = x % p;
  
//   while (y > 0) {
//     if (y % 2 === 1) {
//       result = (result * x) % p;
//     }
//     y = Math.floor(y / 2);
//     x = (x * x) % p;
//   }
  
//   return result;
// }


// const FileVar = () => {
//   const [file, setFile] = useState(null);
//   const [privateKey, setPrivateKey] = useState(''); // Store the RSA private key
//   const [signature, setSignature] = useState('');

//   const handleFileChange = (e) => {
//     const selectedFile = e.target.files[0];
//     setFile(selectedFile);
//   };

//   const handlePrivateKeyChange = (e) => {
//     setPrivateKey(e.target.value);
//   };

//   const handleUpload = async () => {
//     if (!file) {
//       alert('Please select a file first.');
//       return;
//     }

//     try {
//       // Calculate the hash of the file
//       if (!privateKey) {
//         alert('Please enter an RSA Private Key.');
//         return;
//       }
//       const fileReader = new FileReader();
//       fileReader.onload = async (e) => {
//         const fileData = e.target.result;


//         const fileHash = forge.md.sha256.create();
//         fileHash.update(fileData);
//         const fileHashHex = fileHash.digest().toHex();

//         console.log("hash: ", fileHashHex);
        
//         const ee = 29;
//         const d = 19;
//         const n = 551;
//         const signature = mod_exp(parseInt(fileHashHex, 16), d, n);

//         console.log("sig: ", signature);

//         const inthashval = parseInt(fileHashHex, 16);
//         console.log(inthashval);
//         const original_hash = mod_exp(signature, ee, n)
//         console.log("verify: ", original_hash)

//         // const privateKeyCopy = privateKey
//         // // Sign the hash with the RSA private key
//         // const privateKey1 = forge.pki.privateKeyFromPem(privateKeyCopy);
//         // const md = forge.md.sha256.create();
//         // md.update(fileHashHex, 'utf8');
//         // const signature = privateKey1.sign(md);

//         // // Convert the signature to a string (e.g., base64)
//         // const signatureBase64 = forge.util.encode64(signature);

//         // // Send both the file and signature to the backend
//         // const formData = new FormData();
//         // formData.append('file', file);
//         // formData.append('signature', signatureBase64);


//         // const fileHash = CryptoJS.SHA256(fileData).toString();

//         // // Encrypt the hash with the private key
//         // const privateKeyObj = new TextEncoder().encode(privateKey);
//         // const encryptedArrayBuffer = await crypto.subtle.encrypt(
//         //   {
//         //     name: 'RSA-OAEP',
//         //   },
//         //   privateKeyObj,
//         //   new TextEncoder().encode(fileHash)
//         // );

//         // // Convert the encrypted data to a Base64-encoded string
//         // const encryptedHash = btoa(String.fromCharCode.apply(null, new Uint8Array(encryptedArrayBuffer)));

//         // // Send both the file and encrypted hash to the backend
//         // const formData = new FormData();
//         // formData.append('file', file);
//         // formData.append('encryptedHash', encryptedHash);


//         // formto
//         // Perform the HTTP POST request to your backend here
//         // const response = await fetch('YOUR_BACKEND_API_URL', {
//         //   method: 'POST',
//         //   body: formData,
//         // });

//         // if (response.ok) {
//         //   // Handle a successful response from the backend
//         //   // For example, you can display a success message
//         //   console.log('Upload successful');
//         // } else {
//         //   // Handle errors from the backend
//         //   console.error('Error:', response.statusText);
//         // }
//         const response = await axios.post('/verify_upload_file', formData);

//         if (response.status === 200) {
//           console.log('Upload successful');
//         } else {
//           console.error('Error:', response.statusText);
//         }

//         // Clear the form after upload
//         // setFile(null);
//         setPrivateKey('');
//         setSignature('');
//       };
//       fileReader.readAsArrayBuffer(file);
//     } catch (error) {
//       console.error('Error:', error);
//     }
//   };

//   return (
//     <div>
//       <script src="https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.9-1/crypto-js.js"></script>
//       <h2>File Upload, Hashing, and RSA Signature</h2>
//       <input type="file" onChange={handleFileChange} />
//       <br />
//       <input
//         type="text"
//         placeholder="Enter RSA Private Key"
//         value={privateKey}
//         onChange={handlePrivateKeyChange}
//         style={{ color: 'black' }}
//       />
//       <br />
//       <button onClick={handleUpload}>Upload, Hash, and Sign</button>
//     </div>
//   );
// };

// export default FileVar;
