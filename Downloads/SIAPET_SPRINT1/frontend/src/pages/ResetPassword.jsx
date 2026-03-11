import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AuthForms.css';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nouveau_mot_de_passe: '',
    confirmer_mot_de_passe: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.nouveau_mot_de_passe !== formData.confirmer_mot_de_passe) {
      setError('Les mots de passe ne correspondent pas');
      setLoading(false);
      return;
    }

    if (formData.nouveau_mot_de_passe.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/auth/password-reset/confirm`,
        {
          token,
          nouveau_mot_de_passe: formData.nouveau_mot_de_passe,
        }
      );

      if (response.data.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/login');
        }, 3000);
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

          <h1>Mot de passe réinitialisé !</h1>
          <p className="success-message">
            Votre mot de passe a été changé avec succès. Vous allez être redirigé vers la page de connexion...
          </p>

          <button
            className="btn-primary"
            onClick={() => navigate('/login')}
          >
            Se connecter maintenant
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <h1>🔐 Nouveau mot de passe</h1>
          <p>Choisissez un nouveau mot de passe sécurisé</p>
        </div>

        {error && (
          <div className="alert alert-error">
            <span>⚠️</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-group">
            <label htmlFor="nouveau_mot_de_passe">Nouveau mot de passe *</label>
            <input
              type="password"
              id="nouveau_mot_de_passe"
              name="nouveau_mot_de_passe"
              value={formData.nouveau_mot_de_passe}
              onChange={handleChange}
              required
              minLength="8"
              placeholder="Minimum 8 caractères"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmer_mot_de_passe">Confirmer le mot de passe *</label>
            <input
              type="password"
              id="confirmer_mot_de_passe"
              name="confirmer_mot_de_passe"
              value={formData.confirmer_mot_de_passe}
              onChange={handleChange}
              required
              minLength="8"
              placeholder="Retapez votre mot de passe"
            />
          </div>

          <div className="alert alert-info">
            <span>💡</span>
            <div>
              <strong>Conseils pour un mot de passe sécurisé :</strong>
              <ul>
                <li>Au moins 8 caractères</li>
                <li>Mélangez majuscules et minuscules</li>
                <li>Incluez des chiffres et des caractères spéciaux</li>
                <li>Évitez les informations personnelles</li>
              </ul>
            </div>
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Réinitialisation...' : 'Réinitialiser le mot de passe'}
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

export default ResetPassword;
