import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { getUserProfile } from "@/lib/actions/user.action";
import { ProfileForm } from "@/components/ProfileForm";
import { User } from "@/types/user.type";
import Link from "next/link";
import { Button } from "@/components/ui/button";

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
  
  if (!currentUser?.uid) {
    return notFound();
  }

  try {
    const userData = await getUserProfile(currentUser.uid);
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
  } catch (error) {
    console.error("Error loading profile:", error);
    return (
      <div className="container mx-auto py-10">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">Profile</h1>
          <p className="text-destructive">
            {error instanceof Error ? error.message : 'Error loading profile. Please try again later.'}
          </p>
          <Button asChild>
            <Link href="/">
              Return Home
            </Link>
          </Button>
        </div>
      </div>
    );
  }
}
