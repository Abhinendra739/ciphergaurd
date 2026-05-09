# CipherGuard - Password Strength Checker

CipherGuard is a full-stack password strength checking application. It provides real-time feedback on password security by analyzing various factors such as length, character sets, entropy, and checking against common, easily guessable passwords. 

The project features a clean, responsive frontend and a robust Node.js backend to perform the complex calculations necessary for estimating password strength and crack time.

## Features

- **Real-time Feedback**: Evaluates password strength as you type.
- **Entropy Calculation**: Computes the true strength of a password based on character sets (lowercase, uppercase, numbers, symbols) and length.
- **Crack Time Estimation**: Estimates how long it would take for an attacker to brute-force the password at 10 billion guesses per second.
- **Common Password Detection**: Checks the input against a list of commonly used weak passwords (e.g., "password123", "admin").
- **Actionable Suggestions**: Provides tips on how to improve the password strength (e.g., "Increase password length and add symbols.").
- **Secure Backend Validation**: Strength logic is processed on an Express.js backend for accurate evaluation.

## Tech Stack

### Frontend
- HTML5
- CSS3
- Vanilla JavaScript

### Backend
- Node.js
- Express.js
- CORS

## Prerequisites

Make sure you have [Node.js](https://nodejs.org/) installed on your machine to run the backend server.
