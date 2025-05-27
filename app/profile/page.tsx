import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { getUserProfile } from "@/lib/actions/user.action";
import { ProfileForm } from "@/components/ProfileForm";
import { User } from "@/types/user.type";

// Helper function to ensure the user object matches the User type
const mapToUser = (data: any): User => ({
  id: data.id || '',
  name: data.name || '',
  email: data.email || '',
  phoneNumber: data.phoneNumber || '',
  institution: data.institution || '',
  location: data.location || '',
  dateOfBirth: data.dateOfBirth || '',
  profilePictureURL: data.profilePictureURL || '',
  emailVerified: data.emailVerified || false,
  socialLinks: {
    linkedin: data.socialLinks?.linkedin || '',
    github: data.socialLinks?.github || '',
    twitter: data.socialLinks?.twitter || '',
    portfolio: data.socialLinks?.portfolio || '',
  },
  createdAt: data.createdAt || new Date().toISOString(),
  updatedAt: data.updatedAt || new Date().toISOString(),
});

export default async function ProfilePage() {
  const currentUser = await getCurrentUser();
  
  if (!currentUser) {
    return notFound();
  }

  const userData = await getUserProfile(currentUser.id);
  const user = mapToUser(userData);

  return (
    <div className="container mx-auto py-10">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">My Profile</h1>
          <p className="text-muted-foreground">
            Manage your personal information and preferences.
          </p>
        </div>

        <div className="bg-card rounded-lg border p-6 shadow-sm">
          <ProfileForm user={user} />
        </div>
      </div>
    </div>
  );
}
