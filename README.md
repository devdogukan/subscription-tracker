# Subscription Tracker API

A Node.js REST API for managing subscription services with automated renewal reminders and comprehensive subscription tracking capabilities.

## Features

- 🔐 **User Authentication**: JWT-based authentication with sign-up, sign-in, and sign-out
- 📋 **Subscription Management**: Create, read, update, delete subscriptions
- 💰 **Multiple Currencies**: Support for USD, EUR, GBP
- 📅 **Renewal Tracking**: Automatic calculation of renewal dates
- 🔔 **Automated Reminders**: Workflow-based reminder system
- 🏷️ **Categories**: Organize subscriptions by categories (Sports, Entertainment, Technology, etc.)
- 📊 **Status Tracking**: Active, cancelled, expired subscription states
- 🛡️ **Security**: Rate limiting with Arcjet protection

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (jsonwebtoken)
- **Security**: Arcjet, bcryptjs
- **Workflow**: Upstash Workflow
- **Email**: Nodemailer
- **Task Scheduling**: node-cron
- **Development**: Nodemon, ESLint

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd subscription-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create environment files:
   - `.env.development.local` for development
   - `.env.production.local` for production

   ```env
   # Server Configuration
   PORT=3000
   SERVER_URL=http://localhost:3000
   NODE_ENV=development

   # Database
   DB_URI=mongodb://localhost:27017/subscription-tracker

   # JWT Configuration
   JWT_SECRET=your-super-secure-jwt-secret
   JWT_EXPIRES_IN=7d

   # Arcjet Security
   ARCJET_KEY=your-arcjet-key
   ARCJET_ENV=development

   # Upstash Workflow
   QSTASH_URL=your-qstash-url
   QSTASH_TOKEN=your-qstash-token

   # Email Configuration
   EMAIL_PASSWORD=your-email-app-password
   ```

4. **Start the application**
   ```bash
   # Development
   npm run dev

   # Production
   npm start
   ```

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/sign-up` | Register a new user |
| POST | `/api/v1/auth/sign-in` | User login |
| POST | `/api/v1/auth/sign-out` | User logout |

### Users

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/v1/users` | Get all users | ✅ |
| GET | `/api/v1/users/:id` | Get user by ID | ✅ |
| PUT | `/api/v1/users/:id` | Update user | ✅ |
| DELETE | `/api/v1/users/:id` | Delete user | ✅ |

### Subscriptions

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/v1/subscriptions` | Get all subscriptions | ✅ |
| GET | `/api/v1/subscriptions/:id` | Get subscription by ID | ✅ |
| POST | `/api/v1/subscriptions` | Create new subscription | ✅ |
| PUT | `/api/v1/subscriptions/:id` | Update subscription | ✅ |
| DELETE | `/api/v1/subscriptions/:id` | Delete subscription | ✅ |
| GET | `/api/v1/subscriptions/user/:id` | Get user subscriptions | ✅ |
| PUT | `/api/v1/subscriptions/:id/cancel` | Cancel subscription | ✅ |
| GET | `/api/v1/subscriptions/upcoming-renewals` | Get upcoming renewals | ✅ |

### Workflows

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/workflows/subscription/reminder` | Send subscription reminders |

## Data Models

### User Schema
```javascript
{
  name: String (required, 2-50 chars),
  email: String (required, unique, valid email),
  password: String (required, min 6 chars),
  timestamps: { createdAt, updatedAt }
}
```

### Subscription Schema
```javascript
{
  name: String (required, 2-100 chars),
  price: Number (required, min 0),
  currency: String (USD, EUR, GBP),
  frequency: String (daily, weekly, monthly, yearly),
  category: String (sports, news, entertainment, etc.),
  paymentMethod: String (required),
  status: String (active, cancelled, expired),
  startDate: Date (required),
  renewalDate: Date (auto-calculated),
  user: ObjectId (ref: User),
  timestamps: { createdAt, updatedAt }
}
```

## Usage Examples

### Register a new user
```bash
curl -X POST http://localhost:3000/api/v1/auth/sign-up \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securepassword"
  }'
```

### Create a subscription
```bash
curl -X POST http://localhost:3000/api/v1/subscriptions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Netflix",
    "price": 15.99,
    "currency": "USD",
    "frequency": "monthly",
    "category": "entertainment",
    "paymentMethod": "Credit Card",
    "startDate": "2024-01-01"
  }'
```

## Project Structure

```
subscription-tracker/
├── app.js                 # Main application file
├── package.json           # Dependencies and scripts
├── README.md             # Project documentation
├── config/
│   └── env.js            # Environment configuration
├── controllers/          # Route controllers
│   ├── auth.controller.js
│   ├── subscription.controller.js
│   └── workflow.controller.js
├── database/
│   └── mongodb.js        # Database connection
├── enums/                # Application constants
│   ├── index.js
│   ├── category.enum.js
│   ├── currency.enum.js
│   ├── frequency.enum.js
│   └── status.enum.js
├── middlewares/          # Express middlewares
│   ├── auth.middleware.js
│   ├── error.middleware.js
│   └── arcject.middleware.js
├── models/               # Mongoose models
│   ├── subscription.model.js
│   └── user.model.js
├── routes/               # Express routes
│   ├── auth.routes.js
│   ├── subscription.routes.js
│   ├── user.routes.js
│   └── workflow.routes.js
├── services/             # Business logic
│   ├── subscription.service.js
│   └── user.service.js
└── utils/                # Utility functions
    └── cleanup.utils.js
```

## Features in Detail

### Subscription Categories
- Sports
- News  
- Entertainment
- Lifestyle
- Technology
- Finance
- Politics
- Other

### Supported Currencies
- USD (US Dollar)
- EUR (Euro)
- GBP (British Pound)

### Billing Frequencies
- Daily
- Weekly
- Monthly
- Yearly

### Subscription Status
- **Active**: Currently active subscription
- **Cancelled**: User cancelled subscription
- **Expired**: Subscription has expired

## Security Features

- JWT-based authentication
- Password hashing with bcryptjs
- Rate limiting with Arcjet
- Input validation and sanitization
- Environment-based configuration

## Development

### Scripts
```bash
npm start      # Start production server
npm run dev    # Start development server with nodemon
```

### Linting
```bash
npx eslint .   # Run ESLint
```