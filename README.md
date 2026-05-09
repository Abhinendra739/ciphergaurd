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

## Installation & Setup

1. **Clone the repository** (if you haven't already):
   ```bash
   git clone <your-repository-url>
   cd cyber1
   ```

2. **Install backend dependencies**:
   Navigate to the project root directory and install the necessary npm packages:
   ```bash
   npm install
   ```

3. **Start the backend server**:
   Run the following command to start the Express server. It will run on port 3000 by default.
   ```bash
   npm start
   ```
   *You should see a message in the console: `Server running on port 3000`.*

4. **Launch the Frontend**:
   Simply open the `index.html` file in your preferred web browser. Alternatively, you can use a live server extension in VS Code.

## Usage

1. Start the Node.js backend server.
2. Open `index.html` in your browser.
3. Start typing a password into the input field.
4. The application will instantly display the password's strength label (Weak, Medium, Strong), estimated crack time, and suggestions to make it more secure.

## API Endpoint Reference

The backend exposes a single endpoint for analyzing passwords.

**`POST /api/analyze`**

**Request Body:**
```json
{
  "password": "your_password_here"
}
```

**Response:**
```json
{
  "score": 4,
  "strengthLabel": "Strong",
  "entropy": 64,
  "charsetSize": 62,
  "length": 11,
  "crackTimeSeconds": 1844674,
  "crackTimeHuman": "21 days",
  "isCommon": false,
  "suggestion": "Excellent password."
}
```
![image alt](https://github.com/Abhinendra739/ciphergaurd/blob/main/Screenshot%202026-05-09%20121847.png?raw=true)




