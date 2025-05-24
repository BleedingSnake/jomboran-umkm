'use client';
import Link from 'next/link';
import AuthButton from './AuthButton';

export default function Navbar() {
  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold hover:text-blue-200 transition-colors">
            🏪 Produk UMKM Lokal Jomboran
          </Link>
          <div className="flex gap-6 items-center">
            <Link 
              href="/edit" 
              className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105"
            >
              ✍️ Tambahkan Artikel
            </Link>
            <AuthButton />
          </div>
        </div>
      </div>
    </nav>
  );
}