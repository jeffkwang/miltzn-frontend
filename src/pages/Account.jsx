import React from 'react';
import { auth } from '../config/firebase';
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export const AccountPage = () => {
  const navigate = useNavigate();

  onAuthStateChanged(auth, (user) => {
    if (!user) {
      navigate('/login');
    }
  });

  const logout = async () => {
    await signOut(auth).then(() => {
      navigate('/');
      console.log('Successfully logged out!');
    }).catch((error) => {
      const errorcode = error.code;
      console.log(errorcode);
    });
  };

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between m-20">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Your Account
          </h2>
        </div>
        <div className="mt-4 flex md:ml-4 md:mt-0">
          <button
            type="button"
            onClick={logout}
            className="ml-3 inline-flex items-center rounded-md bg-gray-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Sign Out
          </button>
        </div>
        </div>
      </div>
      
    </>
  );
};
