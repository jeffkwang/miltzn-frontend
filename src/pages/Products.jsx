import React, { useState, useEffect } from 'react';
import { PRODUCTS_API_URL } from '../api'; // Import the API_URL constant

// const products = [
//   {
//     id: 1,
//     name: 'Basic Tee',
//     href: '/products/zip-tote-basket',
//     imageSrc: 'https://tailwindui.com/img/ecommerce-images/product-page-01-related-product-01.jpg',
//     imageAlt: "Front of men's Basic Tee in black.",
//     price: '$35',
//     color: 'Black',
//   },
//   // More products...
// ]

export default function ProductsPage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Fetch data from your Django API endpoint here
    fetch(PRODUCTS_API_URL)
      .then((response) => response.json())
      .then((data) => {
        // Format the data to match the desired format
        const formattedProducts = data.map((item) => ({
          id: item.id,
          name: item.name,
          href: `products/${item.slug}`, // You might need to adjust this URL
          imageSrc: item.images,
          imageAlt: item.name,
          price: `$${item.price}`,
          color: item.color,
        }));
        setProducts(formattedProducts);
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">Everything</h2>

        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {products.map((product) => (
            <div key={product.id} className="group relative">
              <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
                <img
                  src={product.imageSrc}
                  alt={product.imageAlt}
                  className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                />
              </div>
              <div className="mt-4 flex justify-between">
                <div>
                  <h3 className="text-sm text-gray-700">
                    <a href={product.href}>
                      <span aria-hidden="true" className="absolute inset-0" />
                      {product.name}
                    </a>
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">{product.color}</p>
                </div>
                <p className="text-sm font-medium text-gray-900">{product.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
