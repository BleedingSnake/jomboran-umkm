export interface Article {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: 'culinary' | 'home-industry';
  businessName: string;
  contactInfo: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  uid: string;
  email: string;
  displayName?: string;
}