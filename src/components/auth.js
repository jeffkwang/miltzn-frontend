import { auth, provider } from "../config/firebase";
import { sendSignInLinkToEmail, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useState, useEffect } from 'react';

const actionCodeSettings = {
    // URL you want to redirect back to. The domain (www.example.com) for this
    // URL must be in the authorized domains list in the Firebase Console.
    url: 'https://miltzn.com',
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

    const googleSignIn = async () => {
      await signInWithPopup(auth, provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        const user = result.user;
        console.log(user);
        window.location.href="/"
      }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.customData.email;
        const credential = GoogleAuthProvider.credentialFromError(error);
      });
    
    }

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
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
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
              <p>
                Need to{" "}
                <a href="/signup" className="underline text-blue-800">
                  sign up
                </a>
                ?
              </p>
            </div>
            <div className="my-1 cursor-pointer" onClick={googleSignIn}>
              <div className="flex w-full justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white hover:text-black shadow-sm hover:bg-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                <div className="flex flex-row items-center">
                <div className="h-[18px] mr-[8px] min-w-[18px] width-[18px]"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="block"><g><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path><path fill="none" d="M0 0h48v48H0z"></path></g></svg></div>
                <span class="nsm7Bb-HzV7m-LgbsSe-BPrWId">Sign in with Google</span>
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