import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import 'blaze-slider/dist/blaze.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Helmet } from 'react-helmet';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(

    <QueryClientProvider client={queryClient}>
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

      <script>
      {`
        !function(e){if(!window.pintrk){window.pintrk = function () {
        window.pintrk.queue.push(Array.prototype.slice.call(arguments))};var
          n=window.pintrk;n.queue=[],n.version="3.0";var
          t=document.createElement("script");t.async=!0,t.src=e;var
          r=document.getElementsByTagName("script")[0];
          r.parentNode.insertBefore(t,r)}}("https://s.pinimg.com/ct/core.js");
        pintrk('load', '2612570807376', {em: '<user_email_address>'});
        pintrk('page');
      `}
      </script>
      <noscript>
        {`
        <img height="1" width="1" style="display:none;" alt=""
        src="https://ct.pinterest.com/v3/?event=init&tid=2612570807376&pd[em]=<hashed_email_address>&noscript=1" />
        `}
      </noscript>
    </Helmet>
    
    <App />
    </QueryClientProvider>
    
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
