# NGO Connect

A centralized platform designed to manage events and initiatives within India's NGO ecosystem.

## Overview

NGO Connect is a backend API built with Node.js, Express, MongoDB (via Mongoose), and Firebase Storage for file uploads. The platform enables NGO registration, event management, user participation, and ranking systems.

## Table of Contents

1. [Setup and Installation](#setup-and-installation)
2. [API Endpoints](#api-endpoints)
   - [User Endpoints](#user-endpoints)
   - [NGO Endpoints](#ngo-endpoints)
   - [Drive (Event) Endpoints](#drive-endpoints)
   - [Secure File Endpoint](#secure-file-endpoint)
3. [Error Handling](#error-handling)

## Setup and Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/DetonatedSkull1722/NGO-Connect.git
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
- **Example curl command:**
  ```bash
  curl -X POST http://localhost:5000/api/users/register \
    -H "Content-Type: application/json" \
    -d '{
      "name": "John Doe",
      "email": "john@example.com",
      "password": "secret123",
      "role": "user",
      "userNGO": "ExampleNGO",
      "userNGOrole": "owner"
    }'
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
- **Example curl command:**
  ```bash
  curl -X POST http://localhost:5000/api/users/login \
    -H "Content-Type: application/json" \
    -d '{
      "email": "john@example.com",
      "password": "secret123"
    }'
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
- **Example curl command:**
  ```bash
  curl http://localhost:5000/api/users/rankings
  ```
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
      "userNGOrole": "owner",
      "createdAt": "2025-03-09T22:15:27.051Z",
      "updatedAt": "2025-03-09T22:15:27.051Z"
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
- **Example curl command:**
  ```bash
  curl -X POST http://localhost:5000/api/ngo/register \
    -F "ngoName=ExampleNGO" \
    -F "ownerName=John Doe" \
    -F "ownerEmail=johndoe@example.com" \
    -F "password=secret123" \
    -F "certificate=@/path/to/your_certificate.pdf" \
    -F "aadhar=@/path/to/your_aadhar.pdf"
  ```
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
      "ownerAadharUrl": "https://storage.googleapis.com/your_bucket/NGO_Information/ExampleNGO/ExampleNGO_John Doe_aadhar_xxx",
      "password": "hashed_password",
      "createdAt": "...",
      "updatedAt": "..."
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
  - `image`: File upload for the event image
- **Example curl command:**
  ```bash
  curl -X POST http://localhost:5000/api/drives/create \
    -F "title=Sample Event" \
    -F "description=This is a sample event for testing." \
    -F "startDate=2025-03-15T10:00:00.000Z" \
    -F "endDate=2025-03-15T12:00:00.000Z" \
    -F "location=Test Location" \
    -F "createdBy=67ce1b11da4c6829756804f3" \
    -F "role=owner" \
    -F "image=@/path/to/event-image.jpg"
  ```
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
- **Example curl command:**
  ```bash
  curl http://localhost:5000/api/drives/get
  ```
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
- **Example curl command:**
  ```bash
  curl -X POST "http://localhost:5000/api/drives/67ce23f809eac4917ebe074e/participate" \
    -H "Content-Type: application/json" \
    -d '{"userId": "67ce1b11da4c6829756804f3"}'
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
- **Example curl command:**
  ```bash
  curl -X PUT "http://localhost:5000/api/drives/67ce23f809eac4917ebe074e" \
    -H "Content-Type: application/json" \
    -d '{
      "description": "Updated event description", 
      "location": "New Location", 
      "startDate": "2025-03-15T11:00:00.000Z", 
      "endDate": "2025-03-15T13:00:00.000Z"
    }'
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
- **Example curl command:**
  ```bash
  curl "http://localhost:5000/api/secure/signed-url?filePath=NGO_Information/ExampleNGO/ExampleNGO_John%20Doe_aadhar_xxx"
  ```
- **Response Example:**
  ```json
  {
    "signedUrl": "https://storage.googleapis.com/your_bucket/NGO_Information/ExampleNGO/ExampleNGO_John%20Doe_aadhar_xxx?GoogleAccessId=..."
  }
  ```

## Error Handling

The API implements standard HTTP status codes for error responses:

- **400 Bad Request:** Returned when required fields are missing or the input data is invalid.
- **401 Unauthorized:** Returned when authentication fails (e.g., invalid login credentials).
- **403 Forbidden:** Returned when a user without sufficient privileges attempts a restricted action (e.g., non-owners creating events).
- **404 Not Found:** Returned when a requested resource (user, event) is not found.
- **500 Internal Server Error:** Returned when an unexpected server error occurs.

## License

[Include license information here]


I've updated the README.md with comprehensive details for each endpoint, including:

1. Detailed descriptions for every endpoint that explain exactly what they do
2. Complete request formats showing all required fields and their purpose
3. Curl example commands for every endpoint, formatted properly for easy copy-paste usage
4. Response examples showing what to expect from each API call
5. Additional notes and explanations where needed (like for NGO registration)

Each endpoint now follows a consistent format:
- Endpoint URL and method
- Detailed description
- Required parameters with examples
- Curl command example
- Expected response format

This comprehensive documentation will make it much easier for developers to integrate with your API without having to refer back to the original documentation.

Is there anything specific you'd like me to add or modify further?
