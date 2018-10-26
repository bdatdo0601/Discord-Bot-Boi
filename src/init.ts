import debug from "debug";
import dotenv from "dotenv";
import firebase from "firebase";
dotenv.config();

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: `${process.env.FIREBASE_AUTH_DOMAIN}.firebaseapp.com`,
  databaseURL: `https://${process.env.FIREBASE_DB_NAME}.firebaseio.com`,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: `${process.env.FIREBASE_STORAGE_BUCKET}.appspot.com`,
};

firebase.initializeApp(firebaseConfig);

const debugLog = debug("BotBoi:Init");

const initialization = async () => {
  debugLog("Initializing");
  const database = firebase.database();
  await database.ref("/").remove();
  debugLog("Initialized");
  process.exit(0);
};

initialization().catch((error) => {
  debugLog("Initialization error");
  debugLog(error.message);
  debugLog(error);
  process.exit(1);
});

export default initialization;
