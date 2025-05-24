'use client';
import { useState, useEffect } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { onAuthChange } from '@/lib/auth';
import ArticleForm from '@/components/ArticleForm';

export default function EditPage() {
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

  if (!user) {
    return (
      <div className="text-center">
        <h1 className="text-2xl mb-4">Please sign in to create or edit articles</h1>
        <p>Use the sign in button in the navigation bar.</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Create/Edit Article</h1>
      <ArticleForm userEmail={user.email!} />
    </div>
  );
}