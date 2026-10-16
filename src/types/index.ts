export interface User {
  fullName: string;
  email: string;
  gender: 'Male' | 'Female' | 'Other';
  mobileNumber: string;
  address: string;
  city: string;
  password?: string;
  avatarUrl?: string;
}

export interface GalleryImage {
  id: string;
  author: string;
  width: number;
  height: number;
  url: string;
  download_url: string;
}

export type FilterCategory = 'ALL' | 'A_M' | 'N_Z';
