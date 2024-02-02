import { useState, useEffect } from 'react'
import { API_URL } from '../api';

export default function Trending() {

    const [products, setProducts] = useState([]);

    useEffect(() => {
        // Fetch data from your Django API endpoint here
        fetch(API_URL + "/pillows/")
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
        <section aria-labelledby="trending-heading" className="bg-[#e0e0e0]">
                <div className="mt-32 rounded-lg mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:pt-32">
                    <div className="md:flex md:items-center md:justify-between">
                    <h2 id="favorites-heading" className="text-2xl font-bold tracking-tight text-gray-900">
                        Trending Products
                    </h2>
                    <a href="/products" className="hidden text-sm font-medium text-indigo-600 hover:text-indigo-500 md:block">
                        Shop the collection
                        <span aria-hidden="true"> &rarr;</span>
                    </a>
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-4 md:gap-y-0 lg:gap-x-8">
                    {products.map((product) => (
                        <div key={product.id} className="group relative">
                        <div className="h-56 w-full overflow-hidden rounded-md group-hover:opacity-75 lg:h-72 xl:h-80">
                            <img
                            src={product.imageSrc}
                            alt={product.imageAlt}
                            className="h-full w-full object-cover object-center"
                            />
                        </div>
                        <h3 className="mt-4 text-sm text-gray-700">
                            <a href={product.href}>
                            <span className="absolute inset-0" />
                            {product.name}
                            </a>
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">{product.color}</p>
                        <p className="mt-1 text-sm font-medium text-gray-900">{product.price}</p>
                        </div>
                    ))}
                    </div>

                    <div className="mt-8 text-sm md:hidden">
                    <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                        Shop the collection
                        <span aria-hidden="true"> &rarr;</span>
                    </a>
                    </div>
                </div>
        </section>
    )
}