import Image from "next/image";

export default function UserProfile({ user }) {
  return (
    <div className="box-center">
        <Image src={user.photoURL} alt="Profile Photo" className="card-img-center" />
        <p>
            <i>@{user.username}</i>
        </p>
        <h1>{user.displayName}</h1>
    </div>
  );
}