
'use client';
import { useState, useEffect } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { signInWithGoogle, signOut, onAuthChange } from '@/lib/auth';

export default function AuthButton() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthChange((user) => {
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {user ? (
        <div className="flex items-center gap-2">
          <span className="text-sm">{user.email}</span>
          <button 
            onClick={signOut}
            className="bg-red-500 px-3 py-1 rounded text-sm hover:bg-red-600"
          >
            Sign Out
          </button>
        </div>
      ) : (
        <button 
          onClick={signInWithGoogle}
          className="bg-green-500 px-3 py-1 rounded text-sm hover:bg-green-600"
        >
          Sign In
        </button>
      )}
    </div>
  );
}