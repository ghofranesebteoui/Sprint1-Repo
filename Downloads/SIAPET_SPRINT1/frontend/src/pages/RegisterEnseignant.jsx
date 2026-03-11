import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import config from '../config';
import './AuthForms.css';

const RegisterEnseignant = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [departements, setDepartements] = useState([]);
  const [etablissements, setEtablissements] = useState([]);
  
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    role: 'ENSEIGNANT',
    telephone: '',
    sexe: '',
    ville_id: '',
    cin: '',
    grade: '',
    annees_experience: 0,
    departement_id: '',
    etablissement_id: '',
    specialite: '',
    matieres_enseignees: [],
  });

  const [matiereInput, setMatiereInput] = useState('');

  useEffect(() => {
    // Charger les établissements et départements
    // TODO: Remplacer par de vrais appels API
    setEtablissements([
      { id: 1, nom: 'Faculté des Sciences de Tunis' },
      { id: 2, nom: 'ISET de Radès' },
      { id: 3, nom: 'École Nationale d\'Ingénieurs de Tunis' },
    ]);
    
    setDepartements([
      { id: 1, nom: 'Informatique' },
      { id: 2, nom: 'Mathématiques' },
      { id: 3, nom: 'Physique' },
      { id: 4, nom: 'Génie Civil' },
      { id: 5, nom: 'Génie Électrique' },
    ]);
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const addMatiere = () => {
    if (matiereInput.trim()) {
      setFormData({
        ...formData,
        matieres_enseignees: [...formData.matieres_enseignees, matiereInput.trim()],
      });
      setMatiereInput('');
    }
  };

  const removeMatiere = (index) => {
    setFormData({
      ...formData,
      matieres_enseignees: formData.matieres_enseignees.filter((_, i) => i !== index),
    });
  };

  const handleStep1Submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(
        `${config.apiUrl}/api/auth/register/step1`,
        {
          nom: formData.nom,
          prenom: formData.prenom,
          email: formData.email,
          role: formData.role,
        }
      );

      if (response.data.success) {
        setStep(2);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const handleStep2Submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(
        `${config.apiUrl}/api/auth/register/step2`,
        formData
      );

      if (response.data.success) {
        navigate('/register-success', {
          state: {
            matricule: response.data.data.matricule,
            email: response.data.data.email,
          },
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="tabs">
          <button className="tab" onClick={() => navigate('/login')}>
            Connexion
          </button>
          <button className="tab active">Inscription</button>
        </div>

        <div className="steps">
          <div className={`step-dot ${step >= 1 ? 'on' : ''}`}></div>
          <div className={`step-dot ${step >= 2 ? 'on' : ''}`}></div>
          <span className="step-lbl">
            Étape {step} / 2 — {step === 1 ? 'Informations générales' : 'Informations professionnelles'}
          </span>
        </div>

        {error && (
          <div className="alert alert-error">
            <span className="aico">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {step === 1 && (
          <form onSubmit={handleStep1Submit}>
            <div className="fh">
              <div className="fh-eyebrow">👨‍🏫 PROFIL ENSEIGNANT</div>
              <h2>Créer votre profil</h2>
              <p>Commencez par renseigner vos informations</p>
            </div>

            <div className="sec-lbl">Identité</div>

            <div className="frow">
              <div className="ff">
                <label htmlFor="prenom">Prénom <span className="req">*</span></label>
                <input
                  type="text"
                  id="prenom"
                  name="prenom"
                  value={formData.prenom}
                  onChange={handleChange}
                  required
                  placeholder="Ahmed"
                />
              </div>

              <div className="ff">
                <label htmlFor="nom">Nom <span className="req">*</span></label>
                <input
                  type="text"
                  id="nom"
                  name="nom"
                  value={formData.nom}
                  onChange={handleChange}
                  required
                  placeholder="Ben Salah"
                />
              </div>
            </div>

            <div className="ff">
              <label htmlFor="email">Email universitaire <span className="req">*</span></label>
              <div className="fw">
                <span className="fi">✉</span>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="ico"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="ahmed.bensalah@universite.tn"
                />
              </div>
              <div className="fhint">Adresse email officielle (.tn fortement recommandée)</div>
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Vérification...' : 'Continuer → Étape 2'}
            </button>

            <div className="sw">
              Déjà inscrit(e) ? <a href="/login">Se connecter</a>
            </div>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleStep2Submit}>
            <a 
              href="#" 
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.8rem',
                color: 'var(--ink-soft)',
                textDecoration: 'none',
                marginBottom: '1.25rem'
              }}
              onClick={(e) => { e.preventDefault(); setStep(1); }}
            >
              ← Retour à l'étape 1
            </a>

            <div className="fh">
              <div className="fh-eyebrow">👨‍🏫 PROFIL ENSEIGNANT</div>
              <h2>Votre profil professionnel</h2>
              <p>Renseignez votre affectation et vos informations académiques</p>
            </div>

            <div className="sec-lbl">Informations personnelles</div>

            <div className="frow">
              <div className="ff">
                <label htmlFor="telephone">Téléphone</label>
                <div className="fw">
                  <span className="fi">📱</span>
                  <input
                    type="tel"
                    id="telephone"
                    name="telephone"
                    className="ico"
                    value={formData.telephone}
                    onChange={handleChange}
                    placeholder="+216 XX XXX XXX"
                  />
                </div>
              </div>

              <div className="ff">
                <label htmlFor="sexe">Sexe <span className="req">*</span></label>
                <select
                  id="sexe"
                  name="sexe"
                  value={formData.sexe}
                  onChange={handleChange}
                  required
                >
                  <option value="">— Sélectionner —</option>
                  <option value="HOMME">Homme</option>
                  <option value="FEMME">Femme</option>
                </select>
              </div>
            </div>

            <div className="ff">
              <label htmlFor="cin">CIN <span className="req">*</span></label>
              <input
                type="text"
                id="cin"
                name="cin"
                value={formData.cin}
                onChange={handleChange}
                required
                placeholder="12345678"
                maxLength="8"
              />
            </div>

            <div className="sec-lbl">Profil académique</div>

            <div className="ff">
              <label htmlFor="etablissement_id">Établissement <span className="req">*</span></label>
              <select
                id="etablissement_id"
                name="etablissement_id"
                value={formData.etablissement_id}
                onChange={handleChange}
                required
              >
                <option value="">— Sélectionner un établissement —</option>
                {etablissements.map((etab) => (
                  <option key={etab.id} value={etab.id}>
                    {etab.nom}
                  </option>
                ))}
              </select>
            </div>

            <div className="ff">
              <label htmlFor="departement_id">Département <span className="req">*</span></label>
              <select
                id="departement_id"
                name="departement_id"
                value={formData.departement_id}
                onChange={handleChange}
                required
              >
                <option value="">— Sélectionner un département —</option>
                {departements.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.nom}
                  </option>
                ))}
              </select>
            </div>

            <div className="frow">
              <div className="ff">
                <label htmlFor="grade">Grade universitaire <span className="req">*</span></label>
                <select
                  id="grade"
                  name="grade"
                  value={formData.grade}
                  onChange={handleChange}
                  required
                >
                  <option value="">— Sélectionner —</option>
                  <option value="Professeur">Professeur</option>
                  <option value="Maître de Conférences">Maître de Conférences</option>
                  <option value="Maître Assistant">Maître Assistant</option>
                  <option value="Assistant">Assistant</option>
                  <option value="Technologue">Technologue</option>
                </select>
              </div>

              <div className="ff">
                <label htmlFor="annees_experience">Années d'expérience</label>
                <input
                  type="number"
                  id="annees_experience"
                  name="annees_experience"
                  value={formData.annees_experience}
                  onChange={handleChange}
                  min="0"
                  placeholder="Ex: 8"
                />
              </div>
            </div>

            <div className="ff">
              <label htmlFor="specialite">Spécialité</label>
              <input
                type="text"
                id="specialite"
                name="specialite"
                value={formData.specialite}
                onChange={handleChange}
                placeholder="Ex: Intelligence Artificielle, Réseaux..."
              />
            </div>

            <div className="ff">
              <label>Matières enseignées</label>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <input
                  type="text"
                  value={matiereInput}
                  onChange={(e) => setMatiereInput(e.target.value)}
                  placeholder="Ex: Algorithmique, Bases de données..."
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addMatiere())}
                  style={{ flex: 1 }}
                />
                <button type="button" onClick={addMatiere} className="btn btn-ghost">
                  + Ajouter
                </button>
              </div>
              <div className="fhint">Ajoutez les matières que vous enseignez (minimum 1)</div>
              {formData.matieres_enseignees.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.75rem' }}>
                  {formData.matieres_enseignees.map((matiere, index) => (
                    <span
                      key={index}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.4rem 0.75rem',
                        background: 'var(--cream)',
                        border: '1.5px solid rgba(255,107,107,0.2)',
                        borderRadius: '20px',
                        fontSize: '0.85rem',
                      }}
                    >
                      {matiere}
                      <button
                        type="button"
                        onClick={() => removeMatiere(index)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--coral)',
                          cursor: 'pointer',
                          fontSize: '1rem',
                          padding: 0,
                        }}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="ff">
              <label htmlFor="ville_id">Ville <span className="req">*</span></label>
              <select
                id="ville_id"
                name="ville_id"
                value={formData.ville_id}
                onChange={handleChange}
                required
              >
                <option value="">— Sélectionner une ville —</option>
                <option value="1">Tunis</option>
                <option value="2">Carthage</option>
                <option value="3">Sfax</option>
                <option value="4">Sousse</option>
                <option value="5">Monastir</option>
                <option value="6">Bizerte</option>
              </select>
            </div>

            <div className="cbox">
              <input type="checkbox" id="terms" required />
              <label htmlFor="terms">
                J'accepte les <a href="#">conditions d'utilisation</a> et la{' '}
                <a href="#">politique de confidentialité</a> de SIAPET
              </label>
            </div>

            <div className="alert alert-warm">
              <span className="aico">📧</span>
              <span>
                Un email sera envoyé à <strong>{formData.email}</strong> avec votre{' '}
                <strong>matricule enseignant</strong> et un mot de passe temporaire à changer
                obligatoirement à la première connexion.
              </span>
            </div>

            <div className="bgrp">
              <button
                type="button"
                className="btn btn-ghost"
                style={{ flex: 1 }}
                onClick={() => setStep(1)}
              >
                ← Retour
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                style={{ flex: 2 }}
                disabled={loading}
              >
                {loading ? 'Inscription...' : 'Créer mon compte ✓'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default RegisterEnseignant;
