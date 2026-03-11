# 📧 Configuration n8n pour SIAPET - Système d'Invitations

## 🎯 Vue d'ensemble

Ce système automatise l'envoi d'emails d'invitation personnalisés aux utilisateurs de SIAPET selon leur rôle (étudiant, enseignant, directeur, recteur). Les invitations contiennent un lien vers la page de demande d'accès où les utilisateurs peuvent soumettre leur demande.

## 🏗️ Architecture

```
┌─────────────────┐      ┌──────────────┐      ┌─────────────────┐
│  Admin Dashboard│─────▶│   Backend    │─────▶│      n8n        │
│   (Frontend)    │      │   API        │      │   Workflow      │
└─────────────────┘      └──────────────┘      └─────────────────┘
                                                         │
                                                         ▼
                                                  ┌─────────────┐
                                                  │    SMTP     │
                                                  │   Server    │
                                                  └─────────────┘
```

## 📦 Installation

### 1. Démarrer n8n avec Docker

```bash
# Démarrer les services
docker-compose up -d

# Vérifier que n8n est en cours d'exécution
docker ps
```

### 2. Accéder à n8n

- URL: http://localhost:5678
- Username: admin
- Password: siapet2026

### 3. Configurer SMTP dans n8n

1. Allez dans **Settings** → **Credentials**
2. Cliquez sur **Add Credential**
3. Sélectionnez **SMTP**
4. Remplissez les informations:
   - **Name**: SMTP Account
   - **Host**: smtp.gmail.com (ou votre serveur SMTP)
   - **Port**: 587
   - **User**: votre_email@gmail.com
   - **Password**: votre_mot_de_passe_application
   - **Secure**: false (pour port 587)

### 4. Importer le workflow

1. Dans n8n, allez dans **Workflows**
2. Cliquez sur **Import from File**
3. Sélectionnez le fichier `n8n/workflows/send-invitations.json`
4. Le workflow sera importé et prêt à l'emploi

### 5. Configurer les variables d'environnement

Ajoutez dans votre fichier `.env` du backend:

```env
# n8n Configuration
N8N_WEBHOOK_URL=http://localhost:5678/webhook/send-invitations

# SMTP Configuration (pour les autres emails)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=votre_email@gmail.com
SMTP_PASS=votre_mot_de_passe_application

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

## 🚀 Utilisation

### Depuis le Dashboard Admin

1. Connectez-vous en tant qu'administrateur
2. Cliquez sur le bouton **"Invitations"** dans le dashboard
3. Sélectionnez les rôles des destinataires:
   - 🎓 Étudiants
   - 👨‍🏫 Enseignants
   - 👔 Directeurs
   - 🎩 Recteurs
4. Cliquez sur **"Envoyer les invitations"**

### Workflow n8n

Le workflow effectue les étapes suivantes:

1. **Webhook Trigger**: Reçoit la requête du backend avec la liste des utilisateurs
2. **Préparer les données**: Transforme les données pour chaque utilisateur
3. **Personnaliser le contenu**: Génère le contenu personnalisé selon le rôle
4. **Envoyer l'email**: Envoie l'email via SMTP
5. **Réponse**: Retourne le statut au backend

## 📧 Contenu des emails

### Structure de l'email

Chaque email contient:

1. **En-tête**: Présentation de SIAPET
2. **Introduction à la plateforme**: Description générale
3. **Avantages personnalisés**: Liste des bénéfices selon le rôle
4. **Appel à l'action**: Bouton vers la page de demande d'accès
5. **Instructions**: Comment soumettre une demande

### Personnalisation par rôle

#### 🎓 Étudiants

- Accès aux notes et résultats
- Emploi du temps personnalisé
- Inscription aux examens
- Suivi de progression
- Communication avec enseignants

#### 👨‍🏫 Enseignants

- Gestion des classes
- Saisie des notes
- Listes de présence
- Analyse des performances
- Planification des cours

#### 👔 Directeurs

- Tableau de bord établissement
- Gestion du personnel
- Statistiques détaillées
- Suivi des performances
- Validation administrative

#### 🎩 Recteurs

- Vue d'ensemble université
- Analyses stratégiques
- Gestion globale
- Rapports consolidés
- Pilotage stratégique

## 🔄 Processus de demande d'accès

1. **Utilisateur reçoit l'invitation** par email
2. **Clique sur le lien** vers `/demande-acces`
3. **Remplit le formulaire**:
   - Rôle (étudiant, enseignant, directeur, recteur)
   - CIN
   - Email
   - Autres informations selon le rôle
4. **Soumet la demande**
5. **Admin reçoit la notification**
6. **Admin examine et accepte/refuse**
7. **Si accepté**: Utilisateur reçoit ses identifiants

## 🛠️ API Endpoints

### POST `/api/invitations/trigger`

Déclenche l'envoi d'invitations.

**Headers:**

```json
{
  "Authorization": "Bearer <admin_token>"
}
```

**Body:**

```json
{
  "roles": ["etudiant", "enseignant", "directeur", "recteur"]
}
```

**Response:**

```json
{
  "message": "Processus d'envoi d'invitations déclenché avec succès pour 150 utilisateur(s)",
  "users_count": 150,
  "roles": ["etudiant", "enseignant"],
  "workflow_status": {
    "success": true,
    "message": "Invitations envoyées avec succès",
    "count": 150
  }
}
```

### GET `/api/invitations/stats`

Récupère les statistiques des utilisateurs.

**Response:**

```json
{
  "total_users": 285420,
  "by_role": {
    "etudiant": 250000,
    "enseignant": 30000,
    "directeur": 5000,
    "recteur": 420
  }
}
```

## 🔧 Dépannage

### n8n ne démarre pas

```bash
# Vérifier les logs
docker logs siapet-n8n

# Redémarrer le service
docker-compose restart n8n
```

### Emails non envoyés

1. Vérifiez les credentials SMTP dans n8n
2. Vérifiez que le workflow est activé
3. Consultez les logs d'exécution dans n8n
4. Pour Gmail, utilisez un mot de passe d'application

### Webhook non accessible

1. Vérifiez que n8n est accessible sur le port 5678
2. Vérifiez la variable `N8N_WEBHOOK_URL` dans `.env`
3. Testez le webhook manuellement:

```bash
curl -X POST http://localhost:5678/webhook/send-invitations \
  -H "Content-Type: application/json" \
  -d '{
    "users": [{
      "email": "test@example.com",
      "nom": "Test",
      "prenom": "User",
      "role": "etudiant"
    }]
  }'
```

## 📊 Monitoring

### Vérifier l'état de n8n

```bash
# Vérifier les conteneurs
docker ps | grep n8n

# Voir les logs en temps réel
docker logs -f siapet-n8n
```

### Statistiques d'exécution

Dans n8n:

1. Allez dans **Executions**
2. Consultez l'historique des exécutions
3. Vérifiez les erreurs éventuelles

## 🔐 Sécurité

### Recommandations

1. **Changez les credentials par défaut** de n8n
2. **Utilisez HTTPS** en production
3. **Limitez l'accès** au port 5678
4. **Utilisez des mots de passe d'application** pour SMTP
5. **Activez l'authentification à deux facteurs** sur votre compte email

### Variables sensibles

Ne commitez jamais:

- Mots de passe SMTP
- Tokens JWT
- Credentials n8n

## 📝 Notes importantes

- Les emails sont envoyés de manière asynchrone
- Le workflow peut traiter plusieurs utilisateurs en parallèle
- Les erreurs d'envoi sont loggées dans n8n
- Le backend reçoit une confirmation une fois tous les emails envoyés

## 🆘 Support

Pour toute question ou problème:

1. Consultez les logs de n8n
2. Vérifiez la configuration SMTP
3. Testez le webhook manuellement
4. Contactez l'équipe de développement
