"use client"
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeftIcon, GoogleLogoIcon, UserIcon, EnvelopeIcon, LockIcon, EyeIcon, EyeSlashIcon } from '@phosphor-icons/react';
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { auth, db } from "../../../lib/firebase";
import Seperator from '@/components/Seperator';
import Checkbox from '@/components/Checkbox';

const SignUp = () => {
  const router = useRouter();
  const [accepted, setAccepted] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [seePassword, setSeePassword] = useState(false);
  const [seeConfirmPassword, setSeeConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [errors, setErrors] = useState({
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    });

    // Validation
    useEffect(() => {
      setErrors((prev) => ({
        ...prev,
        fullName: fullName.length < 3 ? "Full name must be at least 3 characters." : "",
      }));
    }, [fullName]);

    useEffect(() => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setErrors((prev) => ({
        ...prev,
        email: !emailRegex.test(email) ? "Invalid email address." : "",
      }));
    }, [email]);

    useEffect(() => {
      setErrors((prev) => ({
        ...prev,
        password: password.length < 6 ? "Password must be at least 6 characters." : "",
        confirmPassword: confirmPassword && confirmPassword !== password ? "Passwords do not match." : "",
      }));
    }, [password, confirmPassword]);

    // Derived values
    const inputType1 = seePassword ? "text" : "password";
    const inputType2 = seeConfirmPassword ? "text" : "password";
    const CurrentIcon1 = seePassword ? EyeSlashIcon : EyeIcon;
    const CurrentIcon2 = seeConfirmPassword ? EyeSlashIcon : EyeIcon;

    // Email/password signup
    const signup = async (e: React.FormEvent) => {
      e.preventDefault();
      // Prevent submit if there are any errors or missing required fields
      if (
        errors.fullName ||
        errors.email ||
        errors.password ||
        errors.confirmPassword ||
        !fullName.trim() ||
        !confirmPassword.trim()
      ) {
        setErrors((prev) => ({
          ...prev,
          fullName: !fullName.trim() ? "Full name is required." : prev.fullName,
          confirmPassword: !confirmPassword.trim() ? "Please confirm your password." : prev.confirmPassword,
        }));
        return;
      }

      setError("");
      setLoading(true);

      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;

        // Save user in Firestore
        await setDoc(doc(db, "users", user.uid), {
          fullName,
          email: user.email,
          createdAt: new Date(),
        });

        router.push("/todos");
      } catch (err: any) {
        if (err.code === "auth/email-already-in-use") {
          setErrors((prev) => ({ ...prev, email: "This email is already registered." }));
        } else {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    // Google signup/login
    const googleLogin = async () => {
      const provider = new GoogleAuthProvider();
      try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        // Save user in Firestore if first time
        await setDoc(
          doc(db, "users", user.uid),
          {
            email: user.email,
            createdAt: new Date(),
          },
          { merge: true }
        );
        router.push("/todos");
      } catch (err: any) {
        setError(err.message);
      }
    };
    return (
       <div>
        <div className="flex-1 py-8 max-w-lg mx-auto px-2 text-primary">
    <section
      className="px-4 sm:px-6  lg:px-8 border w-fit rounded-xl hover:bg-accent border-accent"
    >
      <Link href="/" className=" flex py-3 items-center">
        <ArrowLeftIcon className="mr-2" size="16" />
        <p>Back to Home</p>
      </Link>
    </section>
    <section
      className="border border-accent px-4 sm:px-6 lg:px-8 rounded-2xl mt-10 py-10"
    >
      <div>
        <section className="text-center pb-4">
          <h1 className="text-2xl text-primary mb-2">Create Account</h1>
          <p className="text-primary/70">
            Join Horizon to start organizing your tasks
          </p>
        </section>
        <section className="space-y-6">
           {/* Google login  */}
          <button
            onClick={googleLogin}
            className="w-full flex gap-4 items-center justify-center border hover:bg-accent border-accent rounded-xl text-primary p-2"
          >
            <GoogleLogoIcon weight="bold" size="30" />
            <p className="font-medium text-xl">Continue with Google</p>
          </button>
        </section>
        </div>
        <Seperator />
        <section>
          <form onSubmit={signup} className="space-y-8">
            <section>
              <div>
                <label
                  htmlFor="name"
                  className="block mb-2 text-primary font-medium text-xl"
                >
                  Full Name
                </label>
                <div className="relative flex">
                  <div className="absolute text-primary top-4 left-3">
                    <UserIcon size="16" weight="bold" />
                  </div>
                  <input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    className="text-primary focus:outline-4 focus:border-1 autofill-bg-white outline-accent w-full py-3 pl-10 bg-primary/10 rounded-xl"
                  />
                </div>
                {errors.fullName && (
                  <p className="text-red-500 pl-1 pt-1 text-sm">{errors.fullName}</p>
                )}
              </div>
            </section>
            <section>
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-primary font-medium text-xl"
                >
                  Email
                </label>
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
                <label
                  htmlFor="password"
                  className="block mb-2 text-primary font-medium text-xl"
                >
                  Password
                </label>
                <div className="relative flex">
                  <div className="absolute text-primary top-4 left-3">
                    <LockIcon size="16" weight="bold" />
                  </div>
                  <input
                    id="password"
                    type={inputType1}
                    placeholder="Create a password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="text-primary focus:outline-4 focus:border-1 autofill-bg-white outline-accent w-full py-3 pl-10 bg-primary/10 rounded-xl"
                  />
                  <div className="absolute text-primary top-4 right-3">
                    <CurrentIcon1
                      onClick={() => setSeePassword(!seePassword)}
                      size="16"
                      weight="bold"
                    />
                  </div>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm">{errors.password}</p>
                )}
              </div>
            </section>
            <section>
              <div>
                <label
                  htmlFor="confirm-password"
                  className="block mb-2 text-primary font-medium text-xl"
                >
                  Confirm Password
                </label>
                <div className="relative flex">
                  <div className="absolute text-primary top-4 left-3">
                    <UserIcon size="16" weight="bold" />
                  </div>
                  <input
                    id="confirm-password"
                    type={inputType2}
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    className="text-primary focus:outline-4 focus:border-1 autofill-bg-white outline-accent w-full py-3 pl-10 bg-primary/10 rounded-xl"
                  />
                  <div className="absolute text-primary top-4 right-3">
                    <CurrentIcon2
                      onClick={()=> setSeeConfirmPassword(!seeConfirmPassword)}
                      size="16"
                      weight="bold"
                    />
                  </div>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
                )}
              </div>
            </section>
            <section>
              <Checkbox
                msg1="I agree to the "
                msg2="Terms of Service"
                msg3=" and "
                msg4="Private Policy"
                checked={accepted}
                onChange={setAccepted}
              />
            </section>
            <section>
              <div
                className="border border-black rounded-md hover:scale-105 transition-all duration-200"
              >
                <button
                  type="submit"
                  className="flex justify-center w-full bg-primary text-white py-3 font-semibold text-xl"
                >
                  {loading ? "Creating Account..." : "Create Account" }
                </button>
              </div>
            </section>
            <p className="text-red-500 mt-2 font-medium text-xl text-center">
              { error }
            </p>
          </form>
          <div className="flex gap-1 justify-center text-lg mt-5">
            <p className="text-primary/70 font-medium">Already have an account?</p>
            <Link
              href="/login"
              className="hover:underline text-primary font-semibold"
              >Sign in</Link>
          </div>
        </section>
         </section>
      </div>
    </div>
    ) }

export default SignUp