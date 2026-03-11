const bcrypt = require('bcrypt');
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

async function updateAdminPassword() {
  try {
    // Generate a proper bcrypt hash for password "admin123"
    const password = 'admin123';
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    console.log('Generated hash:', hashedPassword);

    // Update the admin user in database
    const result = await pool.query(
      `UPDATE utilisateur 
       SET mot_de_passe = $1 
       WHERE numero_utilisateur = 'ADMIN-001'
       RETURNING email, numero_utilisateur`,
      [hashedPassword]
    );

    if (result.rows.length > 0) {
      console.log('✓ Admin password updated successfully!');
      console.log('Email:', result.rows[0].email);
      console.log('User ID:', result.rows[0].numero_utilisateur);
      console.log('\nYou can now login with:');
      console.log('Email: admin@siapet.rnu.tn');
      console.log('Password: admin123');
    } else {
      console.log('✗ Admin user not found');
    }

    await pool.end();
  } catch (error) {
    console.error('Error updating password:', error);
    await pool.end();
    process.exit(1);
  }
}

updateAdminPassword();
