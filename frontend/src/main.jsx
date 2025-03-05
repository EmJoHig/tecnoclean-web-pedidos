import React from 'react'
import { useNavigate } from 'react-router-dom'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { store } from "./redux/store";
import { Provider } from 'react-redux';
import "./index.css";
import "slick-carousel/slick/slick.css";
import { Auth0Provider } from '@auth0/auth0-react'


const domain = import.meta.env.VITE_AUTH0_DOMAIN; // Para Vite
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID; // Para Vite

const onRedirectCallback = (appState) => {
  // const navigate = useNavigate();
  // // navigate(appState?.returnTo || '/home');
  // navigate("/home");
};


const providerConfig = {
  domain: domain,
  clientId: clientId,
  onRedirectCallback,
  authorizationParams: {
    redirect_uri: window.location.origin, 
    audience: "https://tecnoclean/api"
  },
};


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Auth0Provider {...providerConfig}>
      <Provider store={store}>
        <App />
      </Provider>
    </Auth0Provider>
  </React.StrictMode>
  // <React.StrictMode>
  //   <Provider store={store}>
  //     <App />
  //   </Provider>
  // </React.StrictMode>,
)
