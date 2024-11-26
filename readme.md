# Documentation for `enroller.mjs` and Supporting Code for Spirogen Public Enrollment

This documentation explains the purpose and functionality of the Spirogen Public Enrollment system. It covers the CLI (`enroller.mjs`), supporting API implementation, and client-side interface. 

## Overview

The **Spirogen Public Enrollment System** enables administrators to generate secure, one-time-use public enrollment links for users in Firebase Auth. These links are uniquely tied to a user UID and are automatically deleted after use. The system comprises:

1. A command-line interface (CLI) tool, `enroller.mjs`.
2. A Next.js server-side API for link creation and verification.
3. A client-side interface for administrators.
4. Supporting environment configuration.

---

## Prerequisites

- **Firebase Admin SDK**: To interact with Firebase Auth and Firestore.
- **Node.js v22**: To run the CLI and backend scripts.
- **Environment Variables**: The following must be set in `.env`:
  - `JWT_SECRET`: A secret key for signing JWT tokens.

---

## CLI: `enroller.mjs`

The CLI tool generates public enrollment links by fetching Firebase users, allowing the admin to select a user UID, and creating a secure one-time-use link.

### Features

1. **Firebase User Fetching**: Lists all users from Firebase Auth with their names and UIDs.
2. **User Selection**: Allows selecting a user via interactive prompt.
3. **JWT Token Generation**: Creates a secure token using a secret key.
4. **API Request**: Sends the selected UID and token to the `/selfenroll` API endpoint for link creation.

### Usage

#### 1. Setup Environment

- Ensure you have the required `JWT_SECRET` in the `.env` file.
- Install dependencies with:
  ```bash
  npm install
  ```

#### 2. Run the CLI

Run the CLI tool via the command:
```bash
spirogen
```

The tool will:
- Display a list of Firebase Auth users.
- Prompt for a user selection by number.
- Generate and display a unique public enrollment link.

#### 3. Example Command Output

```plaintext
==== Spirogen Public Enrollment Link Generator ====

1. John Doe (UID12345)
2. Jane Smith (UID67890)

Select a user by typing their number: 1

Selected UID: UID12345
Public Link Generated: https://spirogen.eugenicserudite.xyz/selfenroll/abc123

==== Made and Maintained by Titas Sir, Eugenics Erudite ====
```

---

## Backend API: `/api/selfenroll`

The API creates one-time-use enrollment links.

### Endpoints

#### POST `/api/selfenroll`

**Request Headers**:
- `Authorization`: Bearer token with a valid JWT signed using `JWT_SECRET`.

**Request Body**:
- `uid` (string): The UID of the user to generate a link for.

**Response**:
- `200 OK`: Returns the generated public enrollment link.
- `401 Unauthorized`: If the JWT is invalid or missing.
- `500 Internal Server Error`: If any error occurs during processing.

**Example Response**:
```json
{
  "confirmed": "https://spirogen.eugenicserudite.xyz/selfenroll/abc123"
}
```

### Logic Flow

1. **JWT Verification**: Ensures the request is from an authorized admin.
2. **UID Validation**: Confirms the UID exists in Firebase Auth.
3. **Firestore Document Creation**: Stores a unique `shareCode` tied to the UID.
4. **Response**: Sends a public-facing enrollment link.

---

## Client-Side Interface

A simple React-based client interface allows administrators to generate links through a browser.

### Features

1. **Token Retrieval**: Fetches a JWT token from the server.
2. **API Interaction**: Sends requests to `/api/selfenroll` with the token and UID.
3. **Link Display**: Shows the generated link to the user.

### Example UI

```jsx
import { useState } from "react";

const SelfEnroll = () => {
  const [responseLink, setResponseLink] = useState("");

  const handleFetch = async () => {
    const response = await fetch("/api/selfenroll", {
      method: "POST",
      headers: { "Authorization": `Bearer <TOKEN>` },
      body: JSON.stringify({ uid: "UID12345" }),
    });
    const data = await response.json();
    setResponseLink(data.confirmed);
  };

  return (
    <div>
      <button onClick={handleFetch}>Generate Link</button>
      <p>{responseLink}</p>
    </div>
  );
};

export default SelfEnroll;
```

---

## Environment Configuration

Ensure the `.env` file contains:
```plaintext
JWT_SECRET=your-secret-key
```

---

## Testing the API

### cURL Command
```bash
curl -X POST https://your-api-url/api/selfenroll \
-H "Content-Type: application/json" \
-H "Authorization: Bearer <TOKEN>" \
-d '{"uid": "USER_UID"}'
```

### Expected Output
```json
{
  "confirmed": "https://spirogen.eugenicserudite.xyz/selfenroll/abc123"
}
```

---

## Notes and Limitations

1. **One-Time Use Links**: The enrollment links are designed to be deleted from Firestore after usage.
2. **Token Expiration**: JWT tokens expire after 1 hour for security purposes.
3. **Command Alias**: Ensure the `spirogen` command is linked correctly via a symbolic link or npm package.

---

## Conclusion

The Spirogen Public Enrollment System is a secure and user-friendly tool to manage public-facing enrollment links, with robust CLI, API, and client-side support. It is optimized for streamlined workflows and ease of use while ensuring security and auditability.