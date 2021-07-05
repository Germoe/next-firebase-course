import postStyles from '../../styles/Post.module.css';
import PostContent from '../../components/PostContent';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { firestore, getUserWithUsername, postToJSON } from "../../lib/firebase";
import AuthCheck from '../../components/AuthCheck';
import HeartButton from '../../components/HeartButton';
import Link from 'next/link';

export async function getStaticProps({ params }) {
  const { username, slug } = params;
  const userDoc = await getUserWithUsername(username);

  let post;
  let path;

  if (userDoc) {
    const postRef = userDoc.ref.collection('posts').doc(slug);
    post = postToJSON(await postRef.get());

    path = postRef.path; // Direct path to the document (useful for "hydration")
  }

  return { 
    props : { post, path },
    revalidate: 5000,
  };
}

export async function getStaticPaths() {
  // TODO Improve using Admin SDK to select empty docs
  const snapshot = await firestore.collectionGroup('posts').get();

  const paths = snapshot.docs.map((doc) => {
    const { slug, username } = doc.data();
    return {
      params: { username, slug },
    };
  });

  return {
    // must be in this format:
    // paths: [
    //  { params: { data }}
    // ],

    paths,
    fallback: 'blocking',
  };
}

export default function PostPage(props) {
  // Settings for Hydration
  const postRef = firestore.doc(props.path);
  const [realtimePost] = useDocumentData(postRef);

  // Create Fallback to show content in case Hydration is not ready on load time
  const post = realtimePost || props.post;

  return (
    <main className={postStyles.container}>

      <section>
        <PostContent post={post} />
      </section>
      
      <aside className="card">
        <p>
          <strong>{post.heartCount || 0} {`<3`}</strong>
        </p>


        <AuthCheck
          fallback={
            <Link href="/enter">
              <button>Sign Up</button>
            </Link>
          }
        >
          <HeartButton postRef={postRef} />
        </AuthCheck>
      </aside>
    </main>
  )
}