# BOOKIQUEE React Application 📚

[![Live Demo](https://img.shields.io/badge/Live-Demo-green)](https://bookique.vercel.app)

🔗 Live Demo: https://bookique.vercel.app

A modern React-based book discovery and reading application with Firebase authentication and book reader functionality.

---

## ✨ Features

- 🔐 Authentication (Email + Google)
- 📚 Browse & Search Books
- 🔎 Sorting (Popular, Recent, Top Rated)
- 📖 Book Reader with pagination & chapters
- ❤️ Favorites system
- 📱 Fully responsive design

---

## 🛠 Tech Stack

- React 18
- React Router v6
- Firebase
- Vite
- CSS3

---

## 📁 Project Structure

```
bookiquee-react/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   └── LoadingSpinner.jsx
│   │   ├── Navbar.jsx
│   │   ├── BookCard.jsx
│   │   ├── BookModal.jsx
│   │   ├── BookReader.jsx
│   │   ├── Filters.jsx
│   │   └── Pagination.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   └── Signup.jsx
│   ├── services/
│   │   ├── firebaseConfig.js
│   │   ├── authService.js
│   │   └── bookService.js
│   ├── utilities/
│   │   └── bookUtils.js
│   ├── styles/
│   │   ├── global.css
│   │   ├── home.css
│   │   ├── auth.css
│   │   └── components.css
│   ├── App.jsx
│   └── index.jsx
├── package.json
├── vite.config.js
└── .gitignore
```

## Installation

1. **Navigate to the project directory:**
   ```bash
   cd bookiquee-react
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

## Running the Application

### Development Mode
```bash
npm run dev
```

This will start the development server at `http://localhost:5173`

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm preview
```

## Technologies Used

- **React 18.2** - UI framework
- **React Router v6** - Client-side routing
- **Firebase 8.10.1** - Authentication and token management
- **Vite 4.3** - Build tool and development server
- **CSS3** - Styling with animations and gradients

## Core Features Implementation

### 📚 Book Management
- **Home Page (`Home.jsx`)**: Displays paginated book grid with search, filter, and sort functionality
- **BookCard Component**: Reusable card displaying book information
- **BookModal Component**: Shows detailed book information in a modal
- **BookReader Component**: Full-featured reader with text parsing, pagination, and chapter navigation

### 🔐 Authentication (`authService.js`)
- Email/Password sign-up and sign-in
- Google OAuth integration
- Token management with 1-hour expiration checks
- Auto-refresh functionality

### 📖 Book Services (`bookService.js`)
- API integration for book retrieval and searching
- Fallback to sample books if API is unavailable
- Book content fetching with text cleaning

### 🛠️ Utilities (`bookUtils.js`)
- Text cleaning and formatting
- Book pagination (500 words per page)
- Chapter detection and extraction
- Favorites management using localStorage

## Key Differences from Original

1. **Component-Based Architecture**: Broke monolithic HTML/JS into reusable React components
2. **State Management**: Used React hooks (useState, useEffect) instead of DOM manipulation
3. **Routing**: Added React Router for multi-page navigation without full page reloads
4. **Service Layer**: Separated concerns with dedicated auth, book, and utility services
5. **CSS Organization**: Split CSS into logical files (global, home, auth, components)

## API Configuration

Update the API base URL in `src/services/bookService.js`:
```javascript
const API_BASE_URL = "http://localhost:8080/api";
```

## Authentication

Firebase configuration is stored in `src/services/firebaseConfig.js`. The app uses:
- Email authentication
- Google OAuth
- Local token storage with expiration checking

## Styling

All original CSS has been preserved and organized into:
- **global.css** - Root styles and variables
- **home.css** - Home page and book-related styles
- **auth.css** - Login and signup page styles
- **components.css** - Reusable component styles

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Notes

- The app requires an active API backend at the configured URL for full functionality
- Fallback sample books are provided if the API is unavailable
- Favorites are stored in browser localStorage
- Authentication tokens expire after 1 hour and are automatically refreshed

## Future Enhancements

- Add Redux for global state management
- Implement offline reading with service workers
- Add dark mode support
- Implement user reading history
- Add book recommendations
- Improve accessibility features

---

**Original Project**: BOOKIQUEE Frontend (HTML/CSS/JavaScript)
**Converted To**: React Application maintaining 100% functionality
