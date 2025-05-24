'use client';
import { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Article } from '@/types';

interface Props {
  userEmail: string;
}

export default function ArticleForm({ userEmail }: Props) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    category: 'culinary' as 'culinary' | 'home-industry',
    businessName: '',
    contactInfo: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addDoc(collection(db, 'articles'), {
        ...formData,
        createdBy: userEmail,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      
      alert('Article created successfully!');
      setFormData({
        title: '',
        description: '',
        imageUrl: '',
        category: 'culinary',
        businessName: '',
        contactInfo: '',
      });
    } catch (error) {
      alert('Error creating article');
    }
    
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-4">
      <div>
        <label className="block mb-1">Judul:</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({...formData, title: e.target.value})}
          className="w-full border p-2 rounded"
          required
        />
      </div>

      <div>
        <label className="block mb-1">Nama tempat usaha:</label>
        <input
          type="text"
          value={formData.businessName}
          onChange={(e) => setFormData({...formData, businessName: e.target.value})}
          className="w-full border p-2 rounded"
          required
        />
      </div>

      <div>
        <label className="block mb-1">Kategori:</label>
        <select
          value={formData.category}
          onChange={(e) => setFormData({...formData, category: e.target.value as any})}
          className="w-full border p-2 rounded"
        >
          <option value="culinary">Kuliner</option>
          <option value="home-industry">Home Industry</option>
        </select>
      </div>

      <div>
        <label className="block mb-1">URL Gambar:</label>
        <input
          type="url"
          value={formData.imageUrl}
          onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
          className="w-full border p-2 rounded"
          placeholder="https://example.com/image.jpg"
          required
        />
      </div>

      <div>
        <label className="block mb-1">Deskripsi:</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          className="w-full border p-2 rounded h-32"
          required
        />
      </div>

      <div>
        <label className="block mb-1">Contact Information / Informasi Pemesanan:</label>
        <textarea
          value={formData.contactInfo}
          onChange={(e) => setFormData({...formData, contactInfo: e.target.value})}
          className="w-full border p-2 rounded h-20"
          placeholder="Nomor telepon, email, alamat, dsb."
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Creating...' : 'Create Article'}
      </button>
    </form>
  );
}