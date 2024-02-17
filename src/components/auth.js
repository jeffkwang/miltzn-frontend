import { auth, provider } from "../config/firebase";
import { sendSignInLinkToEmail, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'; // Import useLocation hook
import favicon from '../assets/img/logos/favicon-small.png';

const actionCodeSettings = {
    // URL you want to redirect back to. The domain (www.example.com) for this
    // URL must be in the authorized domains list in the Firebase Console.
    url: 'https://miltzn.com',
    // This must be true.
    handleCodeInApp: true
  };

async function customerExists(email) {
  try {
      const response = await fetch('http://127.0.0.1:8000/check-customer', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email: email })
      });

      if (response.ok) {
          const data = await response.json();
          if (data.exists == 'false') { return false } else { return true };
      } else {
          throw new Error(`Request failed with status ${response.status}: ${response.statusText}`);
      }
  } catch (error) {
      throw error;
  }
}

export function Login() {
    const [email, setEmail] = useState("");
    const [showBanner, setShowBanner] = useState(false);
    const location = useLocation(); 

    useEffect(() => {
      const urlParams = new URLSearchParams(window.location.search);
      const payload = urlParams.get('payload');
  
      if (payload === 'signup-redirect') {
        setShowBanner(true);
  
        // Hide the banner after 3 seconds
        setTimeout(() => {
          setShowBanner(false);
        }, 3000);
      }
    }, []);

    const signIn = async () => {
        /*
        Function signs in user using a sign in link that is accessed via their email. If the customer already exists, then the user creation
        process is skipped. Otherwise, a user is created using Firebase auth's email and password function. Then, the user account creation
        endpoint of the API is queried.
        */

        await sendSignInLinkToEmail(auth, email, actionCodeSettings)
          .then(() => {
            return customerExists(email); // Check if customer exists
          })
          .then((exists) => {
            try {
              if (!exists) {

                const userCredential = createUserWithEmailAndPassword(
                  auth,
                  email,
                  Math.random().toString(36).substr(2, 8),
                  actionCodeSettings
                );
        
                console.log('Successfully created new user:', userCredential.user.uid);
                  
                // const response = fetch(`${CUSTOMER_API_URL}`, {
                const response = fetch(`http://127.0.0.1:8000/new-customer/`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    email: email,
                    uid: userCredential.user.uid,
                  }),
                }
                );

                if (response.ok) {
                  console.log('User data sent to the backend successfully.');
                } else {
                  console.error('Failed to send user data to the backend.');
                }

              }
                
              } catch (error) {
                console.error("Error creating user:", error);
              }
          
                
          window.localStorage.setItem('emailForSignIn', email);
          setShowBanner(true);
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            if(errorCode == 'ERROR_EMAIL_ALREADY_IN_USE') {
              console.log("DUPLICATE EMAIL ERROR", errorMessage);
            } else {
              console.log(errorMessage)
            }
          });
    };

    const googleSignIn = async () => {
      /*
      Function provides login access via Google authentication. It first checks whether the user already exists in Square via email.
      If the user is new and doesn't exist, then it sends a post request with the user's email and authentication ID to the backend's new-customer
      endpoint. If the operation is successful, the user is redirected to the home page.
      */

      try {
        const result = await signInWithPopup(auth, provider);
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        const user = result.user;

        const exists = await customerExists(user.email);

          if (!exists) {
            const response = await fetch(`http://127.0.0.1:8000/new-customer`, {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      email: user.email,
                      uid: user.uid,
                    }),
                  }
                  );

            if (response.ok) {
                console.log('User data sent to the backend successfully.');
            }
          }

        window.location.href = '/';
        
      }catch(error) {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // const email = error.customData.email;
        const credential = GoogleAuthProvider.credentialFromError(error);
      }
    
    };

    return (
      <>
        {showBanner && (
          
          <div className="flex items-center justify-center gap-x-6 bg-green-600 px-6 py-2.5 sm:px-3.5">              
              {location.pathname === '/signup' && (
              <div>
                <p className="text-sm leading-6 text-white">Successfully created a new account!</p>
              </div>
              )}
              
              {location.pathname === '/login' && (
              <div>
                <p className="text-sm leading-6 text-white">An email has been sent. Please check your inbox to sign in.</p>
              </div>
              )}
          </div>
        )}

<div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <img
            className="mx-auto h-25 w-auto"
            src={ favicon }
            alt="Your Company"
          />
          <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
          <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
            <form className="space-y-6" action="#">
              <div>
                <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>         

              <div>
                <button
                  type="button"
                  onClick={signIn}
                  className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Sign in
                </button>
              </div>
            </form>

            <div>
              <div className="relative mt-10">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm font-medium leading-6">
                  <span className="bg-white px-6 text-gray-900">Or continue with</span>
                </div>
              </div>

              <div className="mt-6 w-full">
                <button
                  onClick={googleSignIn}
                  className="flex w-full items-center justify-center gap-3 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:ring-transparent"
                >
                  <svg className="h-5 w-5" aria-hidden="true" viewBox="0 0 24 24">
                    <path
                      d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z"
                      fill="#EA4335"
                    />
                    <path
                      d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z"
                      fill="#4285F4"
                    />
                    <path
                      d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.2654 14.29L1.27539 17.385C3.25539 21.31 7.3104 24.0001 12.0004 24.0001Z"
                      fill="#34A853"
                    />
                  </svg>
                  <span className="text-sm font-semibold leading-6">Google</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      </>
    );
  }
  
  
  export function Signup() {
    const [email, setEmail] = useState("");

    const signUp = async () => {
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          Math.random().toString(36).substr(2, 8),
          actionCodeSettings
        );

        console.log('Successfully created new user:', userCredential.user.uid);

        const redirectUrl = `/login?payload=${encodeURIComponent('signup-redirect')}`;
        setTimeout(() => {
          window.location.href = redirectUrl; // Redirect only if URL is verified
        }, 300);
        
        } catch (error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          if (errorCode === 'auth/weak-password') {
            alert('The password is too weak.');
          } else {
            alert(errorMessage);
          }
          console.error(error);
        }  
      };

      return (
        <>
          {/*
            This example requires updating your template:
    
            ```
            <html class="h-full bg-white">
            <body class="h-full">
            ```
          */}
          <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
              <img
                className="mx-auto h-10 w-auto"
                src="../assets/img/logo.svg"
                alt=""
              />
              <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                Create an account
              </h2>
            </div>
    
            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
              <form className="space-y-6" action="#" method="POST">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                    Email address
                  </label>
                  <div className="mt-2">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
    
                <div>
                  <button
                    type="button"
                    onClick={signUp}
                    className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Sign in
                  </button>
                </div>
              </form>
              <div className="mt-1">
                <a href="/login" className="underline text-blue-800">Already have an account?</a>
              </div>
            </div>
          </div>
        </>
      )
  }