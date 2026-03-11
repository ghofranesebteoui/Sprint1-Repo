import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AuthForms.css';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/auth/password-reset/request`,
        { email }
      );

      if (response.data.success) {
        setSuccess(true);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="register-container">
        <div className="register-card success-card">
          <div className="success-icon">
            <div className="checkmark">✓</div>
          </div>

          <h1>Email envoyé !</h1>
          <p className="success-message">
            Si un compte existe avec l'adresse <strong>{email}</strong>, vous recevrez un email avec un lien pour réinitialiser votre mot de passe.
          </p>

          <div className="alert alert-info">
            <span>💡</span>
            <div>
              <p>Le lien est valide pendant 1 heure.</p>
              <p>Vérifiez également votre dossier spam.</p>
            </div>
          </div>

          <button
            className="btn-primary"
            onClick={() => navigate('/login')}
          >
            Retour à la connexion
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="fh">
          <div className="fh-eyebrow">MOT DE PASSE OUBLIÉ</div>
          <h2>Réinitialiser votre mot de passe</h2>
          <p>Entrez votre email pour recevoir un lien de réinitialisation</p>
        </div>

        {error && (
          <div className="alert alert-error">
            <span>⚠️</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="votre.email@exemple.tn"
            />
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Envoi en cours...' : 'Envoyer le lien de réinitialisation'}
          </button>

          <div className="form-footer">
            <p>
              <a href="/login">← Retour à la connexion</a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
