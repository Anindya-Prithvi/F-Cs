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

import React, { useState } from 'react';
import forge from 'node-forge';
import axios from 'axios'

const FileVar = () => {
  const [file, setFile] = useState(null);
  const [privateKey, setPrivateKey] = useState(''); // Store the RSA private key
  const [signature, setSignature] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const handlePrivateKeyChange = (e) => {
    setPrivateKey(e.target.value);
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Please select a file first.');
      return;
    }

    try {
      // Calculate the hash of the file
      if (!privateKey) {
        alert('Please enter an RSA Private Key.');
        return;
      }
      const fileReader = new FileReader();
      fileReader.onload = async (e) => {
        const fileData = e.target.result;
        const fileHash = forge.md.sha256.create();
        fileHash.update(fileData);
        const fileHashHex = fileHash.digest().toHex();
        const privateKeyCopy = privateKey
        // Sign the hash with the RSA private key
        const privateKey = forge.pki.privateKeyFromPem(privateKeyCopy);
        const md = forge.md.sha256.create();
        md.update(fileHashHex, 'utf8');
        const signature = privateKey.sign(md);

        // Convert the signature to a string (e.g., base64)
        const signatureBase64 = forge.util.encode64(signature);

        // Send both the file and signature to the backend
        const formData = new FormData();
        formData.append('file', file);
        formData.append('signature', signatureBase64);

        // Perform the HTTP POST request to your backend here
        // const response = await fetch('YOUR_BACKEND_API_URL', {
        //   method: 'POST',
        //   body: formData,
        // });

        // if (response.ok) {
        //   // Handle a successful response from the backend
        //   // For example, you can display a success message
        //   console.log('Upload successful');
        // } else {
        //   // Handle errors from the backend
        //   console.error('Error:', response.statusText);
        // }
        const response = await axios.post('/verify_upload_file', formData);

        if (response.status === 200) {
          console.log('Upload successful');
        } else {
          console.error('Error:', response.statusText);
        }

        // Clear the form after upload
        setFile(null);
        setPrivateKey('');
        setSignature('');
      };
      fileReader.readAsArrayBuffer(file);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <h2>File Upload, Hashing, and RSA Signature</h2>
      <input type="file" onChange={handleFileChange} />
      <br />
      <input
        type="text"
        placeholder="Enter RSA Private Key"
        value={privateKey}
        onChange={handlePrivateKeyChange}
        style={{ color: 'black' }}
      />
      <br />
      <button onClick={handleUpload}>Upload, Hash, and Sign</button>
    </div>
  );
};

export default FileVar;
