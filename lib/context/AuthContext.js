'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import {
  auth,
  googleProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile
} from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { saveUserToFirestore, getUserFromFirestore } from '@/lib/firebase-db';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Clean up any stale demo user that hijacked the browser session
    if (typeof window !== 'undefined') {
      const savedDemo = localStorage.getItem('celestial_demo_user');
      if (savedDemo) {
        try {
          const parsed = JSON.parse(savedDemo);
          // If it was a demo user (demo-operator-001 or demo-traveler-001), clear it so guests start logged out!
          if (parsed.uid?.startsWith('demo-')) {
            localStorage.removeItem('celestial_demo_user');
          } else {
            setUser(parsed);
          }
        } catch (e) {
          localStorage.removeItem('celestial_demo_user');
        }
      }
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        let userData = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0],
          photoURL: firebaseUser.photoURL,
          role: firebaseUser.email?.toLowerCase().includes('operator') || 
                firebaseUser.email?.toLowerCase().includes('admin') 
                ? 'operator' 
                : 'traveler'
        };

        // Sync with Firestore profile if exists
        const cloudUser = await getUserFromFirestore(firebaseUser.uid);
        if (cloudUser) {
          userData = { ...userData, ...cloudUser };
        } else {
          saveUserToFirestore(userData);
        }

        setUser(userData);
        if (typeof window !== 'undefined') {
          localStorage.setItem('celestial_demo_user', JSON.stringify(userData));
        }
      } else {
        // No authenticated Firebase user
        if (typeof window !== 'undefined') {
          const saved = localStorage.getItem('celestial_demo_user');
          if (saved) {
            try {
              const parsed = JSON.parse(saved);
              if (parsed.uid?.startsWith('demo-')) {
                localStorage.removeItem('celestial_demo_user');
                setUser(null);
              }
            } catch (e) {
              setUser(null);
            }
          } else {
            setUser(null);
          }
        } else {
          setUser(null);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithEmail = async (email, password) => {
    if (!email || !password) {
      return { success: false, error: 'Please enter both email and password.' };
    }
    try {
      const res = await signInWithEmailAndPassword(auth, email.trim(), password);
      const firebaseUser = res.user;

      let userData = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0],
        photoURL: firebaseUser.photoURL,
        role: firebaseUser.email?.toLowerCase().includes('operator') ? 'operator' : 'traveler'
      };

      const cloudUser = await getUserFromFirestore(firebaseUser.uid);
      if (cloudUser) {
        userData = { ...userData, ...cloudUser };
      } else {
        await saveUserToFirestore(userData);
      }

      setUser(userData);
      if (typeof window !== 'undefined') {
        localStorage.setItem('celestial_demo_user', JSON.stringify(userData));
      }
      return { success: true, user: userData };
    } catch (err) {
      console.error('Email sign-in error:', err);
      let friendlyMessage = err.message;
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        friendlyMessage = 'Invalid email or password. Please check and try again.';
      } else if (err.code === 'auth/invalid-email') {
        friendlyMessage = 'Please enter a valid email address.';
      } else if (err.code === 'auth/too-many-requests') {
        friendlyMessage = 'Too many failed attempts. Please reset your password or try again later.';
      }
      return { success: false, error: friendlyMessage, code: err.code };
    }
  };

  const signUpWithEmail = async (email, password, displayName, role = 'traveler') => {
    if (!email || !password || !displayName) {
      return { success: false, error: 'Full name, email, and password are required.' };
    }
    if (password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters long.' };
    }

    try {
      const res = await createUserWithEmailAndPassword(auth, email.trim(), password);
      const firebaseUser = res.user;

      if (displayName) {
        await updateProfile(firebaseUser, { displayName: displayName.trim() });
      }

      const userData = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: displayName.trim(),
        role: role,
        roleTitle: role === 'operator' ? 'Tour Operator' : 'Explorer & Traveler',
        photoURL: null,
        created_at: new Date().toISOString()
      };

      await saveUserToFirestore(userData);
      setUser(userData);
      if (typeof window !== 'undefined') {
        localStorage.setItem('celestial_demo_user', JSON.stringify(userData));
      }
      return { success: true, user: userData };
    } catch (err) {
      console.error('Email sign-up error:', err);
      let friendlyMessage = err.message;
      if (err.code === 'auth/email-already-in-use') {
        friendlyMessage = 'An account with this email already exists. Please log in instead.';
      } else if (err.code === 'auth/weak-password') {
        friendlyMessage = 'Password is too weak. Please use at least 6 characters.';
      } else if (err.code === 'auth/invalid-email') {
        friendlyMessage = 'Please enter a valid email address.';
      }
      return { success: false, error: friendlyMessage, code: err.code };
    }
  };

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const loggedUser = result.user;
      let userData = {
        uid: loggedUser.uid,
        email: loggedUser.email,
        displayName: loggedUser.displayName,
        photoURL: loggedUser.photoURL,
        role: loggedUser.email?.toLowerCase().includes('operator') || 
              loggedUser.email?.toLowerCase().includes('admin') 
              ? 'operator' 
              : 'traveler'
      };

      const cloudUser = await getUserFromFirestore(loggedUser.uid);
      if (cloudUser) {
        userData = { ...userData, ...cloudUser };
      } else {
        await saveUserToFirestore(userData);
      }

      setUser(userData);
      return { success: true, user: userData };
    } catch (error) {
      console.error("Firebase Google Auth Error:", error);
      let friendlyMessage = error.message;

      if (error.code === 'auth/configuration-not-found') {
        friendlyMessage = "Google Sign-In is not activated in your Firebase Console. Go to console.firebase.google.com -> travler-449f7 -> Authentication -> 'Sign-in method' and enable Google. (Use One-Click Demo below to test instantly!)";
      } else if (error.code === 'auth/operation-not-allowed') {
        friendlyMessage = "Google Sign-in is not enabled in Firebase Console. Go to Console > Authentication > Sign-in method > Google and toggle 'Enable'.";
      } else if (error.code === 'auth/unauthorized-domain') {
        friendlyMessage = `This domain (${window.location.hostname}) is not authorized in Firebase. Add it under Authentication > Settings > Authorized Domains.`;
      } else if (error.code === 'auth/popup-closed-by-user') {
        friendlyMessage = "Sign-in popup was closed before completing.";
      } else if (error.code === 'auth/popup-blocked') {
        friendlyMessage = "Sign-in popup was blocked by your browser. Please allow popups for localhost.";
      } else if (error.code === 'auth/network-request-failed') {
        friendlyMessage = "Network error connecting to Firebase. Check your internet connection.";
      }

      return { success: false, error: friendlyMessage, code: error.code };
    }
  };

  const loginAsDemo = (role = 'traveler') => {
    let demoUser;
    if (role === 'operator') {
      demoUser = {
        uid: 'demo-operator-001',
        email: 'operations@celestialtours.com',
        displayName: 'Rajesh Varma',
        roleTitle: 'Tour Operations & Vendor Lead',
        role: 'operator',
        photoURL: null
      };
    } else {
      demoUser = {
        uid: 'demo-traveler-001',
        email: 'arjun.mehta@traveler.in',
        displayName: 'Arjun Mehta',
        roleTitle: 'Explorer & Traveler',
        role: 'traveler',
        photoURL: null
      };
    }

    setUser(demoUser);
    if (typeof window !== 'undefined') {
      localStorage.setItem('celestial_demo_user', JSON.stringify(demoUser));
    }
    return demoUser;
  };

  const signUpWithRole = (name, email, role = 'traveler', roleTitle = '') => {
    const newUser = {
      uid: `usr-${Date.now()}`,
      email: email || `${name.toLowerCase().replace(/\s+/g, '.')}@celestial.in`,
      displayName: name || 'Team Member',
      roleTitle: roleTitle || (
        role === 'operator' ? 'Regional Tour Operator' : 'Explorer & Traveler'
      ),
      role: role,
      photoURL: null
    };

    saveUserToFirestore(newUser);
    setUser(newUser);
    if (typeof window !== 'undefined') {
      localStorage.setItem('celestial_demo_user', JSON.stringify(newUser));
    }
    return newUser;
  };

  const updateUserProfile = async (updates) => {
    if (!user) return null;
    const updated = {
      ...user,
      ...updates,
      updated_at: new Date().toISOString()
    };
    setUser(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('celestial_demo_user', JSON.stringify(updated));
    }
    await saveUserToFirestore(updated);
    return updated;
  };

  const logout = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error("Error signing out", error);
    }
    if (typeof window !== 'undefined') {
      localStorage.removeItem('celestial_demo_user');
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loginWithEmail, signUpWithEmail, loginWithGoogle, loginAsDemo, signUpWithRole, updateUserProfile, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
