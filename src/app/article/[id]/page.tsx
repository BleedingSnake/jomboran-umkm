'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doc, getDoc, deleteDoc } from 'firebase/firestore';
import { User as FirebaseUser } from 'firebase/auth';
import { onAuthChange } from '@/lib/auth';
import { db } from '@/lib/firebase';
import { Article } from '@/types';

export default function ArticlePage() {
  const params = useParams();
  const router = useRouter();
  const [article, setArticle] = useState<Article | null>(null);
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthChange(setUser);
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (params.id) {
      fetchArticle(params.id as string);
    }
  }, [params.id]);

  const fetchArticle = async (id: string) => {
    try {
      const docRef = doc(db, 'articles', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setArticle({
          id: docSnap.id,
          ...docSnap.data(),
          createdAt: docSnap.data().createdAt?.toDate(),
          updatedAt: docSnap.data().updatedAt?.toDate(),
        } as Article);
      }
    } catch (error) {
      console.error('Error fetching article:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!user || !article || user.email !== article.createdBy) return;
    
    if (!confirm('Are you sure you want to delete this article?')) return;

    setDeleting(true);
    try {
      await deleteDoc(doc(db, 'articles', article.id));
      router.push('/');
    } catch (error) {
      alert('Error deleting article');
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">😕</div>
        <h2 className="text-2xl font-bold text-gray-600 mb-4">Artikel tidak ditemukan </h2>
        <button 
          onClick={() => router.push('/')}
          className="btn-primary"
        >
          ← Kembali ke Menu Utama
        </button>
      </div>
    );
  }

  const canDelete = user?.email === article.createdBy;
  const categoryIcon = article.category === 'culinary' ? '🍽️' : '🏠';
  const categoryName = article.category === 'culinary' ? 'Culinary' : 'Home Industry';

  return (
    <div className="max-w-4xl mx-auto">
      <button 
        onClick={() => router.back()}
        className="btn-secondary mb-6 flex items-center gap-2"
      >
        ← Back
      </button>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="relative">
          <img 
            src={article.imageUrl} 
            alt={article.title}
            className="w-full h-80 object-cover"
            onError={(e) => {
              e.currentTarget.src = '/api/placeholder/800/320';
            }}
          />
          <div className="absolute top-6 left-6">
            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
              article.category === 'culinary' 
                ? 'bg-orange-100 text-orange-800' 
                : 'bg-purple-100 text-purple-800'
            }`}>
              {categoryIcon} {categoryName}
            </span>
          </div>
          {canDelete && (
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="absolute top-6 right-6 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {deleting ? '⏳ Deleting...' : '🗑️ Delete'}
            </button>
          )}
        </div>
        
        <div className="p-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">{article.title}</h1>
          
          <div className="bg-blue-50 rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-bold text-blue-800 mb-2 flex items-center gap-2">
              📍 {article.businessName}
            </h2>
            <p className="text-blue-700">Featured Article</p>
          </div>
          
          <div className="prose max-w-none mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Tentang kami... </h3>
            <p className="text-gray-700 leading-relaxed text-lg">{article.description}</p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              📞 Contact Information
            </h3>
            <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
              {article.contactInfo}
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200 text-sm text-gray-500">
            <p>Disusun oleh by: {article.createdBy?.split('@')[0]}</p>
            <p>Diunggah tanggal: {article.createdAt?.toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}