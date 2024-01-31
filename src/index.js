import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import 'blaze-slider/dist/blaze.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Helmet } from 'react-helmet';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Helmet>
      {/* Default title and meta tags for your entire app */}
      <title>Shop custom tufted goods | Miltzn</title>
      <meta name="description" content="Discover a range of tufted goods at Miltzn Home. If there is something you'd like in particular that we don't have, we can make it for you!" />
      {/* Add more default meta tags or links here */}
      <script async src="https://www.googletagmanager.com/gtag/js?id=G-FNGNDK1TKJ"></script>
      <script>
        
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
  
          gtag('config', 'G-FNGNDK1TKJ');
        `}
        
      </script>
    </Helmet>
    
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
