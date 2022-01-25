import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, getDownloadURL   } from "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyByLXkDIttb1wsZeAMPMQ6coZ58nxzX2jI",
  authDomain: "mcl-website-5ee2b.firebaseapp.com",
  projectId: "mcl-website-5ee2b",
  storageBucket: "mcl-website-5ee2b.appspot.com",
  messagingSenderId: "515154241460",
  appId: "1:515154241460:web:aaabbfdf93d182fbc934e1",
  measurementId: "G-5KQ59NMFQL"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

// utils
const storage = getStorage(firebaseApp);

const firebasejs = { storage, ref, uploadBytes, getDownloadURL   }

export default firebasejs