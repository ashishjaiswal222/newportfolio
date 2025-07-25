const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

const BASE_URL = 'http://localhost:4000/contacts';

async function testContactAPI() {
  try {
    // 1. Create Contact
    const contactData = {
      firstName: 'Test',
      lastName: 'User',
      email: 'testuser@example.com',
      phone: '1234567890',
      subject: 'Test Subject',
      message: 'This is a test message.',
      source: 'portfolio',
    };
    console.log('--- Creating Contact ---');
    const createRes = await axios.post(BASE_URL, contactData);
    console.log('Create Contact:', createRes.data);

    // 2. List All Contacts
    console.log('--- Listing Contacts ---');
    const listRes = await axios.get(BASE_URL);
    console.log('List Contacts:', listRes.data.length);
    const contact = listRes.data[0];
    if (!contact) throw new Error('No contact found for further tests.');

    // 3. Update Contact Status
    console.log('--- Updating Contact Status ---');
    const updateRes = await axios.put(`${BASE_URL}/${contact.id}/status`, { status: 'read' });
    console.log('Update Status:', updateRes.data);

    // 4. Reply to Contact (with attachment)
    console.log('--- Replying to Contact (with attachment) ---');
    const form = new FormData();
    form.append('message', 'This is an admin reply with attachment.');
    // Attach a file if available (replace with a real file path if you want to test attachments)
    const testFile = 'backend/package.json';
    if (fs.existsSync(testFile)) {
      form.append('attachments', fs.createReadStream(testFile));
    }
    const replyRes = await axios.post(`${BASE_URL}/${contact.id}/reply`, form, {
      headers: form.getHeaders(),
    });
    console.log('Reply to Contact:', replyRes.data);
    if (replyRes.data && replyRes.data.reply) {
      console.log('CC and BCC are set in backend .env and should be visible in the received email headers.');
    }

    // 5. Delete Contact
    console.log('--- Deleting Contact ---');
    const deleteRes = await axios.delete(`${BASE_URL}/${contact.id}`);
    console.log('Delete Contact:', deleteRes.data);

    console.log('All contact API tests completed successfully.');
  } catch (err) {
    console.error('--- ERROR OCCURRED ---');
    if (err.response) {
      console.error('API Error:', err.response.data);
      console.error('Status:', err.response.status);
      console.error('Headers:', err.response.headers);
    }
    if (err.config) {
      console.error('Request Config:', err.config);
    }
    if (err.stack) {
      console.error('Stack:', err.stack);
    }
    if (err.message) {
      console.error('Message:', err.message);
    }
  }
}

testContactAPI(); 