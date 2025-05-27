export interface User {
  id: string;
  name: string;
  email: string;
  profilePictureURL?: string;
  phoneNumber?: string;
  institution?: string;
  location?: string;
  dateOfBirth?: string; // Format: YYYY-MM-DD
  socialLinks?: {
    linkedin?: string;
    github?: string;
    twitter?: string;
    portfolio?: string;
  };
  emailVerified?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateUserProfileData {
  name?: string;
  phoneNumber?: string;
  institution?: string;
  location?: string;
  dateOfBirth?: string;
  profilePictureURL?: string;
  socialLinks?: {
    linkedin?: string;
    github?: string;
    twitter?: string;
    portfolio?: string;
  };
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
