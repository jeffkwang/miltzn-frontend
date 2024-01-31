import { getCookie } from './cookieutils'
import { CHECKOUT_API_URL } from '../api';

async function initiateCheckout(event) {
    event.preventDefault();
    
    try {
      const cart = getCookie('cart');
  
      // Replace `API_URL` with the actual API URL of your Django backend
      const response = await fetch(`${CHECKOUT_API_URL}`, {
        // const response = await fetch(`http://127.0.0.1:8000/checkout/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: cart,
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();
  
      return data.checkout_url;
    } catch (error) {
      console.error('Error initiating checkout:', error);
    }
  }

export { initiateCheckout };
