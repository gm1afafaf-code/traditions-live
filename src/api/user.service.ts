import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/constants';
import type { User, ProfileSetupFormData, PendingAccount } from '@/types';

/**
 * Convert Firestore timestamp to Date
 */
function timestampToDate(timestamp: unknown): Date {
  if (timestamp instanceof Timestamp) {
    return timestamp.toDate();
  }
  if (timestamp instanceof Date) {
    return timestamp;
  }
  return new Date();
}

/**
 * Get user by ID
 */
export async function getUserById(uid: string): Promise<User | null> {
  try {
    const userDoc = await getDoc(doc(db, COLLECTIONS.USERS, uid));

    if (!userDoc.exists()) {
      return null;
    }

    const data = userDoc.data();
    return {
      uid: userDoc.id,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      licenseNumber: data.licenseNumber,
      companyName: data.companyName,
      businessType: data.businessType,
      role: data.role,
      approved: data.approved,
      createdAt: timestampToDate(data.createdAt),
      lastSignIn: timestampToDate(data.lastSignIn),
      photoURL: data.photoURL,
    };
  } catch (error) {
    console.error('Error getting user:', error);
    throw new Error('Failed to fetch user data');
  }
}

/**
 * Create new user profile
 */
export async function createUserProfile(
  uid: string,
  email: string,
  profileData: ProfileSetupFormData
): Promise<User> {
  try {
    const userData: Omit<User, 'uid'> = {
      email,
      firstName: profileData.firstName,
      lastName: profileData.lastName,
      licenseNumber: profileData.licenseNumber,
      companyName: profileData.companyName,
      businessType: profileData.businessType,
      role: 'broker', // Default role
      approved: false, // Requires admin approval
      createdAt: new Date(),
      lastSignIn: new Date(),
    };

    await setDoc(doc(db, COLLECTIONS.USERS, uid), {
      ...userData,
      createdAt: serverTimestamp(),
      lastSignIn: serverTimestamp(),
    });

    return { uid, ...userData };
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw new Error('Failed to create user profile');
  }
}

/**
 * Update user profile
 */
export async function updateUserProfile(
  uid: string,
  updates: Partial<User>
): Promise<void> {
  try {
    const userRef = doc(db, COLLECTIONS.USERS, uid);
    await updateDoc(userRef, {
      ...updates,
      lastUpdated: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw new Error('Failed to update user profile');
  }
}

/**
 * Update last sign-in time
 */
export async function updateLastSignIn(uid: string): Promise<void> {
  try {
    const userRef = doc(db, COLLECTIONS.USERS, uid);
    await updateDoc(userRef, {
      lastSignIn: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating last sign-in:', error);
    // Don't throw - this is not critical
  }
}

/**
 * Get all users (admin only)
 */
export async function getAllUsers(): Promise<User[]> {
  try {
    const usersSnapshot = await getDocs(collection(db, COLLECTIONS.USERS));

    return usersSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        uid: doc.id,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        licenseNumber: data.licenseNumber,
        companyName: data.companyName,
        businessType: data.businessType,
        role: data.role,
        approved: data.approved,
        createdAt: timestampToDate(data.createdAt),
        lastSignIn: timestampToDate(data.lastSignIn),
        photoURL: data.photoURL,
      };
    });
  } catch (error) {
    console.error('Error getting all users:', error);
    throw new Error('Failed to fetch users');
  }
}

/**
 * Get pending account requests (admin only)
 */
export async function getPendingAccounts(): Promise<PendingAccount[]> {
  try {
    const q = query(
      collection(db, COLLECTIONS.PENDING_ACCOUNTS),
      where('status', '==', 'pending')
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        licenseNumber: data.licenseNumber,
        companyName: data.companyName,
        email: data.email,
        businessType: data.businessType,
        status: data.status,
        requestedAt: timestampToDate(data.requestedAt),
        reviewedAt: data.reviewedAt ? timestampToDate(data.reviewedAt) : undefined,
        reviewedBy: data.reviewedBy,
        notes: data.notes,
      };
    });
  } catch (error) {
    console.error('Error getting pending accounts:', error);
    throw new Error('Failed to fetch pending accounts');
  }
}

/**
 * Approve user account (admin only)
 */
export async function approveUserAccount(
  uid: string,
  role: 'admin' | 'employee' | 'broker'
): Promise<void> {
  try {
    const userRef = doc(db, COLLECTIONS.USERS, uid);
    await updateDoc(userRef, {
      approved: true,
      role,
      approvedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error approving user:', error);
    throw new Error('Failed to approve user');
  }
}

/**
 * Reject user account (admin only)
 */
export async function rejectUserAccount(uid: string, reason?: string): Promise<void> {
  try {
    const userRef = doc(db, COLLECTIONS.USERS, uid);
    await updateDoc(userRef, {
      approved: false,
      rejected: true,
      rejectedAt: serverTimestamp(),
      rejectionReason: reason,
    });
  } catch (error) {
    console.error('Error rejecting user:', error);
    throw new Error('Failed to reject user');
  }
}
