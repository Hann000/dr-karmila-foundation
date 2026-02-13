import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

// Versi tanpa Base44: semua user dianggap tidak perlu login
export const AuthProvider = ({ children }) => {
  const [user] = useState(null);
  const [isAuthenticated] = useState(false);
  const [isLoadingAuth] = useState(false);
  const [isLoadingPublicSettings] = useState(false);
  const [authError] = useState(null);
  const [appPublicSettings] = useState(null);

  const logout = () => {
    // Tidak melakukan apa-apa karena tidak ada sistem auth eksternal
  };

  const navigateToLogin = () => {
    // Tidak ada halaman login eksternal, bisa diarahkan ke halaman tertentu jika nanti ditambah
  };

  const checkAppState = () => {
    // Dikosongkan, karena tidak lagi cek ke Base44
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      isLoadingAuth,
      isLoadingPublicSettings,
      authError,
      appPublicSettings,
      logout,
      navigateToLogin,
      checkAppState
    }}>
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
