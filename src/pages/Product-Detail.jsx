import { useState, useEffect } from 'react'
import { StarIcon } from '@heroicons/react/20/solid'
import { RadioGroup } from '@headlessui/react'
import { useParams } from 'react-router-dom';
import { handleAddToCart } from '../components/add-to-cart';
import { PRODUCTS_API_URL } from '../api';

// const reviews = { href: '#', average: 4, totalCount: 117 }

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function ProductDetailPage() {
  const [product, setProduct] = useState({});
  const [selectedVariation, setSelectedVariation] = useState({});
  const { name } = useParams();

  useEffect(() => {
    fetch(`${PRODUCTS_API_URL} + ${name}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      console.log("setting product data");
      setProduct(data.items[0]);
      setSelectedVariation(data.items[0].variants[0]);
    })
    .catch(error => {
      console.error('There was a problem fetching the products:', error);
    });
  }, [name]);

  return (
    <div className="bg-white">
      <div className="pt-6">
        <nav aria-label="Breadcrumb">
          <ol role="list" className="mx-auto flex max-w-2xl items-center space-x-2 px-4 sm:px-6 lg:max-w-7xl lg:px-8">
            
              <li key={product.category_name}>
                <div className="flex items-center">
                  <a href={`/products/${product.category_href}`} className="mr-2 text-sm font-medium text-gray-900">
                    {product.category_name}
                  </a>
                  <svg
                    width={16}
                    height={20}
                    viewBox="0 0 16 20"
                    fill="currentColor"
                    aria-hidden="true"
                    className="h-5 w-4 text-gray-300"
                  >
                    <path d="M5.697 4.34L8.98 16.532h1.327L7.025 4.341H5.697z" />
                  </svg>
                </div>
              </li>
            <li className="text-sm">
              <a href={`/products/${product.href}`} aria-current="page" className="font-medium text-gray-500 hover:text-gray-600">
                {product.name}
              </a>
            </li>
          </ol>
        </nav>

        {/* Image gallery */} 
        <div className="mx-auto mt-6 max-w-2xl sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:gap-x-8 lg:px-8">
          <div className="aspect-h-4 aspect-w-3 hidden overflow-hidden rounded-lg lg:block">
          {
            selectedVariation.image_urls && selectedVariation.image_urls.length > 0 ? (
              <img
                src={selectedVariation.image_urls[0]}
                alt={`${product.name} - ${selectedVariation.name}`}
                className="h-full w-full object-cover object-center"
              />
            ) : (
              // Fallback image or placeholder if no image is available
              <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                <span>No image available</span>
              </div>
            )
          }
          </div>
          <div className="hidden lg:grid lg:grid-cols-1 lg:gap-y-8">
            <div className="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg">
            {
              selectedVariation.image_urls && selectedVariation.image_urls.length > 0 ? (
                <img
                  src={selectedVariation.image_urls[0]}
                  alt={`${product.name} - ${selectedVariation.name}`}
                  className="h-full w-full object-cover object-center"
                />
              ) : (
                // Fallback image or placeholder if no image is available
                <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                  <span>No image available</span>
                </div>
              )
            }
            </div>
            <div className="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg">
            {
            selectedVariation.image_urls && selectedVariation.image_urls.length > 0 ? (
              <img
                src={selectedVariation.image_urls[0]}
                alt={`${product.name} - ${selectedVariation.name}`}
                className="h-full w-full object-cover object-center"
              />
            ) : (
              // Fallback image or placeholder if no image is available
              <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                <span>No image available</span>
              </div>
            )
            }
            </div>
          </div>
          <div className="aspect-h-5 aspect-w-4 lg:aspect-h-4 lg:aspect-w-3 sm:overflow-hidden sm:rounded-lg">
          {
            selectedVariation.image_urls && selectedVariation.image_urls.length > 0 ? (
              <img
                src={selectedVariation.image_urls[0]}
                alt={`${product.name} - ${selectedVariation.name}`}
                className="h-full w-full object-cover object-center"
              />
            ) : (
              // Fallback image or placeholder if no image is available
              <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                <span>No image available</span>
              </div>
            )
          }
          </div>
        </div>

        {/* Product info */}
        <div className="mx-auto max-w-2xl px-4 pb-16 pt-10 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:grid-rows-[auto,auto,1fr] lg:gap-x-8 lg:px-8 lg:pb-24 lg:pt-16">
          <div className="lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">{product.name}</h1>
          </div>

          {/* Options */}
          <div className="mt-4 lg:row-span-3 lg:mt-0">
            <h2 className="sr-only">Product information</h2>
            <p className="text-3xl tracking-tight text-gray-900">${selectedVariation.price ? (selectedVariation.price.amount / 100).toFixed(2) : "0.00"}</p>

            {/* Reviews
            <div className="mt-6">
              <h3 className="sr-only">Reviews</h3>
              <div className="flex items-center">
                <div className="flex items-center">
                  {[0, 1, 2, 3, 4].map((rating) => (
                    <StarIcon
                      key={rating}
                      className={classNames(
                        reviews.average > rating ? 'text-gray-900' : 'text-gray-200',
                        'h-5 w-5 flex-shrink-0'
                      )}
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <p className="sr-only">{reviews.average} out of 5 stars</p>
                <a href={reviews.href} className="ml-3 text-sm font-medium text-indigo-600 hover:text-indigo-500">
                  {reviews.totalCount} reviews
                </a>
              </div>
            </div>*/}

            <form className="mt-10">

              {/* Variants */}
              <div className="mt-10">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-900">Size</h3>
                  <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                    Size guide
                  </a>
                </div>

                <RadioGroup value={selectedVariation} onChange={setSelectedVariation} className="mt-4">
                  <RadioGroup.Label className="sr-only">Choose a size</RadioGroup.Label>
                  <div className="grid grid-cols-4 gap-4 sm:grid-cols-8 lg:grid-cols-4">
                    {product.variants && product.variants.map((variant) => (
                      <RadioGroup.Option
                        key={variant.name}
                        value={variant}
                        disabled={!variant.inStock}
                        className={({ active }) =>
                          classNames(
                            variant.inStock
                              ? 'cursor-pointer bg-white text-gray-900 shadow-sm'
                              : 'cursor-not-allowed bg-gray-50 text-gray-200',
                            active ? 'ring-2 ring-indigo-500' : '',
                            'group relative flex items-center justify-center rounded-md border py-3 px-4 text-sm font-medium uppercase hover:bg-gray-50 focus:outline-none sm:flex-1 sm:py-6'
                          )
                        }
                      >
                        {({ active, checked }) => (
                          <>
                            <RadioGroup.Label as="span">{variant.name}</RadioGroup.Label>
                            {variant.inStock ? (
                              <span
                                className={classNames(
                                  active ? 'border' : 'border-2',
                                  checked ? 'border-indigo-500' : 'border-transparent',
                                  'pointer-events-none absolute -inset-px rounded-md'
                                )}
                                aria-hidden="true"
                              />
                            ) : (
                              <span
                                aria-hidden="true"
                                className="pointer-events-none absolute -inset-px rounded-md border-2 border-gray-200"
                              >
                                <svg
                                  className="absolute inset-0 h-full w-full stroke-2 text-gray-200"
                                  viewBox="0 0 100 100"
                                  preserveAspectRatio="none"
                                  stroke="currentColor"
                                >
                                  <line x1={0} y1={100} x2={100} y2={0} vectorEffect="non-scaling-stroke" />
                                </svg>
                              </span>
                            )}
                          </>
                        )}
                      </RadioGroup.Option>
                    ))}
                  </div>
                </RadioGroup>
                    </div>

              <button
                type="button"
                onClick={() => handleAddToCart(product, selectedVariation)}
                className="mt-10 flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Add to bag
              </button>
            </form>
          </div>

          <div className="py-10 lg:col-span-2 lg:col-start-1 lg:border-r lg:border-gray-200 lg:pb-16 lg:pr-8 lg:pt-6">
            {/* Description and details */}
            <div>
              <h3 className="sr-only">Description</h3>

              <div className="space-y-6">
                <p className="text-base text-gray-900">{product.description}</p>
              </div>
            </div>

            <div className="mt-10">
              <h3 className="text-sm font-medium text-gray-900">Highlights</h3>
              <div className="mt-4">
                <ul role="list" className="list-disc space-y-2 pl-4 text-sm">
                  {product.highlights && product.highlights.map((highlight) => (
                    <li key={highlight} className="text-gray-400">
                      <span className="text-gray-600">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-10">
              <h2 className="text-sm font-medium text-gray-900">Details</h2>

              <div className="mt-4 space-y-6">
                <p className="text-sm text-gray-600">{product.details}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
