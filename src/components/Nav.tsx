"use client"
import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "../lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { SunHorizonIcon, ListIcon  } from '@phosphor-icons/react'
const Nav = () => {
  const [navMenu, setNavMenu] = React.useState(false);
  const [currentUser, setCurrentUser] = React.useState<{ email: string; fullName?: string } | null>(null);
  const router = useRouter();

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Fetch extra user data from Firestore
        const docSnap = await getDoc(doc(db, "users", user.uid));
        if (docSnap.exists()) {
          setCurrentUser(docSnap.data() as { email: string; fullName?: string });
        } else {
          setCurrentUser({ email: user.email || "" });
        }
      } else {
        setCurrentUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const logout = async () => {
    await signOut(auth);
    router.push("/login");
  };
  return (
    <div>
      {/* Mobile Nav */}
      <div className="px-2 py-4 flex flex-col gap-2 lg:hidden text-primary border-b border-accent">
        <div className="flex justify-between items-center">
          <section>
            <Link href="/" className="flex gap-2 items-center justify-center">
              <SunHorizonIcon size="60" weight="duotone" className="text-[#192D50]" />
              <div>
                <p className="text-sm">HORIZON</p>
                <p className="text-xs">By Abuchi</p>
              </div>
            </Link>
          </section>

          {/* Auth Section */}
          <section className="font-medium">
            {!currentUser ? (
              <>
                <Link
                  href="/login"
                  className="p-2 text-sm hover:bg-gray-300 border-gray-200 border rounded-md mr-2"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="p-2 text-sm bg-[#192D50] text-white rounded-md"
                >
                  Sign Up
                </Link>
              </>
            ) : null}
          </section>

          <section>
            <button onClick={() => setNavMenu((prev) => !prev)}>
              <ListIcon size="30" className="text-[#192D50]" />
            </button>
          </section>
        </div>

        {navMenu && (
          <div className="border-t border-gray-200 flex flex-col py-2 px-2 font-medium">
            <Link href="/todos" className="p-2 hover:bg-gray-300 rounded-md">
              Your Todos
            </Link>
            <Link href="/add-todo" className="p-2 hover:bg-gray-300 rounded-md">
              Add Todos
            </Link>
            <Link href="/search" className="p-2 hover:bg-gray-300 rounded-md">
              Search
            </Link>
            {currentUser && (
              <>
                <span className="mr-2">
                  Hello, {currentUser.fullName || currentUser.email}
                </span>
                <button
                  onClick={logout}
                  className="p-2 text-sm bg-red-500 text-white rounded-md"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Desktop Nav */}
      <div className="px-20 py-4 hidden lg:flex justify-between items-center text-primary border-b border-accent">
        <section>
          <Link href="/" className="flex gap-2 items-center justify-center">
            <SunHorizonIcon size="80" weight="duotone" className="text-[#192D50]" />
            <div>
              <p className="text-2xl">HORIZON</p>
              <p className="text-sm">By Abuchi</p>
            </div>
          </Link>
        </section>

        <section className="font-medium flex gap-4">
          <Link href="/todos" className="p-2 text-lg hover:bg-gray-300 rounded-md">
            Your Todos
          </Link>
          <Link
            href="/add-todo"
            className="p-2 text-lg hover:bg-gray-300 rounded-md"
          >
            Add Todos
          </Link>
          <Link href="/search" className="p-2 text-lg hover:bg-gray-300 rounded-md">
            Search
          </Link>
        </section>

        <section className="font-medium">
          {currentUser ? (
            <>
              <span className="mr-4">
                Hello, {currentUser.fullName || currentUser.email}
              </span>
              <button
                onClick={logout}
                className="p-2 text-lg bg-red-500 text-white rounded-md"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="p-2 text-lg hover:bg-gray-300 border-gray-200 border rounded-md mr-2"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="p-2 text-lg bg-[#192D50] text-white rounded-md"
              >
                Sign Up
              </Link>
            </>
          )}
        </section>
      </div>
    </div>
  )
}

export default Nav