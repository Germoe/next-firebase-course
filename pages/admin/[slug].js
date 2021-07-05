import { useRouter } from "next/dist/client/router";
import Link from "next/link";
import React, { useState } from "react"
import { useDocumentDataOnce } from "react-firebase-hooks/firestore";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import ReactMarkdown from "react-markdown";
import ImageUploader from "../../components/ImageUploader";
import AuthCheck from "../../components/AuthCheck";
import MetaTags from "../../components/Metatags"
import { auth, firestore, serverTimestamp } from "../../lib/firebase";
import adminStyles from "../../styles/Admin.module.css";

export default function AdminPostsEdit({ }) {
    return (
      <main>
          <AuthCheck>
            <MetaTags title="admin page" />
            <PostManager />
          </AuthCheck>
      </main>
    )
}

function PostManager() {
  const [preview, setPreview] = useState(false);

  const router = useRouter();
  const { slug } = router.query;

  const postRef = firestore.collection('users').doc(auth.currentUser.uid).collection('posts').doc(slug);
  const [post] = useDocumentDataOnce(postRef);

  return (
    <main className={adminStyles.container}>
      {post && (
        <>
          <section>
            <h1>{post.title}</h1>
            <p>ID: {post.slug}</p>

            <PostForm postRef={postRef} defaultValues={post} preview={preview} />
          </section>

          <aside>
            <h3>Tools</h3>
              <button onClick={() => setPreview(!preview)}>{preview ? 'Edit' : 'Preview'}</button>
              <Link href={`/${post.username}/${post.slug}`}>
                <button className="btn-blue">Live view</button>
              </Link>
          </aside>
        </>
      )}
    </main>
  );
}

function PostForm({ defaultValues, postRef, preview }) {
  const { register, handleSubmit, reset, watch, formState } = useForm({ defaultValues, mode: 'onChange' });

  // Implement Client-Side Validation (only for UX no use as security implementation)
  const { isValid, isDirty } = formState;

  const updatePost = async ({ content, published }) => {
    await postRef.update({
      content,
      published,
      updatedAt: serverTimestamp(),
    });

    reset({ content, published });

    toast.success('Post was updated successfully!')
  }
  return (
    <form onSubmit={handleSubmit(updatePost) /* updatePost function has automatically access to registered field values */}>
      {preview && (
        <div className="card">
          <ReactMarkdown>{watch('content')}</ReactMarkdown>
        </div>
      )}

      <div className={preview ? adminStyles.hidden : adminStyles.controls}>
        <ImageUploader />

        <textarea name="content"  {...register('content', {
          maxLength: { value: 20000, message: 'content is too long'},
          minLength: { value: 10, message: 'content is too short'},
          required: { value: true, message: 'content is required'}
        })}></textarea>

        {formState.errors.content && <p className="text-danger">{formState.errors.content.message}</p>}

        <fieldset>
          <input className={adminStyles.checkbox} type="checkbox" {...register('published')} />
          <label>Published</label>
        </fieldset>
      </div>

      <button type="submit" className="btn-green" disabled={!isDirty || !isValid}>
        Save Changes
      </button>
    </form>
  );
}