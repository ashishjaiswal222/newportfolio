require('dotenv').config();
const { ADMIN_LOGIN_USERNAME, ADMIN_LOGIN_PASSWORD, JWT_SECRET } = require('./src/config/config');

console.log('Testing config...');
console.log('ADMIN_LOGIN_USERNAME:', ADMIN_LOGIN_USERNAME);
console.log('ADMIN_LOGIN_PASSWORD:', ADMIN_LOGIN_PASSWORD);
console.log('JWT_SECRET:', JWT_SECRET);
console.log('All config values loaded successfully!'); 