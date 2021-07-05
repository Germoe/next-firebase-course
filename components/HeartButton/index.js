import { useDocument } from "react-firebase-hooks/firestore";
import { auth, firestore, increment } from "../../lib/firebase"

// Allows User to Heart or Like a Post
export default function HeartButton({ postRef }) {
    // Listen to heart document for currently logged in user
    const heartRef = postRef.collection('hearts').doc(auth.currentUser.uid); // Existence indicates whether User has or has not hearted a post
    const [heartDoc] = useDocument(heartRef);

    // Create a user-to-post relationship
    const addHeart = async () => {
        const uid = auth.currentUser.uid;
        const batch = firestore.batch(); // Multiple Changes that need to succeed or fail together

        batch.update(postRef, { heartCount: increment(1) });
        batch.set(heartRef, { uid });

        await batch.commit();
    };

    const removeHeart = async () => {
        const batch = firestore.batch();

        batch.update(postRef, { heartCount: increment(-1) });
        batch.delete(heartRef);

        await batch.commit();
    };

    return heartDoc?.exists ? (
        <button onClick={removeHeart}>Unheart</button>
    ) : (
        <button onClick={addHeart}>Heart</button>
    );
}