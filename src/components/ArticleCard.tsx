// src/components/ArticleCard.tsx
'use client';
import { useState } from 'react';
import Link from 'next/link';
import { doc, deleteDoc } from 'firebase/firestore';
import { User as FirebaseUser } from 'firebase/auth';
import { onAuthChange } from '@/lib/auth';
import { db } from '@/lib/firebase';
import { Article } from '@/types';
import { useEffect } from 'react';

interface Props {
  article: Article;
  onDelete: () => void;
}

export default function ArticleCard({ article, onDelete }: Props) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthChange(setUser);
    return unsubscribe;
  }, []);

  const handleDelete = async () => {
    if (!user || user.email !== article.createdBy) return;
    
    if (!confirm('Are you sure you want to delete this article?')) return;

    setDeleting(true);
    try {
      await deleteDoc(doc(db, 'articles', article.id));
      onDelete();
    } catch (error) {
      alert('Error deleting article');
    }
    setDeleting(false);
  };

  const canDelete = user?.email === article.createdBy;

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden card-hover">
      <div className="relative">
        <img 
          src={article.imageUrl} 
          alt={article.title}
          className="w-full h-48 object-cover"
          onError={(e) => {
            e.currentTarget.src = '/api/placeholder/400/240';
          }}
        />
        <div className="absolute top-3 left-3">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
            article.category === 'culinary' 
              ? 'bg-orange-100 text-orange-800' 
              : 'bg-purple-100 text-purple-800'
          }`}>
            {article.category === 'culinary' ? '🍽️ Culinary' : '🏠 Home Industry'}
          </span>
        </div>
        {canDelete && (
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-colors disabled:opacity-50"
            title="Delete article"
          >
            {deleting ? '⏳' : '🗑️'}
          </button>
        )}
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
          {article.title}
        </h3>
        <p className="text-blue-600 font-semibold mb-2">📍 {article.businessName}</p>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {article.description}
        </p>
        
        <div className="flex justify-between items-center">
          <div className="text-xs text-gray-400">
            By: {article.createdBy?.split('@')[0]}
          </div>
          <Link 
            href={`/article/${article.id}`}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Read More →
          </Link>
        </div>
      </div>
    </div>
  );
}