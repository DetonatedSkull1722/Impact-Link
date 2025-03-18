# Impact Link

A centralized platform designed to manage events and initiatives within India's NGO ecosystem.

## Overview

Impact Link is a backend API built with Node.js, Express, MongoDB (via Mongoose), and Firebase Storage for file uploads. The platform enables NGO registration, event management, user participation, and ranking systems.

## Table of Contents

1. [Setup and Installation](#setup-and-installation)
2. [Project Structure](#project-structure)
3. [API Endpoints](#api-endpoints)
   - [User Endpoints](#user-endpoints)
   - [NGO Endpoints](#ngo-endpoints)
   - [Drive (Event) Endpoints](#drive-endpoints)
   - [Secure File Endpoint](#secure-file-endpoint)
4. [Authentication](#authentication)
5. [Error Handling](#error-handling)

## Setup and Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/DetonatedSkull1722/ImpactLink.git
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Create a `.env` file in the project root with the following variables:
   ```
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   FIREBASE_TYPE=service_account
   FIREBASE_PROJECT_ID=your_project_id
   FIREBASE_PRIVATE_KEY_ID=your_private_key_id
   FIREBASE_PRIVATE_KEY=your_private_key
   FIREBASE_CLIENT_EMAIL=your_client_email
   FIREBASE_CLIENT_ID=your_client_id
   FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
   FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
   FIREBASE_AUTH_PROVIDER_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
   FIREBASE_CLIENT_CERT_URL=your_client_cert_url
   FIREBASE_STORAGE_BUCKET=your_bucket_name
   ```

4. **Start the server:**
   ```bash
   npm start
   ```

## Project Structure

The project follows an MVC-like structure:

```
ImpactLink/
├── config/                 # Database and Firebase configurations
│   ├── db.js               # MongoDB connection
│   ├── firebase.js         # Firebase initialization
│   └── firebaseHelper.js   # Firebase utility functions
├── controllers/            # Business logic
│   ├── DriveController.js  # Event management logic
│   ├── NGOController.js    # NGO registration logic
│   ├── SecureFileController.js # File access logic
│   └── UserController.js   # User management logic
├── middleware/             # Express middleware
│   └── auth.js             # Authentication middleware
├── models/                 # Mongoose models
│   ├── Drive.js            # Event model
│   ├── NGO.js              # NGO model
│   └── User.js             # User model
├── routes/                 # Express routes
│   ├── driveRoutes.js      # Event routes
│   ├── ngoRoutes.js        # NGO routes
│   ├── secureFileRoutes.js # Secure file routes
│   └── userRoutes.js       # User routes
├── .env                    # Environment variables (not in repo)
├── package.json            # Project dependencies
├── README.md               # Project documentation
└── server.js               # Application entry point
```

## API Endpoints

### User Endpoints

#### User Registration
- **Endpoint:** POST `/api/users/register`
- **Description:** Registers a new user. For NGO owners, set the role to "owner", and optionally include the associated NGO details.
- **Request Body (JSON):**
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "secret123",
    "role": "user",  // Use "owner" for NGO owners
    "userNGO": "ExampleNGO",        // Optional: identifier of the associated NGO
    "userNGOrole": "owner"          // Optional: role within the NGO (if applicable)
  }
  ```
- **Response Example:**
  ```json
  {
    "message": "User registered successfully",
    "user": {
      "_id": "user_object_id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "points": 0,
      "userNGO": "ExampleNGO",
      "userNGOrole": "owner"
    }
  }
  ```

#### User Login
- **Endpoint:** POST `/api/users/login`
- **Description:** Authenticates a user and returns a JWT token.
- **Request Body (JSON):**
  ```json
  {
    "email": "john@example.com",
    "password": "secret123"
  }
  ```
- **Response Example:**
  ```json
  {
    "message": "Login successful",
    "token": "jwt_token_here",
    "user": {
      "_id": "user_object_id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "points": 0
    }
  }
  ```

#### User Rankings
- **Endpoint:** GET `/api/users/rankings`
- **Description:** Retrieves a list of users sorted by their points in descending order (highest score first).
- **Response Example:**
  ```json
  [
    {
      "_id": "user_object_id",
      "name": "Top User",
      "email": "topuser@example.com",
      "role": "owner",
      "points": 10,
      "userNGO": "ExampleNGO",
      "userNGOrole": "owner"
    }
    // ... more users
  ]
  ```

### NGO Endpoints

#### NGO Registration
- **Endpoint:** POST `/api/ngo/register`
- **Description:** Registers a new NGO along with its owner. Accepts multipart/form-data to upload two documents: the NGO validation certificate and the owner's masked Aadhar. A corresponding User document is automatically created with the role set to "owner".
- **Request Format:** multipart/form-data
- **Fields:**
  - `ngoName`: Name of the NGO (e.g., "ExampleNGO")
  - `ownerName`: Name of the NGO owner (e.g., "John Doe")
  - `ownerEmail`: Email of the NGO owner (e.g., "johndoe@example.com")
  - `password`: Password for the account (e.g., "secret123")
- **Files:**
  - `certificate`: File upload for the NGO validation certificate
  - `aadhar`: File upload for the owner's Aadhar document
- **Response Example:**
  ```json
  {
    "message": "NGO registered successfully",
    "ngo": {
      "_id": "ngo_object_id",
      "ngoName": "ExampleNGO",
      "ownerName": "John Doe",
      "ownerEmail": "johndoe@example.com",
      "ngoValidationCertificateUrl": "https://storage.googleapis.com/your_bucket/NGO_Information/ExampleNGO/ExampleNGO_John Doe_certificate_xxx",
      "ownerAadharUrl": "https://storage.googleapis.com/your_bucket/NGO_Information/ExampleNGO/ExampleNGO_John Doe_aadhar_xxx"
    }
  }
  ```
- **Note:** The corresponding User document is created with the same credentials, allowing the NGO owner to log in using the same email and password.

### Drive Endpoints

#### Create Event
- **Endpoint:** POST `/api/drives/create`
- **Description:** Creates a new event. Only users with the "owner" role can create events. Accepts multipart/form-data for image upload. The event image is stored under the Event_Information folder in Firebase Storage.
- **Request Format:** multipart/form-data
- **Fields:**
  - `title`: Event title (e.g., "Sample Event")
  - `description`: Event description (e.g., "This is a sample event for testing.")
  - `startDate`: Event start date and time (e.g., "2025-03-15T10:00:00.000Z")
  - `endDate`: Event end date and time (e.g., "2025-03-15T12:00:00.000Z")
  - `location`: Event location (e.g., "Test Location")
  - `createdBy`: User ID of the event creator (must be a valid owner ID)
  - `role`: Must be "owner"
- **File:**
  - `image`: File upload for the event image (optional)
- **Response Example:**
  ```json
  {
    "message": "Event created successfully",
    "event": {
      "_id": "event_object_id",
      "title": "Sample Event",
      "description": "This is a sample event for testing.",
      "startDate": "2025-03-15T10:00:00.000Z",
      "endDate": "2025-03-15T12:00:00.000Z",
      "location": "Test Location",
      "imageUrl": "https://storage.googleapis.com/your_bucket/Event_Information/Sample_Event_xxx",
      "createdBy": "67ce1b11da4c6829756804f3",
      "participants": []
    }
  }
  ```

#### List Events
- **Endpoint:** GET `/api/drives/get`
- **Description:** Retrieves a list of all events along with the creator's basic details.
- **Response Example:**
  ```json
  [
    {
      "_id": "event_object_id",
      "title": "Sample Event",
      "description": "This is a sample event for testing.",
      "startDate": "2025-03-15T10:00:00.000Z",
      "endDate": "2025-03-15T12:00:00.000Z",
      "location": "Test Location",
      "imageUrl": "https://storage.googleapis.com/your_bucket/Event_Information/Sample_Event_xxx",
      "createdBy": {
        "_id": "67ce1b11da4c6829756804f3",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "participants": []
    }
    // ... more events
  ]
  ```

#### Participate in Event
- **Endpoint:** POST `/api/drives/:id/participate`
- **Description:** Allows a user to participate in an event by adding their User ID to the event's participant list and incrementing their ranking points.
- **URL Parameter:** `:id` – Event ObjectId
- **Request Body (JSON):**
  ```json
  {
    "userId": "67ce1b11da4c6829756804f3"
  }
  ```
- **Response Example:**
  ```json
  {
    "message": "Participation successful",
    "event": {
      "_id": "67ce23f809eac4917ebe074e",
      "title": "Sample Event",
      "participants": ["67ce1b11da4c6829756804f3"],
      // ... other event details
    }
  }
  ```

#### Edit Event Details
- **Endpoint:** PUT `/api/drives/:id`
- **Description:** Updates event details such as title, description, dates, or location.
- **URL Parameter:** `:id` – Event ObjectId
- **Request Body (JSON):** Include only the fields you want to update
  ```json
  {
    "description": "Updated event description",
    "location": "New Location",
    "startDate": "2025-03-15T11:00:00.000Z",
    "endDate": "2025-03-15T13:00:00.000Z"
  }
  ```
- **Response Example:**
  ```json
  {
    "message": "Event updated successfully",
    "event": {
      "_id": "67ce23f809eac4917ebe074e",
      "title": "Sample Event",
      "description": "Updated event description",
      "location": "New Location",
      "startDate": "2025-03-15T11:00:00.000Z",
      "endDate": "2025-03-15T13:00:00.000Z",
      // ... other event details
    }
  }
  ```

### Secure File Endpoint

#### Generate Signed URL
- **Endpoint:** GET `/api/secure/signed-url`
- **Description:** Generates a time-limited signed URL for accessing a private file in Firebase Storage. This URL is valid for 1 hour.
- **Query Parameter:**
  - `filePath`: The exact path of the file in the bucket (URL-encoded if necessary)
- **Response Example:**
  ```json
  {
    "signedUrl": "https://storage.googleapis.com/your_bucket/NGO_Information/ExampleNGO/ExampleNGO_John%20Doe_aadhar_xxx?GoogleAccessId=..."
  }
  ```

## Authentication

The system uses JWT (JSON Web Tokens) for authentication:

1. **Token Generation:** When a user logs in successfully, the server generates a JWT token that contains the user's ID and role.
2. **Token Usage:** For protected routes, include the token in the Authorization header:
   ```
   Authorization: Bearer your_jwt_token
   ```
3. **Authentication Middleware:** The `authenticate` middleware verifies the JWT token and attaches the user object to the request.
4. **Role-Based Authorization:** The `authorize` middleware checks if the authenticated user has the required role to access a resource.

## Error Handling

The API implements standard HTTP status codes for error responses:

- **400 Bad Request:** Returned when required fields are missing or the input data is invalid.
- **401 Unauthorized:** Returned when authentication fails (e.g., invalid login credentials or token).
- **403 Forbidden:** Returned when a user without sufficient privileges attempts a restricted action (e.g., non-owners creating events).
- **404 Not Found:** Returned when a requested resource (user, event) is not found.
- **500 Internal Server Error:** Returned when an unexpected server error occurs.

Each error response includes a JSON object with an `error` field describing the issue.
