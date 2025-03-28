import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../config/firebase";

export type UserRole = "admin" | "trainer";

export interface User extends FirebaseUser {
  role?: UserRole;
}

// Sign in with email and password
export const signIn = async (
  email: string,
  password: string,
): Promise<User> => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const user = userCredential.user as User;

    // Get user role from Firestore
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (userDoc.exists()) {
      user.role = userDoc.data().role as UserRole;
    }

    return user;
  } catch (error) {
    console.error("Error signing in:", error);
    throw error;
  }
};

// Register a new user
export const register = async (
  email: string,
  password: string,
  role: UserRole = "trainer",
): Promise<User> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const user = userCredential.user as User;

    // Store user role in Firestore
    await setDoc(doc(db, "users", user.uid), {
      email: user.email,
      role,
      createdAt: new Date().toISOString(),
    });

    user.role = role;
    return user;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};

// Sign out
export const signOut = async (): Promise<void> => {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
};

// Get current user with role
export const getCurrentUser = async (): Promise<User | null> => {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      unsubscribe();

      if (user) {
        const userWithRole = user as User;

        // Get user role from Firestore
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            userWithRole.role = userDoc.data().role as UserRole;
          }
        } catch (error) {
          console.error("Error getting user role:", error);
        }

        resolve(userWithRole);
      } else {
        resolve(null);
      }
    });
  });
};
