import { getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { isSupported, getMessaging } from "firebase/messaging";
const firebaseConfig = {
  apiKey: "AIzaSyD6d6xmlitY3qZ79lJQgh9GHFPZxLqvLcc",
  authDomain: "medikiosk-site.firebaseapp.com",
  projectId: "medikiosk-site",
  storageBucket: "medikiosk-site.firebasestorage.app",
  messagingSenderId: "357344149832",
  appId: "1:357344149832:web:b8b24dcdd5afcbc05e737d"
};
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const getFirebaseMessaging = async () => {
  const supported = await isSupported();
  if (!supported) return null;
  return getMessaging(app);
};
export {
  auth as a,
  getFirebaseMessaging as g
};
