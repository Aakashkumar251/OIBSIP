# Login Authentication System

A front-end authentication system built with HTML, CSS, and vanilla JavaScript, using `localStorage` for user storage and `sessionStorage` for session management.

## Features
- User registration with email/username and password
- Password validation: minimum 8 characters, at least 1 number
- Duplicate account check on registration
- Login with generic error messages (doesn't reveal which field is incorrect)
- Protected dashboard page — redirects to login if accessed without an active session
- Logout clears the session and redirects to login
- Passwords are hashed using SHA-256 before storage (never stored in plain text)
- Empty field validation on both forms

## Tech Stack
- HTML5
- CSS3
- JavaScript (Vanilla) — Web Crypto API for SHA-256 hashing
- Browser `localStorage` (user data) and `sessionStorage` (session state)

## File Structure