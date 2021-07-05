import { useAuthState } from 'react-firebase-hooks/auth'; 
import { auth, firestore } from '../lib/firebase';
import { useEffect, useState } from 'react';

export function useUserData() {
    const [user] = useAuthState(auth);

    // Listen to real-time updates to fetch additional data based on another 
    // input not available at loading time (i.e. user state)
    const [username, setUsername] = useState(null);
  
    useEffect(() => {
      // variable to turn of real-time subscription
      let unsubscribe;
  
      if (user) {
        // Fetch 
        const ref = firestore.collection('users').doc(user.uid);
        unsubscribe = ref.onSnapshot((doc) => {
          setUsername(doc.data()?.username);
        });
      } else {
        setUsername(null);
      }
  
      return unsubscribe;
    }, [user])

    return { user, username };
}