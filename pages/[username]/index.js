import UserProfile from '../../components/UserProfile';
import PostFeed from '../../components/PostFeed';
import { firestore, getUserWithUsername, postToJSON } from '../../lib/firebase';

export async function getServerSideProps({ query }) {
  const { username } = query;

  const userDoc = await getUserWithUsername(username)

  // Return 404 Page if User doesn't exist
  if (!userDoc) {
    return {
      notFound: true,
    };
  }

  // JSON serializable data
  let user = null;
  let posts = null;

  if (userDoc) {
    user = userDoc.data()
    const postsQuery = userDoc.ref
      .collection('posts')
      .where('published', '==', true)
      .orderBy('createdAt', 'desc')
      .limit(5);

      posts = (await postsQuery.get()).docs.map(postToJSON)
  }

  console.log(posts)
  return {
    props: { user, posts }
  }
}

export default function UserProfilePage({ user, posts }) {
    return (
      <main>
        <UserProfile user={user} />
        <PostFeed posts={posts} />
      </main>
    )
  }