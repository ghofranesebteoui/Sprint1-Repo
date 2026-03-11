import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './AuthForms.css';

const RegisterSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { matricule, email } = location.state || {};

  if (!matricule || !email) {
    navigate('/login');
    return null;
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="success-wrap">
          <div className="success-orb">
            ✓
          </div>

          <h2>Inscription réussie !</h2>
          <p>
            Votre compte a été créé avec succès. Un email de vérification contenant vos identifiants a été envoyé.
          </p>

          <div className="mat-badge">
            <div className="mat-lbl">📧 Email</div>
            <div className="mat-val" style={{ fontSize: '1.1rem', color: 'var(--ink)' }}>{email}</div>
          </div>

          <div className="mat-badge">
            <div className="mat-lbl">🎫 Votre Matricule</div>
            <div className="mat-val">{matricule}</div>
          </div>

          <div className="alert alert-warm">
            <span className="aico">💡</span>
            <div>
              <strong>Prochaines étapes :</strong>
              <ol style={{ margin: '0.5rem 0 0 1.2rem', paddingLeft: 0 }}>
                <li>Consultez votre boîte email (vérifiez aussi les spams)</li>
                <li>Notez votre matricule et votre mot de passe temporaire</li>
                <li>Connectez-vous avec ces identifiants</li>
                <li>Changez votre mot de passe lors de votre première connexion</li>
              </ol>
            </div>
          </div>

          <button
            className="btn btn-primary"
            onClick={() => navigate('/login')}
          >
            Se connecter maintenant →
          </button>

          <p className="sw" style={{ marginTop: '1rem', fontSize: '0.78rem' }}>
            Vous n'avez pas reçu l'email ? Vérifiez votre dossier spam ou <a href="#">contactez l'administrateur</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterSuccess;
