import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAPlq4OAs8u4zZ0N38qs1bvGqugFv6jqcM",
  authDomain: "cv2ceo-9e0a4.firebaseapp.com",
  projectId: "cv2ceo-9e0a4",
  storageBucket: "cv2ceo-9e0a4.appspot.com",
  messagingSenderId: "15194959312",
  appId: "1:15194959312:web:7cba163e21f6fb48e85dd5",
};

// Initialize Firebase only if it hasn't been initialized already
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
