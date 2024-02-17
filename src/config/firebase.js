import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDownloadURL, getStorage, ref } from "firebase/storage";
import { getAuth } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBDNUMxTpp-7VMKshqwEK1M_QWvy3cTOyc",
    authDomain: "miltzn.com",
    projectId: "miltzn-frontend",
    storageBucket: "miltzn-frontend.appspot.com",
    messagingSenderId: "215909418723",
    appId: "1:215909418723:web:cc4f4e7e0fa72f39f8e7d6",
    measurementId: "G-J85T2XRD9F"
  };

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const storage = getStorage();
export const provider = new GoogleAuthProvider();

// const imagesRef = ref(storage, 'images');
// const exampleRef = ref(storage, 'images/example.jpg')

// getDownloadURL(exampleRef)
//   .then((url) => {
//     const img = document.getElementById('imgID');
//     img.setAttribute('src', url);
//   });

export const auth = getAuth(app);
export const db = getFirestore(app);