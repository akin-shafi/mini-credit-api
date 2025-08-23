# Mini Credit Insights API

This project is a backend API service for processing user financial data, running insights, and integrating bureau checks.  
It is built with **Node.js, Express, TypeORM, MySQL**, and includes **Swagger documentation**.

---

## 🚀 Features

- User authentication with JWT
- Role-Based Access Control (RBAC) for Admin/User
- Bank statement upload and transaction parsing
- Financial insights generation (income, spending buckets, risk flags)
- Bureau report check (mocked)
- Swagger API documentation with live tokens
- Database seeder (creates default admin/user + sample statement & transactions)
- CORS whitelisting & Rate Limiting

---

## 🛠️ Tech Stack

- **Node.js** + **Express**
- **TypeScript**
- **TypeORM** (MySQL)
- **JWT Authentication**
- **Swagger** (API docs)
- **Multer** (file uploads)

---

## 🎯 Design Decisions

1. **Architecture**

   - Chose a **modular layered architecture** (controllers → services → repositories) to keep business logic separated from request handling.
   - Entities are defined with **TypeORM** for easy schema management and migrations.

2. **Database Choice**

   - Used **MySQL** with TypeORM for relational modeling (Users → Statements → Transactions → Insights).
   - Ensures easy extension (e.g., multiple statements per user, more insight types in the future).

3. **Insights Computation**

   - Implemented in `insightService`:
     - Aggregates inflows, outflows, net flow.
     - Calculates average income defensively (avoids `NaN` when no inflows).
     - Categorizes spending into buckets (`food`, `bills`, `others`) by description keywords.
     - Adds simple **risk flags** like `"NEGATIVE_CASH_FLOW"`.

4. **Bureau API Integration**

   - Abstracted behind a service that calls an external API.
   - Falls back to a **mock Bureau API** when not configured, making it testable without real credentials.
   - Errors are caught and surfaced clearly.

5. **Authentication & Security**

   - **JWT-based auth** chosen for statelessness and easy RBAC.
   - **bcrypt** used for password hashing.
   - **Rate limiting + CORS whitelisting** to harden endpoints.

6. **Developer Experience**

   - Added **Swagger UI** with pre-configured tokens for quick testing.
   - Database seeder creates an Admin and a User, so reviewers can test flows instantly.
   - Folder structure separates config, entities, controllers, services, routes, and utils.

7. **Extensibility**
   - Designed to be easily extendable:
     - New insight types can be added in `insightService`.
     - Bureau API can be swapped to a real provider by updating `.env`.
     - RBAC can support more roles if needed.

---

## 📂 Project Structure

```
src/
  ├── config/          # DB, swagger, seeder, rate limiter
  ├── controllers/     # Request handlers
  ├── entities/        # TypeORM models
  ├── middleware/      # Auth & RBAC
  ├── routes/          # Express routes (Swagger annotated)
  ├── services/        # Business logic
  ├── utils/           # Helpers
  ├── app.ts           # Express setup
  ├── server.ts        # Entry point
uploads/               # Uploaded statement files
```

---

## ⚙️ Setup & Installation

1. Clone repo

   ```bash
   git clone <repo-url>
   cd mini-credit-insights
   ```

2. Install dependencies

   ```bash
   npm install
   ```

3. Setup environment variables in `.env`:

   ```
   PORT=3000
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASS=password
   DB_NAME=creditdb
   JWT_SECRET=supersecret
   ```

4. Run DB migrations:

   ```bash
   npm run typeorm migration:run
   ```

5. Start server:
   ```bash
   npm run dev
   ```
6. Running Tests

```bash
npm test
```

---

## 🗄️ Database Seeder

On startup, default users & sample data are seeded:

- **Admin:**  
  `email: admin@test.com`  
  `password: admin123`

- **User:**  
  `email: user@test.com`  
  `password: user123`  
  (Includes 1 statement + 3 transactions)

---

## 🔑 Authentication & RBAC

- All endpoints require **JWT tokens**
- Roles:
  - **Admin:** Can manage users, run bureau checks
  - **User:** Can upload statements, run insights

---

## 📖 API Documentation

Swagger docs available at:  
[http://localhost:3000/api-docs](http://localhost:3000/api-docs)

- Provides **live JWT tokens** (auto-generated on startup)
- Example schemas: User, Statement, Transaction, Insight, BureauReport

---

## 📌 Example Endpoints

### Auth

- `POST /auth/login` → Get JWT token
- `POST /auth/register` (Admin only)

### Statements

- `POST /statements/upload` → Upload statement file

### Insights

- `POST /insights/run` → Generate insights
- `GET /insights/:id` → Fetch insights

### Bureau

- `POST /bureau/check` (Admin only) → Run bureau check

---

## 🔒 Security

- **CORS whitelisting** for trusted origins
- **Rate limiting** on API routes
- **Password hashing** with bcrypt
- **JWT-based stateless auth**

---

## 🧪 Testing via Swagger

Swagger provides ready-made tokens:

- **Admin token**
- **User token**

You can copy-paste them in the "Authorize" button.

---

### Bureau API Integration

This project is structured to consume a real Bureau API (e.g., Zeeh Africa Credit API).

- Set `BUREAU_API_URL` and `BUREAU_API_KEY` in `.env` to connect.
- By default, if not configured, the service falls back to a mock Bureau response for local testing.

## 👨‍💻 Author

Developed as a take-home project by Shafi Akinropo.
