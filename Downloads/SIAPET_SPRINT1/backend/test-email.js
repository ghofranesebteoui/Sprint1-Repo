// Script de test pour vérifier la configuration SMTP
require('dotenv').config();
const nodemailer = require('nodemailer');

const testEmailConfig = async () => {
  console.log('🔍 Test de la configuration SMTP...\n');
  
  console.log('Configuration détectée:');
  console.log('- SMTP_HOST:', process.env.SMTP_HOST);
  console.log('- SMTP_PORT:', process.env.SMTP_PORT);
  console.log('- SMTP_USER:', process.env.SMTP_USER);
  console.log('- EMAIL_FROM:', process.env.EMAIL_FROM);
  console.log('- SMTP_PASS:', process.env.SMTP_PASS ? '***configuré***' : '❌ NON CONFIGURÉ');
  console.log('');

  // Créer le transporteur
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    // Vérifier la connexion
    console.log('📡 Test de connexion au serveur SMTP...');
    await transporter.verify();
    console.log('✅ Connexion SMTP réussie!\n');

    // Envoyer un email de test
    console.log('📧 Envoi d\'un email de test...');
    const info = await transporter.sendMail({
      from: `"SIAPET Test" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER, // Envoyer à soi-même
      subject: '✅ Test SIAPET - Configuration Email Réussie',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%); color: white; padding: 30px; text-align: center; border-radius: 10px; }
            .content { padding: 30px; background: #f9f9f9; border-radius: 10px; margin-top: 20px; }
            .success { background: #d4edda; border: 1px solid #c3e6cb; color: #155724; padding: 15px; border-radius: 5px; margin: 20px 0; }
            .info { background: #d1ecf1; border: 1px solid #bee5eb; color: #0c5460; padding: 15px; border-radius: 5px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Configuration Email Réussie!</h1>
            </div>
            <div class="content">
              <div class="success">
                <strong>✅ Félicitations!</strong><br>
                Votre configuration SMTP pour SIAPET fonctionne parfaitement.
              </div>
              
              <h2>Détails de la configuration:</h2>
              <ul>
                <li><strong>Serveur SMTP:</strong> ${process.env.SMTP_HOST}</li>
                <li><strong>Port:</strong> ${process.env.SMTP_PORT}</li>
                <li><strong>Email expéditeur:</strong> ${process.env.SMTP_USER}</li>
              </ul>

              <div class="info">
                <strong>ℹ️ Prochaines étapes:</strong><br>
                Vous pouvez maintenant utiliser la fonctionnalité de diffusion d'emails dans SIAPET pour envoyer des messages groupés aux utilisateurs.
              </div>

              <p><strong>Date du test:</strong> ${new Date().toLocaleString('fr-FR')}</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log('✅ Email de test envoyé avec succès!');
    console.log('📬 Message ID:', info.messageId);
    console.log('\n🎉 Configuration SMTP validée! Vous pouvez maintenant envoyer des emails via SIAPET.\n');
    
  } catch (error) {
    console.error('\n❌ Erreur lors du test:', error.message);
    console.error('\n💡 Solutions possibles:');
    console.error('1. Vérifiez que le mot de passe d\'application Gmail est correct');
    console.error('2. Assurez-vous que la validation en deux étapes est activée sur Gmail');
    console.error('3. Vérifiez que votre pare-feu n\'bloque pas le port 587');
    console.error('4. Essayez de régénérer un nouveau mot de passe d\'application Gmail\n');
  }
};

testEmailConfig();
