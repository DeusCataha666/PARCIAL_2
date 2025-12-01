import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCMYhnIGyQw4SyYHDHMcHiU-AGpCnjODEE",
  authDomain: "campushub-fff2f.firebaseapp.com",
  projectId: "campushub-fff2f",
  storageBucket: "campushub-fff2f.firebasestorage.app",
  messagingSenderId: "889176728973",
  appId: "1:889176728973:web:2702866b4cc3387c8249c4",
  measurementId: "G-NRW41Y2JD8"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
