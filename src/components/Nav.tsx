"use client"
import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "../lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { SunHorizonIcon, ListIcon } from '@phosphor-icons/react'

const Nav = () => {
  const [navMenu, setNavMenu] = React.useState(false);
  const [currentUser, setCurrentUser] = React.useState<{ email: string; fullName?: string } | null>(null);
  const router = useRouter();

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Fetch extra user data from Firestore
          const docSnap = await getDoc(doc(db, "users", user.uid));
          if (docSnap.exists()) {
            setCurrentUser(docSnap.data() as { email: string; fullName?: string });
          } else {
            setCurrentUser({ email: user.email || "" });
          }
        } catch (error) {
          console.error("Permission error or issue fetching user doc:", error);
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

  // Determine the home path based on auth status
  const homePath = currentUser ? "/todos" : "/";

  return (
    <div>
      {/* Mobile Nav */}
      <div className="px-2 py-4 flex flex-col gap-2 lg:hidden text-primary border-b border-accent">
        <div className="flex justify-between items-center">
          <section>
            {/* Dynamic Link based on auth status */}
            <Link href={homePath} className="flex gap-2 items-center justify-center">
              <SunHorizonIcon size="60" weight="duotone" className="text-primary" />
              <div>
                <p className="text-sm font-bold">HORIZON</p>
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
                  className="p-2 text-sm hover:bg-gray-300 border-gray-200 border rounded-md mr-2 transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="p-2 text-sm bg-primary text-white rounded-md transition-opacity hover:opacity-90"
                >
                  Sign Up
                </Link>
              </>
            ) : null}
          </section>

          <section>
            <button onClick={() => setNavMenu((prev) => !prev)}>
              <ListIcon size="30" className="text-primary" />
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
              <div className="flex flex-col gap-2 mt-2 pt-2 border-t border-gray-100">
                <span className="px-2 text-sm text-gray-600">
                  Hello, {currentUser.fullName || currentUser.email}
                </span>
                <button
                  onClick={logout}
                  className="p-2 text-sm bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Desktop Nav */}
      <div className="px-20 py-4 hidden lg:flex justify-between items-center text-primary border-b border-accent">
        <section>
          {/* Dynamic Link based on auth status */}
          <Link href={homePath} className="flex gap-2 items-center justify-center group">
            <SunHorizonIcon size="80" weight="duotone" className="text-primary transition-transform group-hover:scale-105" />
            <div>
              <p className="text-2xl font-bold">HORIZON</p>
              <p className="text-sm">By Abuchi</p>
            </div>
          </Link>
        </section>

        <section className="font-medium flex gap-4">
          <Link href="/todos" className="p-2 text-lg hover:bg-gray-100 rounded-md transition-colors">
            Your Todos
          </Link>
          <Link
            href="/add-todo"
            className="p-2 text-lg hover:bg-gray-100 rounded-md transition-colors"
          >
            Add Todos
          </Link>
          <Link href="/search" className="p-2 text-lg hover:bg-gray-100 rounded-md transition-colors">
            Search
          </Link>
        </section>

        <section className="font-medium">
          {currentUser ? (
            <div className="flex items-center gap-4">
              <span className="text-gray-700">
                Hello, {currentUser.fullName || currentUser.email}
              </span>
              <button
                onClick={logout}
                className="p-2 px-4 text-lg bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Link
                href="/login"
                className="p-2 px-4 text-lg hover:bg-gray-100 border-gray-200 border rounded-md transition-colors"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="p-2 px-4 text-lg bg-primary text-white rounded-md hover:opacity-90 transition-opacity"
              >
                Sign Up
              </Link>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

export default Nav