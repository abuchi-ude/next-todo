"use client"
import { useState, useEffect } from "react";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth, db } from "../../../lib/firebase";
import { useRouter } from 'next/navigation';
import { setDoc, doc } from "firebase/firestore";
import {
  ArrowLeftIcon,
  GoogleLogoIcon,
  EnvelopeIcon,
  LockIcon,
  EyeIcon,
  EyeSlashIcon
} from "@phosphor-icons/react";
import Seperator from '@/components/Seperator';
import Link from "next/link";

const Login = () => {

  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [seePassword, setSeePassword] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });
  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    if (errors.email || errors.password) return;

    setError("");
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/todos");
    } catch (err: any) {
      if (err.code === "auth/invalid-credential") {
        setError("Invalid email or password.");
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };
  
  const googleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      // Save user in Firestore if first time
      await setDoc(
        doc(db, "users", user.uid),
        { email: user.email, lastLogin: new Date(), fullName: user.displayName || "" },
        { merge: true }
      );
      router.push("/todos");
    } catch (err: any) {
      setError(err.message);
    }
  };
  const CurrentIcon1 = seePassword ? EyeSlashIcon : EyeIcon;
  const inputType1 = seePassword ? "text" : "password";

  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setErrors(prev => ({
      ...prev,
      email: !emailRegex.test(email) ? "Invalid email address." : "",
    }));
  }, [email]);

  useEffect(() => {
    setErrors(prev => ({
      ...prev,
      password: password.length < 6 ? "Password must be at least 6 characters." : "",
    }));
  }, [password]);
  return (
    <div className="flex-1 py-8 max-w-lg mx-auto px-2 text-primary">
      <section className="px-4 sm:px-6 lg:px-8 border w-fit rounded-xl hover:bg-accent border-accent">
        <a href="/" className="flex py-3 items-center">
          <ArrowLeftIcon className="mr-2" size="16" />
          <p>Back to Home</p>
        </a>
      </section>
      <section className="border border-accent px-4 sm:px-6 lg:px-8 rounded-2xl mt-10 py-10">
        <div>
          <section className="text-center pb-4">
            <h1 className="text-2xl text-primary mb-2">Login</h1>
            <p className="text-primary/70">Sign in to your account</p>
          </section>
          <section className="space-y-6">
            <button
              type="button"
              onClick={googleLogin}
              className="w-full flex gap-4 items-center justify-center border hover:bg-accent border-accent rounded-xl text-primary p-2"
            >
              <GoogleLogoIcon weight="bold" size="30" />
              <p className="font-medium text-xl">Continue with Google</p>
            </button>
          </section>
          <Seperator />
          <form onSubmit={login} className="space-y-8">
            <section>
              <div>
                <label htmlFor="email" className="block mb-2 text-primary font-medium text-xl">Email</label>
                <div className="relative flex">
                  <div className="absolute text-primary top-4 left-3">
                    <EnvelopeIcon size="16" weight="bold" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="text-primary focus:outline-4 autofill-bg-white focus:border-1 outline-accent w-full py-3 pl-10 bg-primary/10 rounded-xl"
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email}</p>
                )}
              </div>
            </section>
            <section>
              <div>
                <label htmlFor="password" className="block mb-2 text-primary font-medium text-xl">Password</label>
                <div className="relative flex">
                  <div className="absolute text-primary top-4 left-3">
                    <LockIcon size="16" weight="bold" />
                  </div>
                  <input
                    id="password"
                    type={inputType1}
                    placeholder="Enter your password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="text-primary focus:outline-4 focus:border-1 autofill-bg-white outline-accent w-full py-3 pl-10 bg-primary/10 rounded-xl"
                  />
                  <button
                    type="button"
                    className="absolute text-primary top-4 right-3"
                    onClick={() => setSeePassword(prev => !prev)}
                    tabIndex={-1}
                  >
                    {CurrentIcon1 && <CurrentIcon1 size={16} weight="bold" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm">{errors.password}</p>
                )}
              </div>
            </section>
            <section>
              <div className="border border-black rounded-md hover:scale-105 transition-all duration-200">
                <button
                  type="submit"
                  className="flex justify-center w-full bg-primary text-white py-3 font-semibold text-xl"
                  disabled={loading}
                >
                  {loading ? "Logging in..." : "Login"}
                </button>
              </div>
            </section>
            {error && (
              <p className="text-red-500 mt-2 font-medium text-xl text-center">{error}</p>
            )}
          </form>
          <div className="flex gap-1 justify-center text-lg mt-5">
            <p className="text-primary/70 font-medium">Don't have an account?</p>
            <Link href="/signup" className="hover:underline text-primary font-semibold">Sign up</Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Login