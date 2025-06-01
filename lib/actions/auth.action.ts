"use server";

import { auth, db } from "@/firebase/admin";
import { cookies } from "next/headers";

interface SignUpParams {
  uid: string;
  name: string;
  email: string;
  password: string;
}

interface SignInParams {
  email: string;
  idToken: string;
}

interface User {
  uid: string;
  email?: string;
  name?: string;
  createdAt?: string;
}

// Session duration (1 week)
const SESSION_DURATION = 60 * 60 * 24 * 7;

// Set session cookie
export async function setSessionCookie(idToken: string) {
  const cookieStore = await cookies();

  // Create session cookie
  const sessionCookie = await auth.createSessionCookie(idToken, {
    expiresIn: SESSION_DURATION * 1000, // milliseconds
  });

  // Set cookie in the browser
  cookieStore.set("session", sessionCookie, {
    maxAge: SESSION_DURATION,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
  });
}

export async function signUp(params: SignUpParams) {
  const { uid, name, email } = params;

  try {
    // check if user exists in db
    const userRecord = await db.collection("users").doc(uid).get();
    if (userRecord.exists)
      return {
        success: false,
        message: "User already exists. Please sign in.",
      };

    // save user to db
    await db.collection("users").doc(uid).set({
      name,
      email,
      // profileURL,
      // resumeURL,
    });

    return {
      success: true,
      message: "Account created successfully. Please sign in.",
    };
  } catch (error: any) {
    console.error("Error creating user:", error);

    // Handle Firebase specific errors
    if (error.code === "auth/email-already-exists") {
      return {
        success: false,
        message: "This email is already in use",
      };
    }

    return {
      success: false,
      message: "Failed to create account. Please try again.",
    };
  }
}

export async function signIn(params: SignInParams) {
  const { email, idToken } = params;

  try {
    // First, verify the ID token to get the user's UID
    const decodedToken = await auth.verifyIdToken(idToken);
    const uid = decodedToken.uid;

    // Check if user exists in Firestore
    const userDoc = await db.collection("users").doc(uid).get();
    
    // If user doesn't exist in Firestore but exists in Auth (Google sign-up case)
    if (!userDoc.exists) {
      // Create user document with basic info
      await db.collection("users").doc(uid).set({
        email,
        name: decodedToken.name || '',
        createdAt: new Date().toISOString(),
      });
    }

    // Set the session cookie
    await setSessionCookie(idToken);
    
    return { success: true, message: "Signed in successfully" };
  } catch (error: any) {
    console.error('Sign in error:', error);
    return {
      success: false,
      message: error.message || "Failed to log into account. Please try again.",
    };
  }
}

// Sign out user by clearing the session cookie
export async function signOut() {
  const cookieStore = await cookies();

  cookieStore.delete("session");
}

// Get current user from session cookie
export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies();

  const sessionCookie = cookieStore.get("session")?.value;
  if (!sessionCookie) return null;

  try {
    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);

    // get user info from db
    const userRecord = await db
      .collection("users")
      .doc(decodedClaims.uid)
      .get();
    if (!userRecord.exists) return null;

    const userData = userRecord.data();
    if (!userData) return null;
    
    return {
      uid: userRecord.id,
      email: userData.email || '',
      name: userData.name,
      createdAt: userData.createdAt
    } as User;
  } catch (error) {
    console.log(error);

    // Invalid or expired session
    return null;
  }
}

// Check if user is authenticated
export async function isAuthenticated() {
  const user = await getCurrentUser();
  return !!user;
}
