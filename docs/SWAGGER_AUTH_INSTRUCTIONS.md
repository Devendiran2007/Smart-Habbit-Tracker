# Testing Swagger Authorization

## How to Test in Swagger UI

1. **Open Swagger UI**: Navigate to http://127.0.0.1:8000/docs in your browser

2. **Click the "Authorize" button** (lock icon at the top right of the page)

3. **Enter credentials**:
   - Username: `testuser456`
   - Password: `pass123`
   
4. **Click "Authorize"** in the modal

5. **You should see "Authorized" message**

6. **Close the modal** and try any protected endpoint (like POST /habbits/create)

7. **The endpoint should now work** with the authorization token automatically included

## What Was Fixed

The OAuth2 scheme now points to `/users/token` which uses `OAuth2PasswordRequestForm` - the standard format that Swagger UI expects for OAuth2 authentication.

## Endpoints Available

- **POST /users/token** - OAuth2 compatible endpoint (for Swagger UI) - uses form data
- **POST /users/login** - JSON-based login endpoint (for API clients) - uses JSON

Both endpoints return the same JWT access token format.
