import { auth } from "../config/firebase";
import { sendSignInLinkToEmail, createUserWithEmailAndPassword } from "firebase/auth";
import { useState, useEffect } from 'react';

const actionCodeSettings = {
    // URL you want to redirect back to. The domain (www.example.com) for this
    // URL must be in the authorized domains list in the Firebase Console.
    url: 'http://localhost:3000',
    // This must be true.
    handleCodeInApp: true
  };

export function Login() {
    const [email, setEmail] = useState("");
    const [showBanner, setShowBanner] = useState(false);

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
        await sendSignInLinkToEmail(auth, email, actionCodeSettings)
          .then(() => {
            window.localStorage.setItem('emailForSignIn', email);
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage);
          });
    };

    return (
      <>
        {showBanner && (
          <div className="bg-indigo-100 border-t-4 rounded-b text-grey-900 px-4 py-3 shadow-md mx-auto absolute left-0 right-0 w-fit">
            <div className="flex">
              <div>
                <p className="font-bold">Successfully created a new account!</p>
              </div>
            </div>
          </div>
        )}
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <img
              className="mx-auto h-10 w-auto"
              src="../assets/img/logo.svg"
              alt=""
            />
            <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
              Sign in to your account
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
                  onClick={signIn}
                  className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Sign in
                </button>
              </div>
            </form>
            <div className="mt-1">
              <p>Need to <a href="/signup" className="underline text-blue-800">sign up</a>?</p>
            </div>
          </div>
        </div>
      </>
    )
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
          if (errorCode == 'auth/weak-password') {
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