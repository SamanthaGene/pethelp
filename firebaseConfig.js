import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDkc1UbqM78DitYbP4UB4n15zFnIWEXcQI",
  authDomain: "adv-project-94983.firebaseapp.com",
  projectId: "adv-project-94983",
  storageBucket: "adv-project-94983.firebasestorage.app",
  messagingSenderId: "937054441393",
  appId: "1:937054441393:web:af9264e3ae8f7718817790",
  measurementId: "G-KB74BFE8V3"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);
export const storage = getStorage(app);
