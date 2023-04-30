import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from "react-router-dom";
import { configureChains, mainnet, WagmiConfig, createClient } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import reportWebVitals from './reportWebVitals';

const { provider, webSocketProvider } = configureChains(
  [mainnet],
  [publicProvider()]
);

const client = createClient({
  autoConnect: true,
  provider,
  webSocketProvider
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <WagmiConfig client={client} >
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </WagmiConfig>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
