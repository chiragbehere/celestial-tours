import { firestore } from './firebase';
import { collection, doc, setDoc, getDoc, getDocs, query, orderBy, limit } from 'firebase/firestore';

/**
 * Universal Firestore Cloud Persistence Bridge
 * Safely persists users, bookings, custom tour plans, and operator vendors
 * with zero-blocking async execution and offline tolerance.
 */

export async function saveUserToFirestore(userData) {
  if (!userData?.uid) return null;
  try {
    const userRef = doc(firestore, 'users', userData.uid);
    await setDoc(userRef, {
      ...userData,
      updated_at: new Date().toISOString()
    }, { merge: true });
    return userData;
  } catch (err) {
    console.warn('Firestore: saveUserToFirestore non-blocking warn:', err.message);
    return null;
  }
}

export async function getUserFromFirestore(uid) {
  if (!uid) return null;
  try {
    const userRef = doc(firestore, 'users', uid);
    const snap = await getDoc(userRef);
    return snap.exists() ? snap.data() : null;
  } catch (err) {
    console.warn('Firestore: getUserFromFirestore non-blocking warn:', err.message);
    return null;
  }
}

export async function saveBookingToFirestore(bookingData) {
  if (!bookingData) return null;
  try {
    const bookingId = bookingData.id || `bk-${Date.now()}`;
    const bookingRef = doc(firestore, 'bookings', bookingId);
    await setDoc(bookingRef, {
      ...bookingData,
      created_at: new Date().toISOString()
    }, { merge: true });
    return bookingData;
  } catch (err) {
    console.warn('Firestore: saveBookingToFirestore non-blocking warn:', err.message);
    return null;
  }
}

export async function saveVendorToFirestore(vendorData) {
  if (!vendorData) return null;
  try {
    const vendorId = vendorData.id || `vnd-${Date.now()}`;
    const vendorRef = doc(firestore, 'vendors', vendorId);
    await setDoc(vendorRef, {
      ...vendorData,
      created_at: new Date().toISOString()
    }, { merge: true });
    return vendorData;
  } catch (err) {
    console.warn('Firestore: saveVendorToFirestore non-blocking warn:', err.message);
    return null;
  }
}

export async function saveTourPlanToFirestore(tourPlan) {
  if (!tourPlan?.id) return null;
  try {
    const planRef = doc(firestore, 'tour_plans', tourPlan.id);
    await setDoc(planRef, {
      ...tourPlan,
      updated_at: new Date().toISOString()
    }, { merge: true });
    return tourPlan;
  } catch (err) {
    console.warn('Firestore: saveTourPlanToFirestore non-blocking warn:', err.message);
    return null;
  }
}
