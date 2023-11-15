import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { MetaMaskProvider } from '@metamask/sdk-react';

ReactDOM.createRoot(document.getElementById('root')).render(
    <MetaMaskProvider debug={false} sdkOptions={{
        checkInstallationImmediately: true,
        dappMetadata: {
            name: "F CS",
            url: window.location.host,
        }
    }}>
        <App />
    </MetaMaskProvider>
)
