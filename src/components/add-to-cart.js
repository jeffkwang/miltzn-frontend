import { setCookie, getCookie, areCookiesEnabled } from './cookieutils';

// Function to add a product to the cart
export function addToCart(productData) {
    let cart = JSON.parse(getCookie('cart')) || [];
    cart.push(productData);
    setCookie('cart', JSON.stringify(cart), 7);
    
    window.dispatchEvent(new Event('cartUpdated'));
    window.dispatchEvent(new Event('cartChanged'));
}

// Function to check if a product is not in the cart
export function notInCart(productData) {
    let cart = JSON.parse(getCookie('cart')) || [];
    return !cart.some(item => 
        item.slug === productData.slug &&
        item.price === productData.price);
        // Add other product identifiers here
    }

// Function to increment the quantity of a product in the cart
export function incrementQty(productData) {
    let cart = JSON.parse(getCookie('cart')) || [];
    console.log((productData));
    let productFound = false;

    cart = cart.map(item => {
        // Check if the current item in the cart matches the productData
        if ((item.id === productData.id || item.id === productData.slug) &&
            item.color === productData.color
            // Add other product identifiers here
        ) {
            item.qty = (item.qty || 1) + 1; // Increment the quantity
            productFound = true;
        }
        return item;
    });

    // If the product was not found in the cart, add it with a quantity of 1
    if (!productFound) {
        console.log('the item is not in the cart!')
    }

    setCookie('cart', JSON.stringify(cart), 7); // Update the cart cookie
    window.dispatchEvent(new Event('cartUpdated'));
    window.dispatchEvent(new Event('cartChanged'));
}

export function decrementQty(productData) {
  let cart = JSON.parse(getCookie('cart')) || [];
  let productFound = false;

  cart = cart.reduce((newCart, item) => {
      // Check if the current item in the cart matches the productData
      if ((item.id === productData.id || item.id === productData.slug) &&
          item.color === productData.color) {
          productFound = true;
          if (item.qty > 1) {
              item.qty -= 1; // Decrement the quantity
              newCart.push(item); // Add the updated item to the new cart
          }
          // If qty is 1, it gets removed and not added back to newCart
      } else {
          newCart.push(item); // Add other items to the new cart
      }
      return newCart; // Return the accumulated cart for the next iteration
  }, []); // Start with an empty array as the initial value for newCart

  if (!productFound) {
      console.log('the item is not in the cart!');
  }

  setCookie('cart', JSON.stringify(cart), 7); // Update the cart cookie
  window.dispatchEvent(new Event('cartUpdated'));
  window.dispatchEvent(new Event('cartChanged'));
}


export function handleAddToCart(product, slug, selectedColor) {
    return () => {  
      const productData = {
        slug: slug,
        name: product.name,
        images: product.images[0].src,
        price: product.price,
        color: selectedColor['name'],
        qty: 1,
      };
  
      if (notInCart(productData)) {
        addToCart(productData);
        console.log('Product added to cart!');
      } else {
        incrementQty(productData);
        console.log('Product quantity incremented in cart!');
      }
    };
  }