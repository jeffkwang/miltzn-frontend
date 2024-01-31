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
import { Fragment, useState, useEffect, useRef } from 'react'
import { Dialog, Popover, Tab, Transition } from '@headlessui/react'
import { Bars3Icon, HeartIcon, ShoppingBagIcon, UserIcon, XMarkIcon } from '@heroicons/react/24/outline'
import logo from '../assets/img/logos/logo.svg';
import { getCookie, setCookie } from './cookieutils'
import { incrementQty, decrementQty } from '../components/add-to-cart'
import { initiateCheckout } from './checkout'
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

function removeFromCart(productData) {
  console.log('Removing from cart:', productData);

  if (productData.qty > 1) {
    decrementQty(productData);
    return;
  }

  let cart = JSON.parse(getCookie('cart')) || [];
  cart = cart.filter(item => 
      !(item.slug === productData.id));
  setCookie('cart', JSON.stringify(cart), 7);

  window.dispatchEvent(new Event('cartUpdated'));
  window.dispatchEvent(new Event('cartChanged'));
}

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [openCart, setOpenCart] = useState(false)
  // useEffect(() => {
  //   console.log('open state has changed:', openCart);
  // }, [openCart]);
  const [products, setProducts] = useState([]);
  const [cartItemCount, setCartItemCount] = useState(() => {
    // Parse the cart data from the cookie
    const cartData = JSON.parse(getCookie('cart')) || [];
  
    // Calculate the initial count of items in the cart
    const initialItemCount = cartData.reduce((total, item) => total + (item.qty || 1), 0);
  
    // Return this count to initialize the state
    return initialItemCount;
  });

  const initialSubtotal = (() => {
    let initialTotal = 0;
  
    // Parse the cart data from the cookie
    const cartData = JSON.parse(getCookie('cart')) || [];
  
    // Calculate the initial subtotal
    cartData.forEach((cartItem) => {
      const itemPrice = parseFloat((cartItem.price).replace('$', '')); // Replace 'price' with the actual property name
      const itemQty = cartItem.qty;
      initialTotal += itemPrice * itemQty;
    });
  
    return initialTotal;
  })();
  
  const [subtotal, setSubtotal] = useState(initialSubtotal);

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
      price: cartItem.price,
    })
    );

    // Update the 'products' state with the reformatted data
    setProducts(formattedProducts);
  };

  useEffect(() => {
    const handleCartChange = () => {
      const cartData = JSON.parse(getCookie('cart')) || [];

      const newCartItemCount = cartData.reduce((total, item) => total + (item.qty || 1), 0);
      const newSubtotal = cartData.reduce((total, item) => {
        const itemPrice = parseFloat((item.price).replace('$', '')); // Replace 'price' with the actual property name
        const itemQty = item.qty || 1; // Default to 1 if qty is not available
        return total + itemPrice * itemQty;
      }, 0);
  
      setCartItemCount(newCartItemCount);
      setSubtotal(newSubtotal);
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

  const [isLoading, setIsLoading] = useState(false); 

  const handleCheckout = async (event) => {
    setIsLoading(true); // Set isLoading to true when initiating checkout

    try {
      let checkout_url = await initiateCheckout(event);

      // Wait for the new page to load before resetting the state
      window.onload = () => {
        setTimeout(() => {
          setIsLoading(false); // Set isLoading back to false when the new page has loaded
        }, 500); // Add a delay of 2 seconds (2000 milliseconds) before resetting the state
      };

      // Redirect the user to the checkout URL
      // Add a delay of 2 seconds (2000 milliseconds) before redirecting
      setTimeout(() => {
        window.location.href = checkout_url; // Redirect only if URL is verified
      }, 500);
    } catch (error) {
      console.error('Error initiating checkout:', error);
    } 
  };

  const checkoutButtonRef = useRef(null); // Create a ref for the checkout button
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
                                  
                    <button 
                      onClick={() => {
                        console.log('Button clicked'); // Add this for debugging
                        setOpenCart(!openCart);
                      }}
                      className="ml-4 group -m-2 flex items-center p-2"
                    >
                      <ShoppingBagIcon
                        className="h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                        aria-hidden="true"
                      />
                      <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800">{cartItemCount}</span>
                      <span className="sr-only">items in cart, view bag</span>
                    </button>
                  

                  <Transition.Root show={openCart} as={Fragment}>
                  <Dialog as="div" className="relative z-10" onClose={() => setOpenCart(openCart)} initialFocus={checkoutButtonRef}>
                    <Transition.Child
                      as={Fragment}
                      enter="ease-in-out duration-500"
                      enterFrom="opacity-0"
                      enterTo="opacity-100"
                      leave="ease-in-out duration-500"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"/>
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-hidden" onClick={() => setOpenCart(false)}>
                      <div className="absolute inset-0 overflow-hidden">
                        <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                          <Transition.Child
                            as={Fragment}
                            enter="transform transition ease-in-out duration-500 sm:duration-700"
                            enterFrom="translate-x-full"
                            enterTo="translate-x-0"
                            leave="transform transition ease-in-out duration-500 sm:duration-700"
                            leaveFrom="translate-x-0"
                            leaveTo="translate-x-full"
                          >
                            <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                              <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                                <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                                  <div className="flex items-start justify-between">
                                    <Dialog.Title className="text-lg font-medium text-gray-900">Shopping cart</Dialog.Title>
                                    <div className="ml-3 flex h-7 items-center">
                                      <button
                                        type="button"
                                        className="relative -m-2 p-2 text-gray-400 hover:text-gray-500"
                                        onClick={() => {
                                          setOpenCart(false);
                                        }}
                                      >
                                        <span className="absolute -inset-0.5" />
                                        <span className="sr-only">Close panel</span>
                                        <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                                      </button>
                                    </div>
                                  </div>

                                  <div className="mt-8">
                                    <div className="flow-root">
                                      <ul role="list" className="-my-6 divide-y divide-gray-200">
                                        {products.map((product) => (
                                          <li key={product.id} className="flex py-6">
                                            <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                              <img
                                                src={product.imageSrc}
                                                alt={product.imageAlt}
                                                className="h-full w-full object-cover object-center"
                                              />
                                            </div>

                                            <div className="ml-4 flex flex-1 flex-col">
                                              <div>
                                                <div className="flex justify-between text-base font-medium text-gray-900">
                                                  <h3>
                                                    <a href={product.href}>{product.name}</a>
                                                  </h3>
                                                  <p className="ml-4">{product.price}</p>
                                                </div>
                                                <p className="mt-1 text-sm text-gray-500">{product.color}</p>
                                              </div>
                                              <div className="flex flex-1 items-end justify-between text-sm">
                                                <p className="text-gray-500">Qty {product.qty}</p>

                                                <div className="flex">
                                                  <button
                                                    type="button"
                                                    className="font-medium text-indigo-600 hover:text-indigo-500"
                                                    onClick={() => {removeFromCart(product)}}
                                                  >
                                                    Remove
                                                  </button>
                                                </div>
                                              </div>
                                            </div>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  </div>
                                </div>

                                <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                                  <div className="flex justify-between text-base font-medium text-gray-900">
                                    <p>Subtotal</p>
                                    <p>${subtotal.toFixed(2)}</p>
                                  </div>
                                  <p className="mt-0.5 text-sm text-gray-500">Shipping and taxes calculated at checkout.</p>
                                  <div ref={checkoutButtonRef} className="mt-6">
                                    <button
                                      onClick={handleCheckout}                         
                                      className="w-full flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
                                      disabled={isLoading}
                                    >
                                      {isLoading ? (
                                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                                      ) : (
                                        'Checkout'
                                      )}
                                    </button>
                                    
                                  </div>
                                  <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                                    <p>
                                      or{' '}
                                      <button
                                        type="button"
                                        className="font-medium text-indigo-600 hover:text-indigo-500"
                                        onClick={() => {
                                          console.log('Continue button clicked'); // Add this for debugging
                                          setOpenCart(false);
                                        }}
                                      >
                                        Continue Shopping
                                        <span aria-hidden="true"> &rarr;</span>
                                      </button>
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </Dialog.Panel>
                          </Transition.Child>
                        </div>
                      </div>
                    </div>
                  </Dialog>
                  </Transition.Root>
                
              </div>
            </div>
          </div>
        </nav>
      </header>
    </div>
  )
}
