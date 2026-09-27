'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { auth, googleProvider, signInWithPopup, signOut as firebaseSignOut } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check localStorage for saved demo user
    const savedDemo = typeof window !== 'undefined' ? localStorage.getItem('celestial_demo_user') : null;
    if (savedDemo) {
      try {
        setUser(JSON.parse(savedDemo));
        setLoading(false);
      } catch (e) {
        localStorage.removeItem('celestial_demo_user');
      }
    }

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const userData = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0],
          photoURL: firebaseUser.photoURL,
          // If email contains 'operator' or 'admin', grant operator role
          role: firebaseUser.email?.toLowerCase().includes('operator') || 
                firebaseUser.email?.toLowerCase().includes('admin') 
                ? 'operator' 
                : 'traveler'
        };
        setUser(userData);
        if (typeof window !== 'undefined') {
          localStorage.removeItem('celestial_demo_user');
        }
      } else {
        // If no firebase user, only clear if there was no active demo user
        const currentSavedDemo = typeof window !== 'undefined' ? localStorage.getItem('celestial_demo_user') : null;
        if (!currentSavedDemo) {
          setUser(null);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const loggedUser = result.user;
      const userData = {
        uid: loggedUser.uid,
        email: loggedUser.email,
        displayName: loggedUser.displayName,
        photoURL: loggedUser.photoURL,
        role: loggedUser.email?.toLowerCase().includes('operator') || 
              loggedUser.email?.toLowerCase().includes('admin') 
              ? 'operator' 
              : 'traveler'
      };
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

    setUser(newUser);
    if (typeof window !== 'undefined') {
      localStorage.setItem('celestial_demo_user', JSON.stringify(newUser));
    }
    return newUser;
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
    <AuthContext.Provider value={{ user, loginWithGoogle, loginAsDemo, signUpWithRole, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
