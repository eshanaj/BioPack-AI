import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole, UserProfile, FoodTrackMode } from '../types/index.ts';

interface AuthContextType {
  user: UserProfile | null;
  login: (role: UserRole, name?: string, email?: string, organization?: string, track?: FoodTrackMode) => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  setFoodTrack: (track: FoodTrackMode) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const DEFAULT_USERS: Record<UserRole, { name: string; email: string; organization: string; track: FoodTrackMode }> = {
  industry: {
    name: 'Vikramaditya Singhania',
    email: 'v.singhania@apexfoods.in',
    organization: 'Apex FMCG Food Processing Ltd.',
    track: 'packaged'
  },
  farmer: {
    name: 'Balasaheb Shinde',
    email: 'b.shinde@sahyadrifpo.org',
    organization: 'Sahyadri Farmers Producer Co-op (FPO)',
    track: 'fresh'
  },
  startup: {
    name: 'Ananya Mehta',
    email: 'ananya@krunchysnacks.co',
    organization: 'Krunchy D2C Health Foods',
    track: 'packaged'
  },
  researcher: {
    name: 'Dr. Priya Raghavan',
    email: 'p.raghavan@cftri-lab.res.in',
    organization: 'CSIR Packaging Technology Research Division',
    track: 'packaged'
  }
};

export const clearAllSessionInputs = () => {
  try {
    const keys = Object.keys(localStorage);
    for (const key of keys) {
      // Remove all user inputs, analysis steps, validation logs, auth tokens
      // preserve only theme and language preferences
      if (key !== 'biopack_theme' && key !== 'biopack_language') {
        localStorage.removeItem(key);
      }
    }
    sessionStorage.clear();
  } catch (err) {
    console.warn('Error clearing session data from storage:', err);
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('biopack_auth_user');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }
    return null;
  });

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem('biopack_auth_user', JSON.stringify(user));
      } else {
        clearAllSessionInputs();
      }
    } catch {
      // ignore
    }
  }, [user]);

  const login = (
    role: UserRole,
    name?: string,
    email?: string,
    organization?: string,
    track?: FoodTrackMode
  ) => {
    // Reset all old inputs, steps, and validation logs on fresh login
    clearAllSessionInputs();

    const def = DEFAULT_USERS[role];
    const newUser: UserProfile = {
      id: 'usr-' + Date.now(),
      name: name || def.name,
      email: email || def.email,
      organization: organization || def.organization,
      role,
      selectedTrack: track || (role === 'farmer' ? 'fresh' : 'packaged')
    };
    setUser(newUser);
  };

  const logout = () => {
    // Immediately clear all input states, step progress, and validation logs from localStorage
    clearAllSessionInputs();
    setUser(null);
  };

  const switchRole = (role: UserRole) => {
    if (!user) {
      login(role);
      return;
    }
    const def = DEFAULT_USERS[role];
    setUser({
      ...user,
      role,
      name: def.name,
      organization: def.organization,
      selectedTrack: role === 'farmer' ? 'fresh' : user.selectedTrack
    });
  };

  const setFoodTrack = (track: FoodTrackMode) => {
    if (user) {
      setUser({
        ...user,
        selectedTrack: track
      });
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, switchRole, setFoodTrack }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
