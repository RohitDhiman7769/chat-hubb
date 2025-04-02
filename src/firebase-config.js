import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
  import { addDoc, collection, onSnapshot, query, serverTimestamp, doc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDLvFPxLBsVZX-B8MSzo30lDpyJuQfpSRc",
  authDomain: "chat-hubb-2d997.firebaseapp.com",
  projectId: "chat-hubb-2d997",
  storageBucket: "chat-hubb-2d997.firebasestorage.app",
  messagingSenderId: "163992222027",
  appId: "1:163992222027:web:962f93e4a2501427d0d0ce",
  measurementId: "G-79TL35B8MY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const provider = new GoogleAuthProvider();
export const db = new getFirestore(app);
// console.log(db.collection('chat-hubb'))
// export const val = db.collection('chat-hubb')
// const conversationRef = collection(db, 'chat-hubb/conversation/123/messages')
// console.log(conversationRef)

        // const documentRef = doc(db,'chat-hubb/conversation')
        // console.log(documentRef)
        // await conversationRef.set(conversationData)