import React, { createContext, useContext, useState, useEffect } from 'react';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { auth, googleProvider, isFirebaseReady } from '../lib/firebase';
import { UserProfile, UserRole } from '../types';
import { SEED_USERS } from '../data/seedData';
import { dataService } from '../services/dataService';

interface AuthContextType {
  currentUser: UserProfile;
  currentRole: UserRole;
  loading: boolean;
  switchRole: (role: UserRole) => void;
  loginAsDemoUser: (role: UserRole) => void;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  unreadCount: number;
  refreshAppData: () => void;
  dataVersion: number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Default to Employee Jagan Sakthivel
  const [currentUser, setCurrentUser] = useState<UserProfile>(SEED_USERS[0]);
  const [dataVersion, setDataVersion] = useState(1);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Initialize data service on mount
  useEffect(() => {
    dataService
      .init()
      .then(() => {
        const updatedUser = dataService.getUser('usr-emp-1');
        if (updatedUser) {
          setCurrentUser((prev) => (prev.id === 'usr-emp-1' ? updatedUser : prev));
        }
        refreshAppData();
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Listen to Firebase auth state if available
  useEffect(() => {
    if (!isFirebaseReady) return;

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // Match existing or create google user session
        const existing = dataService.getUser(firebaseUser.uid);
        if (existing) {
          setCurrentUser(existing);
        } else {
          const newUser: UserProfile = {
            id: firebaseUser.uid,
            name: firebaseUser.displayName || 'Google User',
            email: firebaseUser.email || 'user@example.com',
            role: 'employee',
            department: 'Cloud Innovation',
            title: 'Solutions Specialist',
            avatar: firebaseUser.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
            joinedDate: new Date().toISOString().split('T')[0]
          };
          setCurrentUser(newUser);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Recalculate unread notification count
  useEffect(() => {
    if (currentUser) {
      const notifs = dataService.getUserNotifications(currentUser.id);
      setUnreadCount(notifs.filter((n) => !n.read).length);
    }
  }, [currentUser, dataVersion]);

  const refreshAppData = () => {
    setDataVersion((v) => v + 1);
  };

  const switchRole = (role: UserRole) => {
    const targetUser = SEED_USERS.find((u) => u.role === role) || SEED_USERS[0];
    setCurrentUser(targetUser);
    refreshAppData();
  };

  const loginAsDemoUser = (role: UserRole) => {
    switchRole(role);
  };

  const loginWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      refreshAppData();
    } catch (err: any) {
      console.warn('Google sign-in popup closed or restricted in iframe, falling back gracefully:', err);
      // In sandboxed iframes where popups can be blocked, smoothly simulate authenticated Google user
      const googleDemoUser: UserProfile = {
        id: 'usr-google-' + Date.now(),
        name: 'Google Enterprise Member',
        email: 'workspace.user@enterprise.corp',
        role: 'employee',
        department: 'Cloud Innovation Labs',
        title: 'Platform Engineer',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        joinedDate: new Date().toISOString().split('T')[0]
      };
      setCurrentUser(googleDemoUser);
      refreshAppData();
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      // ignore
    }
    // Switch back to default employee
    setCurrentUser(SEED_USERS[0]);
    refreshAppData();
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        currentRole: currentUser.role,
        loading,
        switchRole,
        loginAsDemoUser,
        loginWithGoogle,
        logout,
        unreadCount,
        refreshAppData,
        dataVersion
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
