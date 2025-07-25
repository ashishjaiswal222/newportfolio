# Contact Management Backend API

A production-ready, portable backend for contact form management, email notifications, and admin replies. Easily integrate with any frontend project using the documented RESTful endpoints.

---

## Features
- Contact form submission (with first/last name, email, subject, message, etc.)
- Admin panel endpoints for listing, updating, deleting, and replying to contacts
- Email notifications to admin and user (with cyberpunk-styled HTML)
- File attachments for admin replies
- PostgreSQL database via TypeORM
- Nodemailer for email
- Multer for file uploads
- Robust error handling
- Environment-based configuration

---

## Setup

1. **Clone the repository** (or copy the backend folder to your project)
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Configure environment variables:**
   - Copy `.env.example` to `.env` and fill in your values.
4. **Run database migrations or let TypeORM sync:**
   - By default, TypeORM will sync the schema.
5. **Start the server:**
   ```bash
   npm run dev
   # or
   npx ts-node-dev src/server.ts
   ```

---

## Environment Variables
See `.env.example` for all required variables:
- Database: `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`
- Email: `COMPANY_EMAIL`, `COMPANY_EMAIL_PASSWORD`, `COMPANY_SENDER_NAME`, `ADMIN_EMAIL`, `BCC_EMAIL`

---

## API Documentation

### 1. Create Contact
- **Endpoint:** `POST /contacts`
- **Body (JSON):**
  ```json
  {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "1234567890", // optional
    "subject": "Hello",
    "message": "Hi, I want to connect!",
    "source": "portfolio" // optional
  }
  ```
- **Response:** `{ message: "Contact created and admin notified." }`

### 2. List Contacts
- **Endpoint:** `GET /contacts`
- **Response:** Array of contact objects (with replies)

### 3. Update Contact Status
- **Endpoint:** `PUT /contacts/:id/status`
- **Body (JSON):** `{ "status": "read" | "replied" }`
- **Response:** `{ message: "Contact status updated.", contact }`

### 4. Delete Contact
- **Endpoint:** `DELETE /contacts/:id`
- **Response:** `{ message: "Contact deleted." }`

### 5. Reply to Contact
- **Endpoint:** `POST /contacts/:id/reply`
- **Content-Type:** `multipart/form-data`
- **Fields:**
  - `message`: string (required)
  - `attachments`: file(s) (optional)
- **Response:** `{ message: "Reply sent and saved.", reply }`

---

## Integration Instructions

- Import and use the router in your Express app:
  ```ts
  import contactRoutes from './routes/contact.routes';
  app.use('/contacts', contactRoutes);
  ```
- Ensure your `.env` is configured.
- The backend is portable and can be dropped into any Node.js/Express project.
- Frontend should POST to `/contacts` and use the documented endpoints.

---

## Security & Production Notes
- Use strong, unique passwords for your database and email.
- Use Gmail App Passwords for `COMPANY_EMAIL_PASSWORD` if using Gmail.
- Set up CORS as needed for your frontend domain.
- Consider adding rate limiting and input validation for extra security.
- Sanitize file uploads and limit file types/sizes in production.

---

## License
MIT
