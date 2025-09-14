# User Registration - POST /user/register

Description
- Create a new user account and return a JWT auth token.
- In this project the route is mounted at: `POST /user/register` (app uses `app.use('/user', userRoutes)`).

Request
- URL: POST /user/register
- Headers: `Content-Type: application/json`
- Body (JSON):
  {
    "fullname": {
      "firstname": "John",    // required, min length 3
      "lastname": "Doe"       // optional, min length 3 if provided
    },
    "email": "john@example.com", // required, must be a valid email
    "password": "secret123"      // required, min length 6
  }

Validation rules
- `email` — must be a valid email (400 if invalid)
- `fullname.firstname` — min length 3 (400 if invalid)
- `password` — min length 6 (400 if invalid)

Responses
- 201 Created
  - Body: `{ "user": { ...userFields... }, "token": "<jwt>" }`
- 400 Bad Request
  - Validation errors returned as: `{ "errors": [ { msg, param, ... } ] }`
- 409 Conflict
  - Duplicate email (Mongo duplicate key) — may be returned if email already exists
- 500 Internal Server Error
  - Unexpected server/database errors

Example curl
```
curl -X POST http://localhost:3000/user/register \
  -H "Content-Type: application/json" \
  -d '{"fullname":{"firstname":"John","lastname":"Doe"},"email":"john@example.com","password":"secret123"}'
```