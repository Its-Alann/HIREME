import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAtBgQOP98BP-kfPojULSjRj6enAuToJ_I",
  authDomain: "team-ate.firebaseapp.com",
  projectId: "team-ate",
  storageBucket: "team-ate.appspot.com",
  messagingSenderId: "1078110272163",
  appId: "1:1078110272163:web:3c0ac8143d1ed0ceb8dd16",
  measurementId: "G-PJ6PRNK71S",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
