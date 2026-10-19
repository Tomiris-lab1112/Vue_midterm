# Recipe Finder — Vue 3 Midterm Project

A demo recipe-search and weekly-menu application built with Vue 3, Vue Router, Vuex, Axios, and Vite.

## Features

- Browse recipes and search by recipe name or ingredient
- Filter by recipe meal category
- View recipe details on a dynamic route (`/recipes/:id`)
- Save favorites and organize dishes into a weekly menu
- Demo sign-in and protected routes for Favorites and Weekly Menu
- Loading feedback, error feedback, and request retry

## Setup

Install Node.js and npm, then run:

```bash
npm install
npm run dev
```

Open the local address shown in the terminal (normally http://localhost:5173/).

To test a production build: `npm run build`.

## Demo APIs

- `GET https://dummyjson.com/recipes?limit=0`
- `GET https://dummyjson.com/recipes/:id`
- `POST https://dummyjson.com/auth/login`
- `POST https://jsonplaceholder.typicode.com/posts`

The weekly-menu POST request uses a mock API that does **not** permanently save the menu on the server; the browser's localStorage retains the user's local menu. Authentication is for coursework demonstration, not a production security design.

Demo login shown by the application: `emilys` / `emilyspass`.

## Project structure

- `src/components/` — reusable components and emitted events
- `src/views/` — route-based pages
- `src/store/index.js` — Vuex state, actions, mutations, GET/POST, localStorage
- `src/router.js` — page routing and navigation guard
- `src/App.vue` — navigation shell

## Team work and contributions

Add each actual contributor's name, GitHub username, and **verified changes** below before submitting. Do not claim work completed by another contributor.

| Contributor | GitHub | Actual changes / links to PRs |
| --- | --- | --- |
| Aziza | (fill in) | (fill in after making changes) |
| Team member 2 | (fill in) | (fill in after making changes) |
| Team member 3 | (fill in) | (fill in after making changes) |

Use independent feature branches and Pull Requests so each person has visible commit history. The initial files are an imported starting point; author credits should reflect where they came from.
