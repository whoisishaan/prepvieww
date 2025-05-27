"use server";

import { db } from "@/firebase/admin";
import { UpdateUserProfileData, User, ChangePasswordData } from "@/types/user.type";
import { getCurrentUser } from "./auth.action";

export async function updateUserProfile(data: UpdateUserProfileData) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error("User not authenticated");
    }

    const userRef = db.collection("users").doc(user.id);
    const updateData: any = {
      ...data,
      updatedAt: new Date().toISOString(),
    };

    // Handle social links update
    if (data.socialLinks) {
      updateData.socialLinks = {
        ...(await userRef.get()).data()?.socialLinks,
        ...data.socialLinks,
      };
    }
    
    await userRef.update(updateData);

    return { success: true };
  } catch (error) {
    console.error("Error updating user profile:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to update profile" };
  }
}

export async function changePassword(data: ChangePasswordData) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error("User not authenticated");
    }

    // TODO: Implement password change with Firebase Auth
    // This is a placeholder - you'll need to implement the actual password change logic
    // using Firebase Auth's updatePassword method
    
    return { success: true };
  } catch (error) {
    console.error("Error changing password:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to change password" };
  }
}

export async function getUserProfile(userId: string): Promise<User> {
  try {
    const userDoc = await db.collection("users").doc(userId).get();
    if (!userDoc.exists) {
      throw new Error("User not found");
    }
    
    const data = userDoc.data();
    return {
      id: userDoc.id,
      name: data?.name || '',
      email: data?.email || '',
      phoneNumber: data?.phoneNumber || '',
      institution: data?.institution || '',
      location: data?.location || '',
      dateOfBirth: data?.dateOfBirth || '',
      profilePictureURL: data?.profilePictureURL || '',
      createdAt: data?.createdAt || new Date().toISOString(),
      updatedAt: data?.updatedAt || new Date().toISOString(),
    };
  } catch (error) {
    console.error("Error getting user profile:", error);
    throw error;
  }
}
