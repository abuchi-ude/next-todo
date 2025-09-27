"use client"
import { useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";

interface AuthGuardProps {
  children: ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
      if (!user) {
        router.replace("/login");
      }
    });
    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return <div className="overlay"><div className="spinner animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent"></div><p className='mt-[10px] text-lg text-primary'>Loading...</p></div>;
  }

  return <>{children}</>;
};

export default AuthGuard;
