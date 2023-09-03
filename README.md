# Kento API Documentation

## Introduction

The Kento API is an application for managing users and authentication, built using NestJS and MikroORM.

## Installation

1. Clone this repository:

   ```bash
   git clone https://github.com/kent-0/kento-api.git
   ```

2. Install dependencies:

   ```bash
   cd kento-api
   npm install
   ```

3. Configure the database:

   Create a `mikro-orm.config.js` file in the project root with the database configuration.

4. Run migrations and seeders:

   ```bash
   npm run migration:up
   npm run seed:initial
   ```

5. Start the development server:

   ```bash
   npm run start:dev
   ```

## Project Structure

To see the current structure of the project, view the file `PROJECT_STRUCTURE.md`

## Services

### AuthPasswordService

Handles logic related to user passwords.

### AuthEmailService

Handles logic for confirming user email.

### AuthAccountService

Handles user account management logic, including login, registration, and updating.

## Resolvers

### AuthResolver

Resolver for operations related to authentication and user management. Utilizes the services mentioned above to perform operations.

## Authentication Strategies

### JWTStrategy

JWT-based authentication strategy. Validates and verifies JWT tokens to authenticate users.

## Main Dependencies

- `@nestjs/graphql`: Library for creating GraphQL APIs with NestJS.
- `@nestjs/jwt`: JWT support for NestJS.
- `@nestjs/passport`: Authentication library for NestJS.
- `@mikro-orm/core`: ORM for database manipulation.
- `bcrypt`: Library for password hashing.
- `graphql`: Library for creating GraphQL APIs.
- `passport-jwt`: JWT strategy for Passport.

## Contribution

Contributions are welcome! If you find a bug or want to improve the API, please open an issue or submit a pull request.

## License

This project is licensed under the UNLICENSED License. See the LICENSE file for more details.
