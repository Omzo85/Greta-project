import React, { createContext, useContext, useState } from 'react';

// Création du contexte d'authentification
const AuthContext = createContext();

// Fournisseur d'authentification qui gère l'état de connexion
export function AuthProvider({ children }) {
  // État pour stocker les informations de l'utilisateur connecté
  const [user, setUser] = useState(null);
  // État pour gérer les messages d'erreur
  const [error, setError] = useState('');

  // Fonction de connexion (simulation)
  const login = (email, password) => {
    // Vérification des identifiants (à remplacer par une vraie API)
    if (email === "test@example.com" && password === "password123") {
      setUser({ email });
      setError('');
      return true;
    } else {
      setError('Email ou mot de passe incorrect');
      return false;
    }
  };

  // Fonction de déconnexion
  const logout = () => {
    setUser(null);
  };

  // Fournit le contexte à tous les composants enfants
  return (
    <AuthContext.Provider value={{ user, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook personnalisé pour utiliser le contexte d'authentification
export function useAuth() {
  return useContext(AuthContext);
}