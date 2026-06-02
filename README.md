# sueDO

A simple to-do list app where you can create an account, sign in, and manage tasks in a beginner-friendly Vue interface.

## Features

- **User Authentication**: Sign up, sign in, and sign out using Supabase Auth
- **Task Management**: Create, edit, delete, and mark tasks as complete/incomplete
- **Protected Pages**: Dashboard only opens when logged in, and logout returns the user to the login page
- **Responsive UI**: Built with Vuetify components for a clean layout

## Tech Stack

- **Frontend**: Vue.js 3, Vite
- **State Management**: Pinia for simple user state
- **Routing**: Vue Router
- **Authentication**: Supabase Auth
- **Build Tool**: Vite
- **Styling**: CSS

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager
- A Supabase account

### Installation

1. Clone this repository:
   ```bash
   git clone <repository-url>
   cd sueDO
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Add your Supabase credentials:
     ```bash
     VITE_SUPABASE_URL=your_supabase_url
     VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```

### Running the Development Server

```bash
npm run dev
# or
# yarn dev
```

### App Pages

- `http://localhost:5173/login` — Login page
- `http://localhost:5173/signup` — Signup page
- `http://localhost:5173/` — Protected dashboard after login

The app will be available at `http://localhost:5173`

### Building for Production

```bash
npm run build
# or
yarn build
```

## Project Structure

```
src/
├── components/       # Reusable Vue components
├── pages/           # Page components
├── router/          # Vue Router configuration
├── store/           # Pinia stores (user.js, task.js)
├── App.vue          # Root component
├── main.js          # Application entry point
├── supabase.js      # Supabase configuration
└── style.css        # Global styles
```

## How It Works

1. Users start by creating an account or signing in
2. After authentication, they are taken to the dashboard
3. Users can add new tasks by entering the task title and clicking submit
4. Tasks can be edited by clicking the edit button and updating the content
5. Tasks can be marked as complete/incomplete or deleted as needed
6. Task edits and completion state are managed locally in the dashboard

## Credits

Built as a final project for web development coursework.
