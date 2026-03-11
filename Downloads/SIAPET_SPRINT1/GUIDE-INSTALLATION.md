# 🚀 Guide d'installation - Système d'invitations SIAPET avec n8n

## 📋 Prérequis

- Docker et Docker Compose installés
- Node.js (v16 ou supérieur)
- PostgreSQL (pour la base de données principale)
- Compte email avec accès SMTP (Gmail recommandé)

## 🔧 Installation étape par étape

### 1. Configuration de l'environnement

#### Backend

```bash
cd backend
cp .env.example .env
```

Éditez le fichier `.env` et configurez:

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=siapet_db
DB_USER=postgres
DB_PASSWORD=votre_mot_de_passe

# JWT
JWT_SECRET=votre_secret_jwt_securise
JWT_EXPIRES_IN=7d

# Server
PORT=5000
NODE_ENV=development
USE_DATABASE=true

# Frontend
FRONTEND_URL=http://localhost:3000

# SMTP (pour Gmail)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=votre_email@gmail.com
SMTP_PASS=votre_mot_de_passe_application

# n8n
N8N_WEBHOOK_URL=http://localhost:5678/webhook/send-invitations
```

#### Frontend

```bash
cd frontend
cp .env.example .env
```

Configurez l'URL du backend:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 2. Installation des dépendances

#### Backend

```bash
cd backend
npm install
```

#### Frontend

```bash
cd frontend
npm install
```

### 3. Configuration de Gmail pour SMTP

Si vous utilisez Gmail:

1. Allez sur https://myaccount.google.com/security
2. Activez la validation en deux étapes
3. Générez un mot de passe d'application:
   - Allez dans "Mots de passe d'application"
   - Sélectionnez "Autre (nom personnalisé)"
   - Nommez-le "SIAPET"
   - Copiez le mot de passe généré
4. Utilisez ce mot de passe dans `SMTP_PASS`

### 4. Démarrage de n8n avec Docker

```bash
# À la racine du projet
docker-compose up -d
```

Vérifiez que les services sont démarrés:

```bash
docker ps
```

Vous devriez voir:

- `siapet-n8n` (port 5678)
- `siapet-postgres-n8n` (port 5432)

### 5. Configuration de n8n

#### Accès à n8n

1. Ouvrez http://localhost:5678
2. Connectez-vous avec:
   - Username: `admin`
   - Password: `siapet2026`

#### Configuration SMTP dans n8n

1. Cliquez sur **Settings** (⚙️) en bas à gauche
2. Allez dans **Credentials**
3. Cliquez sur **Add Credential**
4. Recherchez et sélectionnez **SMTP**
5. Remplissez:
   - **Name**: `SMTP Account`
   - **Host**: `smtp.gmail.com`
   - **Port**: `587`
   - **User**: votre_email@gmail.com
   - **Password**: votre_mot_de_passe_application
   - **Secure**: Décochez (pour port 587)
6. Cliquez sur **Save**

#### Import du workflow

1. Cliquez sur **Workflows** dans le menu
2. Cliquez sur **Add Workflow** → **Import from File**
3. Sélectionnez `n8n/workflows/send-invitations.json`
4. Le workflow s'ouvre automatiquement
5. Cliquez sur le nœud **"Envoyer l'email"**
6. Dans **Credentials**, sélectionnez **SMTP Account**
7. Cliquez sur **Save** en haut à droite
8. Activez le workflow avec le toggle en haut à droite

### 6. Initialisation de la base de données

```bash
cd backend

# Créer les tables
npm run migrate

# Créer un compte admin
npm run create-admin
```

Suivez les instructions pour créer votre compte administrateur.

### 7. Démarrage de l'application

#### Backend

```bash
cd backend
npm run dev
```

Le backend démarre sur http://localhost:5000

#### Frontend

```bash
cd frontend
npm start
```

Le frontend démarre sur http://localhost:3000

## ✅ Vérification de l'installation

### 1. Tester le backend

```bash
curl http://localhost:5000/health
```

Réponse attendue:

```json
{
  "status": "OK",
  "message": "SIAPET API is running",
  "mode": "production",
  "database": "PostgreSQL"
}
```

### 2. Tester n8n

```bash
curl http://localhost:5678/healthz
```

### 3. Tester le webhook n8n

```bash
curl -X POST http://localhost:5678/webhook/send-invitations \
  -H "Content-Type: application/json" \
  -d '{
    "users": [{
      "email": "test@example.com",
      "nom": "Test",
      "prenom": "User",
      "role": "etudiant",
      "numero_utilisateur": "TEST001"
    }],
    "triggered_by": "ADMIN001",
    "triggered_at": "2026-03-10T10:00:00Z"
  }'
```

### 4. Tester l'interface

1. Ouvrez http://localhost:3000
2. Connectez-vous avec votre compte admin
3. Allez dans le dashboard admin
4. Cliquez sur **"Invitations"**
5. Sélectionnez un rôle
6. Cliquez sur **"Envoyer les invitations"**

## 🎯 Utilisation

### Envoyer des invitations

1. **Connexion admin**: http://localhost:3000/login
2. **Dashboard**: Cliquez sur "Invitations"
3. **Sélection**: Cochez les rôles souhaités
4. **Envoi**: Cliquez sur "Envoyer les invitations"

### Traiter les demandes d'accès

1. Les utilisateurs reçoivent l'email d'invitation
2. Ils cliquent sur le lien vers `/demande-acces`
3. Ils remplissent le formulaire
4. L'admin reçoit la demande dans le dashboard
5. L'admin accepte ou refuse la demande

## 🔍 Monitoring

### Logs n8n

```bash
# Voir les logs en temps réel
docker logs -f siapet-n8n

# Voir les dernières 100 lignes
docker logs --tail 100 siapet-n8n
```

### Logs backend

Les logs s'affichent dans le terminal où vous avez lancé `npm run dev`

### Exécutions n8n

Dans l'interface n8n:

1. Cliquez sur **Executions** dans le menu
2. Consultez l'historique des exécutions
3. Cliquez sur une exécution pour voir les détails

## 🛠️ Dépannage

### n8n ne démarre pas

```bash
# Arrêter tous les conteneurs
docker-compose down

# Supprimer les volumes
docker-compose down -v

# Redémarrer
docker-compose up -d
```

### Erreur SMTP

1. Vérifiez que vous utilisez un mot de passe d'application (pas votre mot de passe Gmail)
2. Vérifiez que la validation en deux étapes est activée
3. Testez les credentials dans n8n

### Webhook non accessible

1. Vérifiez que n8n est démarré: `docker ps`
2. Vérifiez le port: `curl http://localhost:5678/healthz`
3. Vérifiez la variable `N8N_WEBHOOK_URL` dans `.env`

### Base de données

```bash
# Vérifier la connexion PostgreSQL
psql -h localhost -U postgres -d siapet_db

# Lister les tables
\dt

# Quitter
\q
```

## 🔐 Sécurité en production

### Changements recommandés

1. **n8n**:

   ```yaml
   # Dans docker-compose.yml
   - N8N_BASIC_AUTH_USER=votre_username
   - N8N_BASIC_AUTH_PASSWORD=mot_de_passe_fort
   ```

2. **JWT Secret**: Générez un secret fort

   ```bash
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```

3. **HTTPS**: Utilisez un reverse proxy (nginx) avec SSL

4. **Firewall**: Limitez l'accès au port 5678

5. **Variables d'environnement**: Utilisez un gestionnaire de secrets

## 📚 Ressources

- [Documentation n8n](https://docs.n8n.io/)
- [Documentation Nodemailer](https://nodemailer.com/)
- [Documentation Sequelize](https://sequelize.org/)
- [Documentation React](https://react.dev/)

## 🆘 Support

En cas de problème:

1. Consultez les logs
2. Vérifiez la configuration
3. Testez les composants individuellement
4. Consultez la documentation
5. Contactez l'équipe de développement

## 📝 Checklist finale

- [ ] Docker et Docker Compose installés
- [ ] Node.js installé
- [ ] PostgreSQL configuré
- [ ] Fichiers `.env` créés et configurés
- [ ] Dépendances npm installées
- [ ] n8n démarré et accessible
- [ ] Credentials SMTP configurés dans n8n
- [ ] Workflow importé et activé
- [ ] Base de données initialisée
- [ ] Compte admin créé
- [ ] Backend démarré
- [ ] Frontend démarré
- [ ] Test d'envoi d'invitation réussi

Félicitations ! Votre système d'invitations SIAPET est opérationnel ! 🎉
