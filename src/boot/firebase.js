import { boot } from 'quasar/wrappers';
import firebase from 'firebase/compat/app';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyDXSaySxVttdIJfuz5a_HuxnpGSeXsjsa8',
  authDomain: 'expense-diary-base.firebaseapp.com',
  projectId: 'expense-diary-base',
  storageBucket: 'expense-diary-base.appspot.com',
  messagingSenderId: '1030668548161',
  appId: '1:1030668548161:web:923a8da248cc7d1286eec0',
  measurementId: 'G-Y3SQQ46F5Z',
};

firebase.initializeApp(firebaseConfig);

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = firebase.firestore();

export { db, auth };

export default boot();
