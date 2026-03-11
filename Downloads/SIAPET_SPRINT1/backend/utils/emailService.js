const nodemailer = require("nodemailer");

// Configuration du transporteur email
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Envoyer email de vérification avec mot de passe temporaire
const sendVerificationEmail = async (
  email,
  nom,
  prenom,
  matricule,
  motDePasseTemporaire,
  role,
) => {
  const roleText = role === "ETUDIANT" ? "Étudiant" : "Enseignant";

  const mailOptions = {
    from: `"SIAPET" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Bienvenue sur SIAPET - Vérification de votre compte",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Plus+Jakarta+Sans:wght@400;600;700&display=swap');
          
          body { 
            font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif; 
            line-height: 1.6; 
            color: #2D2926;
            margin: 0;
            padding: 0;
            background: #FFF4E6;
          }
          .container { 
            max-width: 600px; 
            margin: 40px auto; 
            background: white;
            border-radius: 18px;
            overflow: hidden;
            box-shadow: 0 8px 32px rgba(255,107,107,0.25);
          }
          .header { 
            background: linear-gradient(135deg, #FF6B6B 0%, #FFB088 100%); 
            color: white; 
            padding: 40px 30px; 
            text-align: center;
          }
          .header h1 {
            font-family: 'Playfair Display', serif;
            font-size: 32px;
            margin: 0 0 10px 0;
            letter-spacing: -0.02em;
          }
          .header p {
            margin: 0;
            opacity: 0.95;
            font-size: 14px;
          }
          .content { 
            padding: 40px 30px;
            background: white;
          }
          .content h2 {
            font-size: 20px;
            color: #2D2926;
            margin: 0 0 15px 0;
          }
          .info-box { 
            background: linear-gradient(145deg, rgba(255,107,107,0.06), rgba(255,176,136,0.06));
            padding: 25px; 
            margin: 25px 0; 
            border-radius: 14px; 
            border: 2px solid rgba(255,107,107,0.15);
          }
          .info-box h3 {
            margin: 0 0 15px 0;
            font-size: 16px;
            color: #2D2926;
          }
          .info-item {
            margin: 12px 0;
            font-size: 14px;
          }
          .info-item strong {
            color: #6B6560;
            font-weight: 600;
          }
          .credential { 
            display: inline-block;
            font-size: 18px; 
            font-weight: 700; 
            color: #FF6B6B;
            background: rgba(255,107,107,0.08);
            padding: 4px 12px;
            border-radius: 8px;
            margin-left: 8px;
            font-family: 'Courier New', monospace;
          }
          .warning { 
            background: rgba(255,176,136,0.08);
            padding: 20px; 
            border-radius: 12px; 
            border-left: 4px solid #FFB088; 
            margin: 25px 0;
          }
          .warning strong {
            color: #9a5a20;
            display: block;
            margin-bottom: 8px;
          }
          .warning p {
            margin: 0;
            color: #9a5a20;
            font-size: 14px;
          }
          .btn-container {
            text-align: center;
            margin: 35px 0;
          }
          .btn { 
            display: inline-block;
            background: linear-gradient(135deg, #FF6B6B 0%, #FFB088 100%); 
            color: white; 
            padding: 16px 40px; 
            text-decoration: none; 
            border-radius: 12px;
            font-weight: 700;
            font-size: 15px;
            box-shadow: 0 4px 16px rgba(255,107,107,0.3);
            transition: all 0.3s;
          }
          .btn:hover {
            box-shadow: 0 6px 24px rgba(255,107,107,0.4);
          }
          .steps {
            background: rgba(78,205,196,0.06);
            padding: 20px;
            border-radius: 12px;
            border: 1px solid rgba(78,205,196,0.2);
            margin: 25px 0;
          }
          .steps h4 {
            margin: 0 0 12px 0;
            color: #1a7a72;
            font-size: 15px;
          }
          .steps ol {
            margin: 0;
            padding-left: 20px;
          }
          .steps li {
            margin: 8px 0;
            color: #2D2926;
            font-size: 14px;
          }
          .footer { 
            text-align: center; 
            padding: 30px;
            background: #FFF4E6;
            color: #A89F96; 
            font-size: 12px;
          }
          .footer p {
            margin: 5px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎓 Bienvenue sur SIAPET</h1>
            <p>Système d'Information et d'Aide à la Planification de l'Enseignement en Tunisie</p>
          </div>
          
          <div class="content">
            <h2>Bonjour ${prenom} ${nom},</h2>
            <p>Félicitations ! Votre compte ${roleText} a été créé avec succès sur la plateforme SIAPET.</p>
            
            <div class="info-box">
              <h3>📋 Vos informations de connexion</h3>
              <div class="info-item">
                <strong>Matricule :</strong>
                <span class="credential">${matricule}</span>
              </div>
              <div class="info-item">
                <strong>Email :</strong> ${email}
              </div>
              <div class="info-item">
                <strong>Mot de passe temporaire :</strong>
                <span class="credential">${motDePasseTemporaire}</span>
              </div>
            </div>

            <div class="warning">
              <strong>⚠️ Important - Sécurité</strong>
              <p>Pour des raisons de sécurité, vous devrez <strong>obligatoirement changer votre mot de passe</strong> lors de votre première connexion.</p>
            </div>

            <div class="steps">
              <h4>💡 Prochaines étapes</h4>
              <ol>
                <li>Cliquez sur le bouton ci-dessous pour accéder à la plateforme</li>
                <li>Connectez-vous avec votre email et le mot de passe temporaire</li>
                <li>Changez votre mot de passe lors de votre première connexion</li>
                <li>Complétez votre profil si nécessaire</li>
              </ol>
            </div>

            <div class="btn-container">
              <a href="${process.env.FRONTEND_URL || "http://localhost:3000"}/login" class="btn">
                Se connecter maintenant →
              </a>
            </div>

            <p style="color: #A89F96; font-size: 13px; text-align: center; margin-top: 30px;">
              Si vous rencontrez des difficultés, contactez l'administrateur système.
            </p>
          </div>
          
          <div class="footer">
            <p><strong>© 2026 SIAPET</strong></p>
            <p>Ministère de l'Enseignement Supérieur et de la Recherche Scientifique</p>
            <p style="margin-top: 15px;">Cet email a été envoyé automatiquement, merci de ne pas y répondre.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error("Erreur envoi email:", error);
    return { success: false, error: error.message };
  }
};

// Envoyer email de réinitialisation de mot de passe
const sendPasswordResetEmail = async (email, nom, prenom, resetToken) => {
  const resetUrl = `${process.env.FRONTEND_URL || "http://localhost:3000"}/reset-password/${resetToken}`;

  const mailOptions = {
    from: `"SIAPET" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "SIAPET - Réinitialisation de votre mot de passe",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Plus+Jakarta+Sans:wght@400;600;700&display=swap');
          
          body { 
            font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif; 
            line-height: 1.6; 
            color: #2D2926;
            margin: 0;
            padding: 0;
            background: #FFF4E6;
          }
          .container { 
            max-width: 600px; 
            margin: 40px auto; 
            background: white;
            border-radius: 18px;
            overflow: hidden;
            box-shadow: 0 8px 32px rgba(255,107,107,0.25);
          }
          .header { 
            background: linear-gradient(135deg, #FF6B6B 0%, #FFB088 100%); 
            color: white; 
            padding: 40px 30px; 
            text-align: center;
          }
          .header h1 {
            font-family: 'Playfair Display', serif;
            font-size: 32px;
            margin: 0;
            letter-spacing: -0.02em;
          }
          .content { 
            padding: 40px 30px;
            background: white;
          }
          .content h2 {
            font-size: 20px;
            color: #2D2926;
            margin: 0 0 15px 0;
          }
          .warning { 
            background: rgba(255,176,136,0.08);
            padding: 20px; 
            border-radius: 12px; 
            border-left: 4px solid #FFB088; 
            margin: 25px 0;
          }
          .warning strong {
            color: #9a5a20;
            display: block;
            margin-bottom: 8px;
          }
          .warning p {
            margin: 0;
            color: #9a5a20;
            font-size: 14px;
          }
          .btn-container {
            text-align: center;
            margin: 35px 0;
          }
          .btn { 
            display: inline-block;
            background: linear-gradient(135deg, #FF6B6B 0%, #FFB088 100%); 
            color: white; 
            padding: 16px 40px; 
            text-decoration: none; 
            border-radius: 12px;
            font-weight: 700;
            font-size: 15px;
            box-shadow: 0 4px 16px rgba(255,107,107,0.3);
          }
          .footer { 
            text-align: center; 
            padding: 30px;
            background: #FFF4E6;
            color: #A89F96; 
            font-size: 12px;
          }
          .footer p {
            margin: 5px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 Réinitialisation de mot de passe</h1>
          </div>
          
          <div class="content">
            <h2>Bonjour ${prenom} ${nom},</h2>
            <p>Vous avez demandé la réinitialisation de votre mot de passe SIAPET.</p>
            
            <p>Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe :</p>

            <div class="btn-container">
              <a href="${resetUrl}" class="btn">
                Réinitialiser mon mot de passe →
              </a>
            </div>

            <div class="warning">
              <strong>⚠️ Important - Sécurité</strong>
              <p>Ce lien est valide pendant <strong>1 heure</strong>. Si vous n'avez pas demandé cette réinitialisation, ignorez cet email et votre mot de passe restera inchangé.</p>
            </div>

            <p style="color: #A89F96; font-size: 13px; text-align: center; margin-top: 30px;">
              Si le bouton ne fonctionne pas, copiez ce lien dans votre navigateur :<br>
              <span style="word-break: break-all; color: #FF6B6B;">${resetUrl}</span>
            </p>
          </div>
          
          <div class="footer">
            <p><strong>© 2026 SIAPET</strong></p>
            <p>Ministère de l'Enseignement Supérieur et de la Recherche Scientifique</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error("Erreur envoi email:", error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail,
};

// Envoyer email d'acceptation de demande avec identifiants
const sendAccessGrantedEmail = async ({
  email,
  nom,
  prenom,
  numeroUtilisateur,
  motDePasse,
  matricule,
  typeActeur,
}) => {
  const roleText = {
    etudiant: "Étudiant",
    enseignant: "Enseignant",
    directeur: "Directeur",
    recteur: "Recteur",
  }[typeActeur];

  const mailOptions = {
    from: `"SIAPET" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "SIAPET - Votre demande d'accès a été acceptée ! 🎉",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Plus+Jakarta+Sans:wght@400;600;700&display=swap');
          
          body { 
            font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif; 
            line-height: 1.6; 
            color: #2D2926;
            margin: 0;
            padding: 0;
            background: #FFF4E6;
          }
          .container { 
            max-width: 600px; 
            margin: 40px auto; 
            background: white;
            border-radius: 18px;
            overflow: hidden;
            box-shadow: 0 8px 32px rgba(78,205,196,0.25);
          }
          .header { 
            background: linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%); 
            color: white; 
            padding: 40px 30px; 
            text-align: center;
          }
          .header h1 {
            font-family: 'Playfair Display', serif;
            font-size: 32px;
            margin: 0 0 10px 0;
            letter-spacing: -0.02em;
          }
          .header p {
            margin: 0;
            opacity: 0.95;
            font-size: 14px;
          }
          .content { 
            padding: 40px 30px;
            background: white;
          }
          .content h2 {
            font-size: 20px;
            color: #2D2926;
            margin: 0 0 15px 0;
          }
          .success-badge {
            background: linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%);
            color: white;
            padding: 12px 24px;
            border-radius: 50px;
            display: inline-block;
            font-weight: 700;
            font-size: 14px;
            margin: 20px 0;
          }
          .info-box { 
            background: linear-gradient(145deg, rgba(78,205,196,0.06), rgba(68,160,141,0.06));
            padding: 25px; 
            margin: 25px 0; 
            border-radius: 14px; 
            border: 2px solid rgba(78,205,196,0.15);
          }
          .info-box h3 {
            margin: 0 0 15px 0;
            font-size: 16px;
            color: #2D2926;
          }
          .info-item {
            margin: 12px 0;
            font-size: 14px;
          }
          .info-item strong {
            color: #6B6560;
            font-weight: 600;
          }
          .credential { 
            display: inline-block;
            font-size: 18px; 
            font-weight: 700; 
            color: #4ECDC4;
            background: rgba(78,205,196,0.08);
            padding: 4px 12px;
            border-radius: 8px;
            margin-left: 8px;
            font-family: 'Courier New', monospace;
          }
          .warning { 
            background: rgba(255,176,136,0.08);
            padding: 20px; 
            border-radius: 12px; 
            border-left: 4px solid #FFB088; 
            margin: 25px 0;
          }
          .warning strong {
            color: #9a5a20;
            display: block;
            margin-bottom: 8px;
          }
          .warning p {
            margin: 0;
            color: #9a5a20;
            font-size: 14px;
          }
          .btn-container {
            text-align: center;
            margin: 35px 0;
          }
          .btn { 
            display: inline-block;
            background: linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%); 
            color: white; 
            padding: 16px 40px; 
            text-decoration: none; 
            border-radius: 12px;
            font-weight: 700;
            font-size: 15px;
            box-shadow: 0 4px 16px rgba(78,205,196,0.3);
            transition: all 0.3s;
          }
          .btn:hover {
            box-shadow: 0 6px 24px rgba(78,205,196,0.4);
          }
          .steps {
            background: rgba(78,205,196,0.06);
            padding: 20px;
            border-radius: 12px;
            border: 1px solid rgba(78,205,196,0.2);
            margin: 25px 0;
          }
          .steps h4 {
            margin: 0 0 12px 0;
            color: #1a7a72;
            font-size: 15px;
          }
          .steps ol {
            margin: 0;
            padding-left: 20px;
          }
          .steps li {
            margin: 8px 0;
            color: #2D2926;
            font-size: 14px;
          }
          .footer { 
            text-align: center; 
            padding: 30px;
            background: #FFF4E6;
            color: #A89F96; 
            font-size: 12px;
          }
          .footer p {
            margin: 5px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Félicitations !</h1>
            <p>Votre demande d'accès a été acceptée</p>
          </div>
          
          <div class="content">
            <h2>Bonjour ${prenom} ${nom},</h2>
            
            <div class="success-badge">
              ✓ Demande acceptée - Compte ${roleText} créé
            </div>
            
            <p>Nous avons le plaisir de vous informer que votre demande d'accès à la plateforme SIAPET a été <strong>acceptée</strong> par l'administration.</p>
            
            <div class="info-box">
              <h3>🔑 Vos identifiants de connexion</h3>
              <div class="info-item">
                <strong>Numéro utilisateur :</strong>
                <span class="credential">${numeroUtilisateur}</span>
              </div>
              ${matricule ? `<div class="info-item"><strong>Matricule :</strong><span class="credential">${matricule}</span></div>` : ""}
              <div class="info-item">
                <strong>Email :</strong> ${email}
              </div>
              <div class="info-item">
                <strong>Mot de passe temporaire :</strong>
                <span class="credential">${motDePasse}</span>
              </div>
            </div>

            <div class="warning">
              <strong>⚠️ Important - Sécurité</strong>
              <p>Pour des raisons de sécurité, vous devrez <strong>obligatoirement changer votre mot de passe</strong> lors de votre première connexion.</p>
            </div>

            <div class="steps">
              <h4>💡 Prochaines étapes</h4>
              <ol>
                <li>Cliquez sur le bouton ci-dessous pour accéder à la plateforme</li>
                <li>Connectez-vous avec votre email et le mot de passe temporaire</li>
                <li>Changez votre mot de passe lors de votre première connexion</li>
                <li>Complétez votre profil et explorez les fonctionnalités</li>
              </ol>
            </div>

            <div class="btn-container">
              <a href="${process.env.FRONTEND_URL || "http://localhost:3000"}/login" class="btn">
                Accéder à SIAPET →
              </a>
            </div>

            <p style="color: #A89F96; font-size: 13px; text-align: center; margin-top: 30px;">
              Si vous rencontrez des difficultés, contactez l'administrateur système.
            </p>
          </div>
          
          <div class="footer">
            <p><strong>© 2026 SIAPET</strong></p>
            <p>Ministère de l'Enseignement Supérieur et de la Recherche Scientifique</p>
            <p style="margin-top: 15px;">Cet email a été envoyé automatiquement, merci de ne pas y répondre.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error("Erreur envoi email:", error);
    return { success: false, error: error.message };
  }
};

// Envoyer un email générique (pour le broadcast)
const sendEmail = async (to, subject, message) => {
  const mailOptions = {
    from: `"SIAPET" <${process.env.SMTP_USER}>`,
    to: to,
    subject: subject,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Plus+Jakarta+Sans:wght@400;600;700&display=swap');
          
          body { 
            font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif; 
            line-height: 1.6; 
            color: #2D2926;
            margin: 0;
            padding: 0;
            background: #FFF4E6;
          }
          .container { 
            max-width: 600px; 
            margin: 40px auto; 
            background: white;
            border-radius: 18px;
            overflow: hidden;
            box-shadow: 0 8px 32px rgba(255,107,107,0.25);
          }
          .header { 
            background: linear-gradient(135deg, #FF6B6B 0%, #FFB088 100%); 
            color: white; 
            padding: 40px 30px; 
            text-align: center;
          }
          .header h1 {
            font-family: 'Playfair Display', serif;
            font-size: 28px;
            margin: 0;
            letter-spacing: -0.02em;
          }
          .content { 
            padding: 40px 30px;
            background: white;
          }
          .message {
            white-space: pre-wrap;
            line-height: 1.8;
            color: #2D2926;
            font-size: 15px;
          }
          .footer { 
            text-align: center; 
            padding: 30px;
            background: #FFF4E6;
            color: #A89F96; 
            font-size: 12px;
          }
          .footer p {
            margin: 5px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📧 ${subject}</h1>
          </div>
          
          <div class="content">
            <div class="message">${message.replace(/\n/g, '<br>')}</div>
          </div>
          
          <div class="footer">
            <p><strong>© 2026 SIAPET</strong></p>
            <p>Ministère de l'Enseignement Supérieur et de la Recherche Scientifique</p>
            <p style="margin-top: 15px;">Cet email a été envoyé automatiquement, merci de ne pas y répondre.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error("Erreur envoi email:", error);
    throw error;
  }
};

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendAccessGrantedEmail,
  sendEmail,
};
