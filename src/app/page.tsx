// src/app/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Article } from '@/types';
import ArticleCard from '@/components/ArticleCard';

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [filter, setFilter] = useState<'all' | 'culinary' | 'home-industry'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const q = query(collection(db, 'articles'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const articlesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      })) as Article[];
      setArticles(articlesData);
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredArticles = filter === 'all' 
    ? articles 
    : articles.filter(article => article.category === filter);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
           Produk UMKM Lokal Jomboran
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Temukan bisnis kuliner dan UMKM menarik di Jomboran!
        </p>
      </div>
      
      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <label className="block text-lg font-semibold text-gray-700 mb-3">
          🔍 Filter berdasarkan kategori:
        </label>
        <select 
          value={filter} 
          onChange={(e) => setFilter(e.target.value as any)}
          className="input-field max-w-xs"
        >
          <option value="all">🌟 Semua kategori</option>
          <option value="culinary">🍽️ Kuliner</option>
          <option value="home-industry">🏠 Home Industry</option>
        </select>
      </div>

      {filteredArticles.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📭</div>
          <h3 className="text-2xl font-semibold text-gray-600 mb-2">Belum ada artikel</h3>
          <p className="text-gray-500">Yuk, jadi yang pertama menyusun artikelnya!</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArticles.map(article => (
            <ArticleCard 
              key={article.id} 
              article={article} 
              onDelete={() => fetchArticles()} 
            />
          ))}
        </div>
      )}
    </div>
  );
}
