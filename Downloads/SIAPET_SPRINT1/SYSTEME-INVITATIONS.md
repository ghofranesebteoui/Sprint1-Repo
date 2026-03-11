# 📧 Système d'Invitations SIAPET avec n8n

## 🎯 Vue d'ensemble du système

Ce système automatise l'envoi d'emails d'invitation personnalisés aux utilisateurs de SIAPET. Les invitations sont adaptées selon le rôle de chaque utilisateur et contiennent un lien vers la page de demande d'accès.

## 🏗️ Architecture complète

```
┌─────────────────────────────────────────────────────────────────┐
│                     FLUX COMPLET DU SYSTÈME                      │
└─────────────────────────────────────────────────────────────────┘

1. ENVOI D'INVITATIONS
   ┌──────────────┐
   │   Admin      │ Sélectionne les rôles et clique sur "Envoyer"
   └──────┬───────┘
          │
          ▼
   ┌──────────────┐
   │  Frontend    │ POST /api/invitations/trigger
   │  (React)     │ { roles: ["etudiant", "enseignant"] }
   └──────┬───────┘
          │
          ▼
   ┌──────────────┐
   │   Backend    │ 1. Récupère les utilisateurs de la BD
   │   (Node.js)  │ 2. Appelle le webhook n8n
   └──────┬───────┘
          │
          ▼
   ┌──────────────┐
   │     n8n      │ 1. Reçoit la liste des utilisateurs
   │  (Workflow)  │ 2. Personnalise chaque email
   │              │ 3. Envoie via SMTP
   └──────┬───────┘
          │
          ▼
   ┌──────────────┐
   │ Utilisateurs │ Reçoivent l'email d'invitation
   └──────────────┘

2. DEMANDE D'ACCÈS
   ┌──────────────┐
   │ Utilisateur  │ Clique sur le lien dans l'email
   └──────┬───────┘
          │
          ▼
   ┌──────────────┐
   │  Page de     │ /demande-acces
   │  demande     │ Formulaire: rôle, CIN, email, etc.
   └──────┬───────┘
          │
          ▼
   ┌──────────────┐
   │   Backend    │ POST /api/demandes-acces
   │              │ Enregistre la demande (statut: en_attente)
   └──────┬───────┘
          │
          ▼
   ┌──────────────┐
   │ Base de      │ Table: demandes_acces
   │ données      │ Statut: en_attente
   └──────────────┘

3. TRAITEMENT PAR L'ADMIN
   ┌──────────────┐
   │   Admin      │ Consulte les demandes dans le dashboard
   └──────┬───────┘
          │
          ├─── ACCEPTE ───┐
          │               ▼
          │        ┌──────────────┐
          │        │   Backend    │ 1. Crée le compte utilisateur
          │        │              │ 2. Génère mot de passe temporaire
          │        │              │ 3. Envoie email avec identifiants
          │        └──────────────┘
          │
          └─── REFUSE ────┐
                          ▼
                   ┌──────────────┐
                   │   Backend    │ Marque la demande comme refusée
                   └──────────────┘
```

## 📁 Structure des fichiers créés

```
siapet/
├── docker-compose.yml                    # Configuration Docker pour n8n
├── .gitignore                            # Fichiers à ignorer
├── README-N8N.md                         # Documentation n8n
├── GUIDE-INSTALLATION.md                 # Guide d'installation complet
├── SYSTEME-INVITATIONS.md               # Ce fichier
│
├── backend/
│   ├── .env.example                      # Variables d'environnement
│   ├── controllers/
│   │   └── invitationController.js       # Logique d'envoi d'invitations
│   ├── routes/
│   │   └── invitations.js                # Routes API invitations
│   └── server.js                         # Ajout de la route invitations
│
├── frontend/
│   └── src/
│       ├── pages/
│       │   ├── Invitations.jsx           # Page d'envoi d'invitations
│       │   └── dashboards/
│       │       └── AdminDashboard.jsx    # Bouton "Invitations" ajouté
│       └── App.jsx                       # Route /admin/invitations
│
└── n8n/
    └── workflows/
        └── send-invitations.json         # Workflow n8n
```

## 🔄 Flux détaillé

### 1. Envoi d'invitations (Admin)

**Frontend → Backend**

```javascript
// POST /api/invitations/trigger
{
  "roles": ["etudiant", "enseignant", "directeur", "recteur"]
}
```

**Backend → Base de données**

```sql
SELECT numero_utilisateur, nom, prenom, email, type_utilisateur
FROM utilisateur
WHERE type_utilisateur IN ('ETUDIANT', 'ENSEIGNANT', 'DIRECTEUR', 'RECTEUR')
```

**Backend → n8n**

```javascript
// POST http://localhost:5678/webhook/send-invitations
{
  "users": [
    {
      "numero_utilisateur": "ETU001",
      "nom": "Doe",
      "prenom": "John",
      "email": "john.doe@example.com",
      "role": "etudiant"
    },
    // ... autres utilisateurs
  ],
  "triggered_by": "ADMIN001",
  "triggered_at": "2026-03-10T10:00:00Z"
}
```

**n8n → SMTP → Utilisateurs**

- Personnalisation du contenu selon le rôle
- Envoi de l'email via SMTP
- Retour du statut au backend

### 2. Réception et demande d'accès (Utilisateur)

**Email reçu**

```
Sujet: 🎓 Rejoignez SIAPET - Plateforme Universitaire Tunisienne

Bonjour John Doe,

Découvrez SIAPET, la plateforme officielle du MESRS...

[Avantages personnalisés selon le rôle]

[Bouton: Demander mon accès →]
```

**Clic sur le bouton**

- Redirige vers: `http://localhost:3000/demande-acces`
- Formulaire pré-rempli avec l'email (si possible)

**Soumission du formulaire**

```javascript
// POST /api/demandes-acces
{
  "type_acteur": "etudiant",
  "nom": "Doe",
  "prenom": "John",
  "email": "john.doe@example.com",
  "cin": "12345678",
  "telephone": "+216 12 345 678",
  "date_naissance": "2000-01-01",
  "niveau_etude": "Licence 3",
  "specialite": "Informatique",
  "annee_universitaire": "2025-2026",
  "etablissement_souhaite": "Université de Tunis"
}
```

### 3. Traitement par l'admin

**Consultation des demandes**

- Dashboard Admin → Section "Demandes d'accès"
- Liste des demandes avec statut "en_attente"

**Acceptation**

```javascript
// POST /api/demandes-acces/:id/accepter
// Réponse:
{
  "message": "Demande acceptée avec succès",
  "user": {
    "numero_utilisateur": "ETU001",
    "email": "john.doe@example.com",
    "type_utilisateur": "ETUDIANT",
    "matricule": "MAT2026001"
  }
}
```

**Email d'acceptation envoyé**

```
Sujet: SIAPET - Votre demande d'accès a été acceptée ! 🎉

Bonjour John Doe,

Félicitations ! Votre compte a été créé.

Identifiants:
- Numéro utilisateur: ETU001
- Matricule: MAT2026001
- Email: john.doe@example.com
- Mot de passe temporaire: abc12345

[Bouton: Se connecter →]
```

## 📧 Personnalisation des emails

### Contenu commun à tous les rôles

```html
<!-- En-tête -->
<h1>🎓 Bienvenue sur SIAPET</h1>
<p>
  Système d'Information et d'Aide à la Planification de l'Enseignement en
  Tunisie
</p>

<!-- Introduction -->
<h3>📱 Qu'est-ce que SIAPET ?</h3>
<p>SIAPET est la plateforme numérique officielle du MESRS...</p>
```

### Contenu personnalisé par rôle

#### 🎓 Étudiants

```
Couleur: #43e97b (vert)
Avantages:
- 📚 Accédez à vos notes et résultats en temps réel
- 📅 Consultez votre emploi du temps personnalisé
- 📝 Inscrivez-vous aux examens en ligne
- 🎯 Suivez votre progression académique
- 💬 Communiquez avec vos enseignants
```

#### 👨‍🏫 Enseignants

```
Couleur: #4facfe (bleu)
Avantages:
- 📊 Gérez vos classes et étudiants efficacement
- ✍️ Saisissez les notes et évaluations en ligne
- 📋 Consultez les listes de présence
- 📈 Analysez les performances de vos étudiants
- 🗓️ Planifiez vos cours et examens
```

#### 👔 Directeurs

```
Couleur: #f093fb (rose)
Avantages:
- 📊 Tableau de bord complet de votre établissement
- 👥 Gestion des enseignants et du personnel
- 📈 Statistiques et rapports détaillés
- 🎯 Suivi des performances académiques
- 📋 Validation des décisions administratives
```

#### 🎩 Recteurs

```
Couleur: #667eea (violet)
Avantages:
- 🏛️ Vue d'ensemble de toute l'université
- 📊 Analyses stratégiques et KPIs
- 👥 Gestion globale des établissements
- 📈 Rapports consolidés et tendances
- 🎯 Pilotage de la stratégie universitaire
```

## 🔧 Configuration technique

### Variables d'environnement requises

```env
# Backend (.env)
N8N_WEBHOOK_URL=http://localhost:5678/webhook/send-invitations
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=votre_email@gmail.com
SMTP_PASS=votre_mot_de_passe_application
FRONTEND_URL=http://localhost:3000
```

### Ports utilisés

- **3000**: Frontend React
- **5000**: Backend Node.js
- **5432**: PostgreSQL (base de données principale)
- **5678**: n8n (interface + webhooks)
- **5432** (container): PostgreSQL pour n8n

## 📊 Base de données

### Table: demandes_acces

```sql
CREATE TABLE demandes_acces (
  id_demande SERIAL PRIMARY KEY,
  type_acteur VARCHAR(20) NOT NULL,
  nom VARCHAR(100) NOT NULL,
  prenom VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  telephone VARCHAR(20),
  date_naissance DATE,
  cin VARCHAR(20),
  niveau_etude VARCHAR(50),
  specialite VARCHAR(100),
  annee_universitaire VARCHAR(20),
  grade VARCHAR(50),
  specialite_enseignement VARCHAR(100),
  etablissement_souhaite VARCHAR(255),
  statut VARCHAR(20) DEFAULT 'en_attente',
  date_demande TIMESTAMP DEFAULT NOW(),
  date_traitement TIMESTAMP,
  traite_par VARCHAR(50),
  commentaire_admin TEXT,
  numero_utilisateur VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## 🎨 Interface utilisateur

### Page Invitations (Admin)

**Composants:**

1. **Statistiques**: Nombre d'utilisateurs par rôle
2. **Sélection des rôles**: Checkboxes avec cartes colorées
3. **Aperçu du contenu**: Description de l'email
4. **Bouton d'envoi**: Déclenche le processus

**Couleurs par rôle:**

- Étudiants: Vert (#43e97b)
- Enseignants: Bleu (#4facfe)
- Directeurs: Rose (#f093fb)
- Recteurs: Violet (#667eea)

### Page Demande d'accès (Public)

**Formulaire adaptatif:**

- Sélection du rôle
- Champs communs: nom, prénom, email, CIN, téléphone
- Champs spécifiques selon le rôle:
  - **Étudiant**: niveau d'étude, spécialité, année universitaire
  - **Enseignant**: grade, spécialité d'enseignement
  - **Directeur/Recteur**: établissement

## 🔐 Sécurité

### Authentification

- JWT pour l'API backend
- Middleware `requireAdmin` pour les routes d'invitations
- Validation des tokens à chaque requête

### Validation des données

- Validation côté frontend (React)
- Validation côté backend (Joi)
- Vérification des emails uniques

### SMTP

- Utilisation de mots de passe d'application
- Connexion sécurisée (TLS)
- Rate limiting recommandé en production

## 📈 Monitoring et logs

### n8n

- Interface d'exécution: http://localhost:5678/executions
- Logs Docker: `docker logs -f siapet-n8n`
- Historique des workflows

### Backend

- Logs console pour chaque requête
- Erreurs SMTP loggées
- Statut des webhooks

## 🚀 Déploiement en production

### Recommandations

1. **HTTPS obligatoire**
   - Certificat SSL/TLS
   - Reverse proxy (nginx)

2. **Variables d'environnement sécurisées**
   - Gestionnaire de secrets (AWS Secrets Manager, Vault)
   - Pas de .env en production

3. **Rate limiting**
   - Limiter les appels API
   - Limiter les envois d'emails

4. **Monitoring**
   - Logs centralisés (ELK, Datadog)
   - Alertes sur erreurs
   - Métriques de performance

5. **Backup**
   - Base de données PostgreSQL
   - Workflows n8n
   - Configuration

## 📝 Maintenance

### Tâches régulières

- Vérifier les logs d'erreur
- Nettoyer les anciennes demandes
- Mettre à jour les dépendances
- Tester les envois d'emails
- Vérifier l'espace disque

### Mises à jour

```bash
# Mettre à jour n8n
docker-compose pull n8n
docker-compose up -d n8n

# Mettre à jour les dépendances backend
cd backend && npm update

# Mettre à jour les dépendances frontend
cd frontend && npm update
```

## 🎯 Prochaines améliorations possibles

1. **Planification d'envois**
   - Programmer des envois à une date/heure précise
   - Envois récurrents

2. **Templates d'emails**
   - Éditeur visuel de templates
   - Plusieurs templates par rôle

3. **Statistiques avancées**
   - Taux d'ouverture des emails
   - Taux de conversion (demandes soumises)
   - Graphiques de suivi

4. **Notifications**
   - Notifications push pour l'admin
   - SMS en complément des emails

5. **Multi-langue**
   - Support arabe/français/anglais
   - Détection automatique de la langue

## 🆘 Support et documentation

- **Documentation n8n**: https://docs.n8n.io/
- **Documentation technique**: README-N8N.md
- **Guide d'installation**: GUIDE-INSTALLATION.md
- **Support**: Contactez l'équipe de développement

---

**Version**: 1.0.0  
**Date**: Mars 2026  
**Auteur**: Équipe SIAPET
