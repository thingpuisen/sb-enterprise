import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, updateDoc, serverTimestamp } from "firebase/firestore";
import config from "./src/firebase-applet-config.json" assert { type: "json" };

async function test() {
  const app = initializeApp(config);
  const auth = getAuth(app);
  const db = getFirestore(app);

  // Authenticate as the current user
  /* NO PASSWORD, USE THE EMULATOR OR BROWSER TO SEE ERROR LOGS */
}

test();
