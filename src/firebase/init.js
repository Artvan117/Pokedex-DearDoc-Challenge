import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import 'firebase/database'

const firebaseConfig = {
    apiKey: "Your API Key",
    authDomain: "Your Auth Domain",
    databaseURL: "Your Database URL",
    projectId: "Your Project ID",
    storageBucket: "Your Storage Bucket",
    messagingSenderId: "Your Message Sender ID",
    appId: "Your AppId"
  };

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth();
const database = getDatabase(firebaseApp);
export { auth, firebaseApp, database };
