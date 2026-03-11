import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import config from '../config';
import './AuthForms.css';

const RegisterEtudiant = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    role: 'ETUDIANT',
    telephone: '',
    sexe: '',
    ville_id: '',
    date_naissance: '',
    classe: '',
    niveau: '',
    cin: '',
    etablissement_id: '',
    universite_id: '',
    departement_id: '',
    specialite_id: '',
  });

  const [acceptTerms, setAcceptTerms] = useState(false);

  const [universites, setUniversites] = useState([]);
  const [etablissementsDisponibles, setEtablissementsDisponibles] = useState([]);
  const [departementsDisponibles, setDepartementsDisponibles] = useState([]);
  const [specialitesDisponibles, setSpecialitesDisponibles] = useState([]);

  // Charger toutes les universités au montage du composant
  useEffect(() => {
    const chargerUniversites = async () => {
      try {
        const res = await axios.get(`${config.apiUrl}/api/etablissements/universites`);
        setUniversites(res.data.data || []);
      } catch (err) {
        console.error('Erreur chargement universités:', err);
      }
    };

    chargerUniversites();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setError('');

    // Gestion de la sélection en cascade
    if (name === 'universite_id') {
      // Réinitialiser les champs dépendants
      setEtablissementsDisponibles([]);
      setDepartementsDisponibles([]);
      setSpecialitesDisponibles([]);
      
      setFormData(prev => ({
        ...prev,
        universite_id: value,
        etablissement_id: '',
        departement_id: '',
        specialite_id: '',
      }));

      // Charger les établissements de l'université sélectionnée
      if (value) {
        console.log('Chargement des établissements pour université:', value);
        axios.get(`${config.apiUrl}/api/etablissements?universite_id=${value}`)
          .then(res => {
            console.log('Établissements chargés:', res.data.data);
            setEtablissementsDisponibles(res.data.data || []);
          })
          .catch(err => {
            console.error('Erreur chargement établissements:', err);
            setEtablissementsDisponibles([]);
          });
      }
    } else if (name === 'etablissement_id') {
      // Réinitialiser les champs dépendants
      setDepartementsDisponibles([]);
      setSpecialitesDisponibles([]);
      
      setFormData(prev => ({
        ...prev,
        etablissement_id: value,
        departement_id: '',
        specialite_id: '',
      }));

      // Charger les départements de l'établissement sélectionné
      if (value) {
        console.log('Chargement des départements pour établissement:', value);
        axios.get(`${config.apiUrl}/api/departements?etablissement_id=${value}`)
          .then(res => {
            console.log('Départements chargés:', res.data.data);
            setDepartementsDisponibles(res.data.data || []);
          })
          .catch(err => {
            console.error('Erreur chargement départements:', err);
            setDepartementsDisponibles([]);
          });
      }
    } else if (name === 'departement_id') {
      // Réinitialiser les spécialités
      setSpecialitesDisponibles([]);
      
      setFormData(prev => ({
        ...prev,
        departement_id: value,
        specialite_id: '',
      }));

      // Charger les spécialités du département sélectionné
      if (value) {
        console.log('Chargement des spécialités pour département:', value);
        axios.get(`${config.apiUrl}/api/departements/${value}/specialites`)
          .then(res => {
            console.log('Spécialités chargées:', res.data.data);
            setSpecialitesDisponibles(res.data.data || []);
          })
          .catch(err => {
            console.error('Erreur chargement spécialités:', err);
            setSpecialitesDisponibles([]);
          });
      }
    } else {
      // Pour les autres champs, mise à jour simple
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
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
            Étape {step} / 2 — {step === 1 ? 'Informations générales' : 'Informations académiques'}
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
              <div className="fh-eyebrow">🎓 PROFIL ÉTUDIANT</div>
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
              <div className="fh-eyebrow">🎓 PROFIL ÉTUDIANT</div>
              <h2>Votre parcours académique</h2>
              <p>Sélectionnez votre établissement et votre filière</p>
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

            <div className="frow">
              <div className="ff">
                <label htmlFor="cin">CIN</label>
                <input
                  type="text"
                  id="cin"
                  name="cin"
                  value={formData.cin}
                  onChange={handleChange}
                  placeholder="12345678"
                  maxLength="8"
                />
              </div>

              <div className="ff">
                <label htmlFor="date_naissance">Date de naissance <span className="req">*</span></label>
                <input
                  type="date"
                  id="date_naissance"
                  name="date_naissance"
                  value={formData.date_naissance}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="sec-lbl">Parcours académique</div>

            <div className="ff">
              <label htmlFor="universite_id">Université <span className="req">*</span></label>
              <select
                id="universite_id"
                name="universite_id"
                value={formData.universite_id}
                onChange={handleChange}
                required
              >
                <option value="">— Sélectionnez votre université —</option>
                {universites.map(universite => (
                  <option key={universite.id} value={universite.id}>
                    {universite.nom_etablissement}
                  </option>
                ))}
              </select>
            </div>

            <div className="ff">
              <label htmlFor="etablissement_id">Établissement (Faculté / École / Institut) <span className="req">*</span></label>
              <select
                id="etablissement_id"
                name="etablissement_id"
                value={formData.etablissement_id}
                onChange={handleChange}
                required
                disabled={!formData.universite_id}
              >
                <option value="">— Sélectionnez votre établissement —</option>
                {etablissementsDisponibles.map(etablissement => (
                  <option key={etablissement.id} value={etablissement.id}>
                    {etablissement.nom_etablissement}
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
                disabled={!formData.etablissement_id}
              >
                <option value="">— Sélectionnez votre département —</option>
                {departementsDisponibles.map(departement => (
                  <option key={departement.id} value={departement.id}>
                    {departement.nom_departement}
                  </option>
                ))}
              </select>
            </div>

            <div className="ff">
              <label htmlFor="specialite_id">Spécialité <span className="req">*</span></label>
              <select
                id="specialite_id"
                name="specialite_id"
                value={formData.specialite_id}
                onChange={handleChange}
                required
                disabled={!formData.departement_id}
              >
                <option value="">— Sélectionnez votre spécialité —</option>
                {specialitesDisponibles.map(specialite => (
                  <option key={specialite.id} value={specialite.id}>
                    {specialite.nom_specialite}
                  </option>
                ))}
              </select>
            </div>

            <div className="ff">
              <label htmlFor="niveau">Niveau d'études <span className="req">*</span></label>
              <select
                id="niveau"
                name="niveau"
                value={formData.niveau}
                onChange={handleChange}
                required
              >
                <option value="">— Sélectionner votre niveau —</option>
                <option value="LICENCE">Licence</option>
                <option value="MASTER">Master</option>
                <option value="DOCTORAT">Doctorat</option>
              </select>
            </div>

            <div className="ff">
              <label htmlFor="classe">Classe</label>
              <select
                id="classe"
                name="classe"
                value={formData.classe}
                onChange={handleChange}
              >
                <option value="">— Sélectionner —</option>
                <option value="PREMIERE">Première année</option>
                <option value="DEUXIEME">Deuxième année</option>
                <option value="TROISIEME">Troisième année</option>
              </select>
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
              <input 
                type="checkbox" 
                id="terms" 
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                required 
              />
              <label htmlFor="terms">
                J'accepte les <a href="#">conditions d'utilisation</a> et la{' '}
                <a href="#">politique de confidentialité</a> de SIAPET
              </label>
            </div>

            <div className="alert alert-warm">
              <span className="aico">📧</span>
              <span>
                Un email sera envoyé à <strong>{formData.email}</strong> avec votre{' '}
                <strong>matricule unique</strong> et un mot de passe temporaire à changer
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

export default RegisterEtudiant;
