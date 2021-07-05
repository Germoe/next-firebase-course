import firebase from 'firebase/app'

// Bundle Services used into the JS Bundle
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

// Set up Firebase Config

// From Firebase account Project Settings Web App
const firebaseConfig = {
    apiKey: "AIzaSyAcYazw80IBZe5QBPZBFVU0rvAJeLpYRUs",
    authDomain: "birthday-planner-1d916.firebaseapp.com",
    projectId: "birthday-planner-1d916",
    storageBucket: "birthday-planner-1d916.appspot.com",
    messagingSenderId: "225403048619",
    appId: "1:225403048619:web:059e2f75853d8de69f5dee",
    measurementId: "G-1SHW1TQ3P4"
}

if (!firebase.apps.length) {
    // Required as Firebase can only be initialized once but without 
    // the condition above React could try to initialize Firebase multiple times
    firebase.initializeApp(firebaseConfig)
}

// Store and Expose SDK Variables for usage of Services
export const auth = firebase.auth();
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();

export const firestore = firebase.firestore();
export const fromMillis = firebase.firestore.Timestamp.fromMillis;
export const serverTimestamp = firebase.firestore.FieldValue.serverTimestamp; // Timestamp on Server-Side
export const increment = firebase.firestore.FieldValue.increment;

export const storage = firebase.storage();
export const STATE_CHANGED = firebase.storage.TaskEvent.STATE_CHANGED; // Event that updates on whether file is uploaded and progress

/*
 * Gets a users/{uid} document with username
 * @param  {string} username
 */
export async function getUserWithUsername(username) {
    const usersRef = firestore.collection('users');
    const query = usersRef.where('username', '==', username).limit(1);
    const userDoc = (await query.get()).docs[0];
    return userDoc;
}


/*
 * Converts a firestore document to JSON
 * @param  {DocumentSnapshot} doc
 */
export function postToJSON(doc) {
    const data = doc.data();
    return {
        ...data,
        // Firestore timestamp NOT serializable to JSON. Must convert to milliseconds
        createdAt: data.createdAt.toMillis(),
        updatedAt: data.updatedAt.toMillis(),
    };
}
