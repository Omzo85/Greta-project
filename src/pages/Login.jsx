import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

function Login() {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  });
  const { login, error, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Si l'utilisateur est déjà connecté, rediriger vers la page d'accueil
  if (user) {
    navigate('/');
    return null;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLoginMode) {
      const success = login(formData.email, formData.password);
      if (success) {
        // Rediriger vers la page précédente ou l'accueil
        const from = location.state?.from?.pathname || '/';
        navigate(from);
      }
    } else {
      // Vérification des mots de passe
      if (formData.password !== formData.confirmPassword) {
        alert("Les mots de passe ne correspondent pas");
        return;
      }
      // Simulation de l'inscription
      alert("Inscription réussie ! Vous pouvez maintenant vous connecter.");
      setIsLoginMode(true);
      setFormData({
        email: '',
        password: '',
        confirmPassword: '',
        name: ''
      });
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleForgotPassword = () => {
    if (!formData.email) {
      alert("Veuillez entrer votre email pour réinitialiser votre mot de passe");
      return;
    }
    alert(`Un email de réinitialisation a été envoyé à ${formData.email}`);
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>{isLoginMode ? 'Connexion' : 'Inscription'}</h2>
        {error && <div className="error-message">{error}</div>}
        
        {!isLoginMode && (
          <div className="form-group">
            <label htmlFor="name">Nom complet</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required={!isLoginMode}
            />
          </div>
        )}

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Mot de passe</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        {!isLoginMode && (
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required={!isLoginMode}
            />
          </div>
        )}

        <button type="submit" className="login-button">
          {isLoginMode ? 'Se connecter' : 'S\'inscrire'}
        </button>

        {isLoginMode && (
          <button 
            type="button" 
            className="forgot-password-button"
            onClick={handleForgotPassword}
          >
            Mot de passe oublié ?
          </button>
        )}

        <button 
          type="button" 
          className="switch-mode-button"
          onClick={() => {
            setIsLoginMode(!isLoginMode);
            setFormData({
              email: '',
              password: '',
              confirmPassword: '',
              name: ''
            });
          }}
        >
          {isLoginMode ? 'Créer un compte' : 'Déjà inscrit ? Se connecter'}
        </button>

        {isLoginMode && (
          <p className="login-info">
            Pour tester : <br />
            Email : test@example.com<br />
            Mot de passe : password123
          </p>
        )}
      </form>
    </div>
  );
}

export default Login;