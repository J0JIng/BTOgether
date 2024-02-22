import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDrcBwgDBLX1gFBM06gAP3iTMiCA2_ICkk",
  authDomain: "btogether-571a3.firebaseapp.com",
  projectId: "btogether-571a3",
  storageBucket: "btogether-571a3.appspot.com",
  messagingSenderId: "804210143858",
  appId: "1:804210143858:web:9d6d9845d1b01b561548eb"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app)

