# Subscription Tracker API

A Node.js REST API for managing subscription services with automated renewal reminders and comprehensive subscription tracking capabilities.

## Features

- 🔐 **User Authentication**: JWT-based authentication with sign-up, sign-in, and sign-out
- 📋 **Subscription Management**: Create, read, update, delete subscriptions
- 💰 **Multiple Currencies**: Support for USD, EUR, GBP
- 📅 **Renewal Tracking**: Automatic calculation of renewal dates
- 🔔 **Automated Reminders**: Workflow-based reminder system using Upstash Workflow
- 🏷️ **Categories**: Organize subscriptions by categories (Sports, Entertainment, Technology, etc.)
- 📊 **Status Tracking**: Active, cancelled, expired subscription states
- 🛡️ **Security**: Rate limiting and bot protection with Arcjet
- 🔄 **Token Management**: Automatic token blacklisting and cleanup
- 📧 **Email Notifications**: Automated email reminders for renewals

## Tech Stack

- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (jsonwebtoken)
- **Security**: Arcjet, bcryptjs
- **Workflow**: Upstash Workflow
- **Email**: Nodemailer
- **Task Scheduling**: node-cron
- **Development**: Nodemon, ESLint
- **Date Manipulation**: dayjs

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

4. **Configure Email**
   Update the sender email in `/config/nodemailer.js`:
   ```javascript
   export const accountEmail = "your-sender-email@gmail.com";
   ```

5. **Start the application**
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
| POST | `/api/v1/subscriptions` | Create new subscription | ✅ |
| GET | `/api/v1/subscriptions/user/:id` | Get user subscriptions | ✅ |

*Note: Additional subscription endpoints are planned for future implementation*

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

### BlacklistedToken Schema
```javascript
{
  token: String (required, unique),
  expiresAt: Date (required, auto-expires),
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
├── app.js                     # Main application file
├── package.json               # Dependencies and scripts
├── package-lock.json          # Dependency lock file
├── README.md                  # Project documentation
├── .gitignore                 # Git ignore rules
├── eslint.config.js           # ESLint configuration
├── config/                    # Configuration files
│   ├── env.js                 # Environment configuration
│   ├── arcjet.js              # Arcjet security config
│   ├── nodemailer.js          # Email configuration
│   └── upstash.js             # Upstash workflow config
├── controllers/               # Route controllers
│   ├── auth.controller.js     # Authentication logic
│   ├── user.controller.js     # User management
│   ├── subscription.controller.js # Subscription management
│   └── workflow.controller.js # Workflow endpoints
├── database/
│   └── mongodb.js             # Database connection
├── enums/                     # Application constants
│   ├── index.js               # Exports all enums
│   ├── category.enum.js       # Subscription categories
│   ├── currency.enum.js       # Supported currencies
│   ├── frequency.enum.js      # Billing frequencies
│   ├── status.enum.js         # Subscription statuses
│   └── reminders.enum.js      # Reminder configurations
├── middlewares/               # Express middlewares
│   ├── auth.middleware.js     # JWT authentication
│   ├── error.middleware.js    # Error handling
│   └── arcject.middleware.js  # Security protection
├── models/                    # Mongoose models
│   ├── user.model.js          # User data model
│   ├── subscription.model.js  # Subscription data model
│   └── blacklistedToken.model.js # Token blacklist
├── repositories/              # Data access layer (planned)
│   ├── user.repository.js
│   ├── subscription.repository.js
│   └── blacklist.repository.js
├── routes/                    # Express routes
│   ├── auth.routes.js         # Authentication routes
│   ├── user.routes.js         # User management routes
│   ├── subscription.routes.js # Subscription routes
│   └── workflow.routes.js     # Workflow routes
├── services/                  # Business logic layer
│   ├── user.service.js        # User business logic
│   ├── subscription.service.js # Subscription logic
│   ├── blacklist.service.js   # Token blacklist logic
│   ├── workflow.service.js    # Workflow orchestration
│   └── workflow/              # Workflow components
│       ├── index.js
│       ├── workflow-client.service.js
│       └── subscription-workflow.service.js
└── utils/                     # Utility functions
    ├── auth.utils.js          # Authentication utilities
    ├── cleanup.utils.js       # Token cleanup jobs
    └── send-email.js          # Email utilities
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

### Reminder System
- 1 week before renewal
- 5 days before renewal
- 2 days before renewal
- 1 day before renewal

## Security Features

- JWT-based authentication with token blacklisting
- Password hashing with bcryptjs
- Rate limiting and bot protection with Arcjet
- Input validation and sanitization
- Environment-based configuration
- Automatic token cleanup jobs
- Request protection against malicious activities

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

### Environment Configuration
The application uses environment-specific configuration files:
- Development: `.env.development.local`
- Production: `.env.production.local`

### Automated Tasks
- Token cleanup job runs periodically to remove expired blacklisted tokens
- Subscription status updates based on renewal dates
- Automated email reminders for upcoming renewals

## Architecture

The application follows a layered architecture:

1. **Routes**: Handle HTTP requests and responses
2. **Controllers**: Process requests and coordinate responses
3. **Services**: Contain business logic
4. **Repositories**: Data access layer (planned implementation)
5. **Models**: Define data structures and validation
6. **Middlewares**: Handle cross-cutting concerns
7. **Utils**: Provide utility functions