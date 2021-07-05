import Link from "next/link";
import Image from "next/image";
import { useUserData } from "../lib/hooks";

export default function NavBar() {

    const { user, username } = useUserData()

    return (
        <nav className="navbar">
            <ul>
                {/* Shown to all Users */}
                <li>
                    <Link href="/" passHref>
                        <button className="btn-logo">FEED</button>
                    </Link>
                </li>

                {/* User is signed in and has username */}
                {(user && username)  && (
                    <>
                        <li className="push-left">
                            <Link href="/admin" passHref>
                                <button className="btn-blue">Write Posts</button>
                            </Link>
                        </li>
                        <li>
                            <Link href={`/${username}`} passHref>
                                <Image src={user?.photoURL} alt="Profit Photo" />
                            </Link>
                        </li>
                    </>
                )}

                {/* User is not signed in OR has not create username */}
                {!(user && username) && (
                    <li>
                        <Link href="/enter" passHref>
                            <button className="btn-blue">Log in</button>
                        </Link>
                    </li>
                )}
            </ul>
        </nav>
    );
}