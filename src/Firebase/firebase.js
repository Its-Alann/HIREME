import { initializeApp } from "firebase/app";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import {
  connectAuthEmulator,
  getAuth,
  GoogleAuthProvider,
} from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getDatabase, connectDatabaseEmulator } from "firebase/database";

// db with team
const firebaseConfig = {
  apiKey: "AIzaSyAtBgQOP98BP-kfPojULSjRj6enAuToJ_I",
  authDomain: "team-ate.firebaseapp.com",
  projectId: "team-ate",
  storageBucket: "team-ate.appspot.com",
  messagingSenderId: "1078110272163",
  appId: "1:1078110272163:web:3c0ac8143d1ed0ceb8dd16",
  measurementId: "G-PJ6PRNK71S",
};

// db with alice
// const firebaseConfig = {
//   apiKey: "AIzaSyBP_nhbHmP4fHCUXvGi9nenli1yU5Q0lvo",
//   authDomain: "alice390-826e2.firebaseapp.com",
//   projectId: "alice390-826e2",
//   storageBucket: "alice390-826e2.appspot.com",
//   messagingSenderId: "856984230217",
//   appId: "1:856984230217:web:4c5af60a072f21945d2298",
// };

//init firebase
const app = initializeApp(firebaseConfig);
//init firestore
const db = getFirestore(app);

const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const storage = getStorage(app);

export { auth, provider, app, db, storage };
