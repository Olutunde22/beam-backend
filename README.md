Beam Backend is the server-side for beam mini fintech app

## 🛠 Tech Stack

- **NestJS** – A progressive Node.js framework for building efficient, scalable server-side applications.
- **TypeScript** – Strongly typed JavaScript for improved developer experience and fewer bugs.
- **MySQL** – Relational database management system.
- **TypeORM** – Elegant and powerful ORM for TypeScript and JavaScript.
- **Passport.js & JWT** – Secure authentication using JSON Web Tokens.

## 📦 Installation

```bash
git clone https://github.com/olutunde22/beam-backend.git
cd beam-backend
npm install
```

## 🚀 Running the App

### Development
```bash
npm run start:dev
```

### Production
```bash
npm run build
npm run start:prod
```

### Testing
```bash
npm run test
```

## 📁 Project Structure

```
beam-backend/
├── src/
│   ├── strategies/      # Authentication logic with Passport and JWT
│   ├── config/          # Configuration files and environment handling
│   ├── modules/         # Feature modules
│   └── main.ts          # Entry point of the application
├── test/                # End-to-end and unit tests
├── package.json
└── tsconfig.json
```
