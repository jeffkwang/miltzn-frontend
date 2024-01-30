/*
  This example requires some changes to your config:
  
  ```
  // tailwind.config.js
  module.exports = {
    // ...
    plugins: [
      // ...
      require('@tailwindcss/aspect-ratio'),
    ],
  }
  ```
*/
import { Fragment, useState, useEffect } from 'react'
import { Dialog, Popover, Tab, Transition } from '@headlessui/react'
import { Bars3Icon, HeartIcon, ShoppingBagIcon, UserIcon, XMarkIcon } from '@heroicons/react/24/outline'
import logo from '../assets/img/logos/logo.svg';
import { getCookie, setCookie } from './cookieutils'
import { incrementQty, decrementQty } from '../components/add-to-cart'
import { CHECKOUT_API_URL } from '../api';

const navigation = {
  categories: [
    {
      id: 'Shop',
      name: 'Shop',
      featured: [
        {
          name: 'Tufted Goods',
          href: '/products',
          imageSrc: 'https://images.unsplash.com/photo-1527368746281-798b65e1ac6e?q=80&w=1975&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          imageAlt:
            'Classic storefront',
        },
        {
          name: 'New Arrivals',
          href: '/products',
          imageSrc: 'https://images.unsplash.com/photo-1629949009765-40fc74c9ec21?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          imageAlt: 'Drawstring top with elastic loop closure and textured interior padding.',
        },
        {
          name: 'Wall Art',
          href: '/wallart',
          imageSrc: 'https://images.unsplash.com/photo-1655573537528-8344db4af1f8?q=80&w=1915&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          imageAlt:
            'Three shirts in gray, white, and blue arranged on table with same line drawing of hands and shapes overlapping on front of shirt.',
        },
      ],
      sections: [
        [
          {
            id: 'pillows_cushions',
            name: 'Pillows & Cushions',
            items: [
              { name: 'Pillows', href: '/pillows' },
              { name: 'Floor Cushions', href: '/seatcushions' },
              { name: 'Seat Cushions', href: '/seatcushions' },
            ],
          },
          {
            id: 'collection',
            name: 'Shop Collection',
            items: [
              { name: 'Everything', href: '/products' },
              { name: 'Core', href: '/essential' },
              { name: 'New Arrivals', href: '/products' },
              { name: 'Sale', href: '/sale' },
            ],
          },
        ],
        [
          {
            id: 'decor',
            name: 'Decor',
            items: [
              { name: 'Wall Art', href: '/wallart' },
              { name: 'Rugs', href: '/rugs' }
            ],
          },
        ],
      ],
    },
  ],
  pages: [
    { name: 'Company', href: '/' },
    { name: 'Custom Design', href: '/' },
  ],
}

const products = [
  {
    id: 1,
    name: 'Throwback Hip Bag',
    href: '#',
    color: 'Salmon',
    imageSrc: 'https://tailwindui.com/img/ecommerce-images/shopping-cart-page-04-product-01.jpg',
    imageAlt: 'Salmon orange fabric pouch with match zipper, gray zipper pull, and adjustable hip belt.',
  },
  {
    id: 2,
    name: 'Medium Stuff Satchel',
    href: '#',
    color: 'Blue',
    imageSrc: 'https://tailwindui.com/img/ecommerce-images/shopping-cart-page-04-product-02.jpg',
    imageAlt:
      'Front of satchel with blue canvas body, black straps and handle, drawstring top, and front zipper pouch.',
  },
  // More products...
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

async function initiateCheckout(event) {
  event.preventDefault();
  
  try {
    const cart = getCookie('cart');

    // Replace `API_URL` with the actual API URL of your Django backend
    const response = await fetch(`${CHECKOUT_API_URL}`, {
      // const response = await fetch(`http://127.0.0.1:8000/checkout/`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: cart,
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();

    // Redirect the user to the checkout URL
    window.location.href = data.checkout_url;
  } catch (error) {
    console.error('Error initiating checkout:', error);
  }
}

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [products, setProducts] = useState([]);
  const [cartItemCount, setCartItemCount] = useState(() => {
    // Parse the cart data from the cookie
    const cartData = JSON.parse(getCookie('cart')) || [];
  
    // Calculate the initial count of items in the cart
    const initialItemCount = cartData.reduce((total, item) => total + (item.qty || 1), 0);
  
    // Return this count to initialize the state
    return initialItemCount;
  });
  let totalItemCount = 0;

  const handleCartUpdate = () => {
    const cartData = JSON.parse(getCookie('cart')) || [];

    // Reformat the cart data into the desired format
    const formattedProducts = cartData.map((cartItem) => ({
      id: cartItem.slug, // You can use 'slug' as the id or generate a unique id if needed
      name: cartItem.name,
      href: `/products/${cartItem.slug}`, // You can set the href as needed
      color: cartItem.color, // You can set the color as needed
      imageSrc: cartItem.images,
      imageAlt: cartItem.name,
      qty: cartItem.qty,
    }));

    // Update the 'products' state with the reformatted data
    setProducts(formattedProducts);
  };

  useEffect(() => {
    const handleCartChange = () => {
      const cartData = JSON.parse(getCookie('cart')) || [];

      const newCartItemCount = cartData.reduce((total, item) => total + (item.qty || 1), 0);
  
      setCartItemCount(newCartItemCount);
    };
  
    // Set up event listener
    window.addEventListener('cartChanged', handleCartChange);

    handleCartUpdate();

    // Add event listener
    window.addEventListener('cartUpdated', handleCartUpdate);

    // Cleanup
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
      window.removeEventListener('cartChanged', handleCartChange);
    };
    
  }, []);

  return (
    <div className="bg-white">
      {/* Mobile menu */}
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-40 lg:hidden" onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 z-40 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative flex w-full max-w-xs flex-col overflow-y-auto bg-white pb-12 shadow-xl">
                <div className="flex px-4 pb-2 pt-5">
                  <button
                    type="button"
                    className="-m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400"
                    onClick={() => setOpen(false)}
                  >
                    <span className="sr-only">Close menu</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                {/* Links */}
                <Tab.Group as="div" className="mt-2">
                  <div className="border-b border-gray-200">
                    <Tab.List className="-mb-px flex space-x-8 px-4">
                      {navigation.categories.map((category) => (
                        <Tab
                          key={category.name}
                          className={({ selected }) =>
                            classNames(
                              selected ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-900',
                              'flex-1 whitespace-nowrap border-b-2 px-1 py-4 text-base font-medium'
                            )
                          }
                        >
                          {category.name}
                        </Tab>
                      ))}
                    </Tab.List>
                  </div>
                  <Tab.Panels as={Fragment}>
                    {navigation.categories.map((category) => (
                      <Tab.Panel key={category.name} className="space-y-10 px-4 pb-8 pt-10">
                        <div className="space-y-4">
                          {category.featured.map((item, itemIdx) => (
                            <div
                              key={itemIdx}
                              className="group aspect-h-1 aspect-w-1 relative overflow-hidden rounded-md bg-gray-100"
                            >
                              <img
                                src={item.imageSrc}
                                alt={item.imageAlt}
                                className="object-cover object-center group-hover:opacity-75"
                              />
                              <div className="flex flex-col justify-end">
                                <div className="bg-white bg-opacity-60 p-4 text-base sm:text-sm">
                                  <a href={item.href} className="font-medium text-gray-900">
                                    <span className="absolute inset-0" aria-hidden="true" />
                                    {item.name}
                                  </a>
                                  <p aria-hidden="true" className="mt-0.5 text-gray-700 sm:mt-1">
                                    Shop now
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        {category.sections.map((column, columnIdx) => (
                          <div key={columnIdx} className="space-y-10">
                            {column.map((section) => (
                              <div key={section.name}>
                                <p
                                  id={`${category.id}-${section.id}-heading-mobile`}
                                  className="font-medium text-gray-900"
                                >
                                  {section.name}
                                </p>
                                <ul
                                  role="list"
                                  aria-labelledby={`${category.id}-${section.id}-heading-mobile`}
                                  className="mt-6 flex flex-col space-y-6"
                                >
                                  {section.items.map((item) => (
                                    <li key={item.name} className="flow-root">
                                      <a href={item.href} className="-m-2 block p-2 text-gray-500">
                                        {item.name}
                                      </a>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                        ))}
                      </Tab.Panel>
                    ))}
                  </Tab.Panels>
                </Tab.Group>

                <div className="space-y-6 border-t border-gray-200 px-4 py-6">
                  {navigation.pages.map((page) => (
                    <div key={page.name} className="flow-root">
                      <a href={page.href} className="-m-2 block p-2 font-medium text-gray-900">
                        {page.name}
                      </a>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-200 px-4 py-6">
                  <a href="#" className="-m-2 flex items-center p-2">
                    <img
                      src="https://tailwindui.com/img/flags/flag-canada.svg"
                      alt=""
                      className="block h-auto w-5 flex-shrink-0"
                    />
                    <span className="ml-3 block text-base font-medium text-gray-900">CAD</span>
                    <span className="sr-only">, change currency</span>
                  </a>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      <header className="relative bg-white">
        <nav aria-label="Top" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="border-b border-gray-200 mb-2">
            <div className="flex h-16 items-center justify-between">
              <div className="flex flex-1 items-center lg:hidden">
                <button
                  type="button"
                  className="-ml-2 rounded-md bg-white p-2 text-gray-400"
                  onClick={() => setOpen(true)}
                >
                  <span className="sr-only">Open menu</span>
                  <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                </button>

                <a href="#" className="ml-2 p-2 text-gray-400 hover:text-gray-500">
                  <span className="sr-only">Search</span>
                  <HeartIcon className="h-6 w-6" aria-hidden="true" />
                </a>
              </div>

              {/* Flyout menus */}
              <Popover.Group className="hidden lg:block lg:flex-1 lg:self-stretch">
                <div className="flex h-full space-x-8">
                  {navigation.categories.map((category) => (
                    <Popover key={category.name} className="flex">
                      {({ open }) => (
                        <>
                          <div className="relative flex">
                            <Popover.Button
                              className={classNames(
                                open ? 'text-indigo-600' : 'text-gray-700 hover:text-gray-800',
                                'relative z-10 flex items-center justify-center text-sm font-medium transition-colors duration-200 ease-out'
                              )}
                            >
                              {category.name}
                              <span
                                className={classNames(
                                  open ? 'bg-indigo-600' : '',
                                  'absolute inset-x-0 bottom-0 h-0.5 transition-colors duration-200 ease-out sm:mt-5 sm:translate-y-px sm:transform'
                                )}
                                aria-hidden="true"
                              />
                            </Popover.Button>
                          </div>

                          <Transition
                            as={Fragment}
                            enter="transition ease-out duration-200"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="transition ease-in duration-150"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                          >
                            <Popover.Panel className="absolute inset-x-0 top-full z-[999]">
                              {/* Presentational element used to render the bottom shadow, if we put the shadow on the actual panel it pokes out the top, so we use this shorter element to hide the top of the shadow */}
                              <div className="absolute inset-0 top-1/2 bg-white shadow" aria-hidden="true" />

                              <div className="relative bg-white">
                                <div className="mx-auto max-w-7xl px-8">
                                  <div className="grid grid-cols-2 gap-x-8 gap-y-10 py-16">
                                    <div className="grid grid-cols-2 grid-rows-1 gap-8 text-sm">
                                      {category.featured.map((item, itemIdx) => (
                                        <div
                                          key={item.name}
                                          className={classNames(
                                            itemIdx === 0 ? 'aspect-w-2 col-span-2' : '',
                                            'group aspect-w-1 aspect-h-1 relative overflow-hidden rounded-md bg-gray-100'
                                          )}
                                        >
                                          <img
                                            src={item.imageSrc}
                                            alt={item.imageAlt}
                                            className="object-cover object-center group-hover:opacity-75"
                                          />
                                          <div className="flex flex-col justify-end">
                                            <div className="bg-white bg-opacity-60 p-4 text-sm">
                                              <a href={item.href} className="font-medium text-gray-900">
                                                <span className="absolute inset-0" aria-hidden="true" />
                                                {item.name}
                                              </a>
                                              <p aria-hidden="true" className="mt-0.5 text-gray-700 sm:mt-1">
                                                Shop now
                                              </p>
                                            </div>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                    <div className="grid grid-cols-3 gap-x-8 gap-y-10 text-sm text-gray-500">
                                      {category.sections.map((column, columnIdx) => (
                                        <div key={columnIdx} className="space-y-10">
                                          {column.map((section) => (
                                            <div key={section.name}>
                                              <p
                                                id={`${category.id}-${section.id}-heading`}
                                                className="font-medium text-gray-900"
                                              >
                                                {section.name}
                                              </p>
                                              <ul
                                                role="list"
                                                aria-labelledby={`${category.id}-${section.id}-heading`}
                                                className="mt-4 space-y-4"
                                              >
                                                {section.items.map((item) => (
                                                  <li key={item.name} className="flex">
                                                    <a href={item.href} className="hover:text-gray-800">
                                                      {item.name}
                                                    </a>
                                                  </li>
                                                ))}
                                              </ul>
                                            </div>
                                          ))}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </Popover.Panel>
                          </Transition>
                        </>
                      )}
                    </Popover>
                  ))}

                  {navigation.pages.map((page) => (
                    <a
                      key={page.name}
                      href={page.href}
                      className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-800"
                    >
                      {page.name}
                    </a>
                  ))}
                </div>
              </Popover.Group>

              {/* Logo */}
              <a href="/" className="flex">
                <span className="sr-only">Miltzn</span>
                <img
                  className="h-[80px] w-auto"
                  src={logo}
                  alt=""
                />
              </a>

              <div className="flex flex-1 items-center justify-end">
                {/* <a href="#" className="hidden text-gray-700 hover:text-gray-800 lg:flex lg:items-center">
                  <img
                    src="https://tailwindui.com/img/flags/flag-usa.svg"
                    alt=""
                    className="block h-auto w-5 flex-shrink-0"
                  />
                  <span className="ml-3 block text-sm font-medium">USD</span>
                  <span className="sr-only">, change currency</span>
                </a> */}

                {/* Wishlist */}
                <a href="#" className="ml-6 hidden p-2 text-gray-400 hover:text-gray-500 lg:block">
                  <span className="sr-only">Search</span>
                  <HeartIcon className="h-6 w-6" aria-hidden="true" />
                </a>

                {/* Account */}
                <a href="#" className="p-2 text-gray-400 hover:text-gray-500 lg:ml-4">
                  <span className="sr-only">Account</span>
                  <UserIcon className="h-6 w-6" aria-hidden="true" />
                </a>

                {/* Cart */}
              <Popover className="ml-4 flow-root text-sm lg:relative lg:ml-8">
                <Popover.Button className="group -m-2 flex items-center p-2">
                  <ShoppingBagIcon
                    className="h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                    aria-hidden="true"
                  />
                  <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800">{cartItemCount}</span>
                  <span className="sr-only">items in cart, view bag</span>
                </Popover.Button>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-200"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="transition ease-in duration-150"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Popover.Panel className="absolute inset-x-0 top-16 mt-px bg-white pb-6 shadow-lg sm:px-2 lg:left-auto lg:right-0 lg:top-full lg:-mr-1.5 lg:mt-3 lg:w-80 lg:rounded-lg lg:ring-1 lg:ring-black lg:ring-opacity-5 z-[999]">
                    <h2 className="sr-only">Shopping Cart</h2>

                    <form className="mx-auto max-w-2xl px-4" onSubmit={initiateCheckout}>
                      <ul role="list" className="divide-y divide-gray-200">
                        {products.map((product) => (
                          <li key={product.id} className="flex items-center py-6">
                            <img
                              src={product.imageSrc}
                              alt={product.imageAlt}
                              className="h-16 w-16 flex-none rounded-md border border-gray-200"
                            />
                            <div className="ml-4 flex-auto">
                              <h3 className="font-medium text-gray-900">
                                <a href={product.href}>{product.name}</a>
                              </h3>
                              <p className="text-gray-500">{product.color}</p>
                            </div>
                            <div className="flex items-center">
                              <span 
                                className="cursor-pointer text-gray-600 hover:text-gray-800" 
                                onClick={() => decrementQty(product)} 
                                >
                                  -
                              </span>
                              <p className="mx-2">{product.qty}</p>
                              <span 
                                className="cursor-pointer text-gray-600 hover:text-gray-800"
                                onClick={() => incrementQty(product)} 
                                >
                                  +
                              </span>
                            </div>
                          </li>
                        ))}
                      </ul>

                      <button
                        type="submit"
                        className="w-full rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50"
                        onClick={ initiateCheckout }
                      >
                        Checkout
                      </button>

                      <p className="mt-6 text-center">
                        <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                          View Shopping Bag
                        </a>
                      </p>
                    </form>
                  </Popover.Panel>
                </Transition>
              </Popover>
              </div>
            </div>
          </div>
        </nav>
      </header>
    </div>
  )
}
