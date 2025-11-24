<div style="display: flex; justify-content: center; align-items: center; gap: 10px;">
  <img src="app-logo.png" alt="App Logo" width="32" height="32" />
  <span>
    <p style="margin: 0; font-size: 1.2em; font-weight: bold;">BMC-Home-Test</p>
  </span>
</div>

<div style="text-align: center;">
  Created by: Gal Helner
</div>

---
This is a simple e-commerce **full-stack application**, built with **Angular** frontend, **Node.js** backend, and an **SQLite** database.

---

## 🏗️ Project Structure Rationale

Both the frontend and backend follow a **feature-based** folder structure. This approach organizes files by the business function they serve, making the application more scalable and maintainable.

### Frontend (Angular)

The Angular application is organized around **features**. Each major feature of the application (e.g., `products`, `auth`, `dashboard`) has its own root folder.

* **Example Path:** `frontend/src/app/[feature-name]/`
* **Contained Items:** Inside a feature folder, you will find all the related Angular elements, such as `components`, `pages`, `services`, and `models`. This keeps all feature logic localized.

### Backend (Node.js)

The Node.js server also uses a feature-based structure, grouping code by the resource or domain it handles.

* **Example Path:** `backend/src/features/[feature-name]/`
* **Contained Items:** Inside a feature folder, you will typically find the dedicated `controller` (handling requests), `route` definitions, and `service` logic for that specific feature (e.g., `products` or `auth`).

---

## 🚀 Getting Started

Follow these steps to run the application locally.

### 1. Frontend

The frontend is an Angular application.

1.  Navigate to the frontend directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies (if you haven't already):
    ```bash
    npm install
    ```
3.  Start the development server and automatically open the application in your browser:
    ```bash
    ng serve -o
    ```

---

### 2. Backend

The backend is a Node.js application that powers the API and uses an SQLite database.

1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Install dependencies (if you haven't already):
    ```bash
    npm install
    ```
3.  Start the server:
    ```bash
    npm start
    ```
    The server will run on `http://localhost:3000`.

---

## ✅ Running Tests

You can run the end-to-end (e2e) tests for the Angular frontend.

1.  Navigate to the frontend directory:
    ```bash
    cd frontend
    ```
2.  Run the e2e tests:
    ```bash
    npm run test:e2e
    ```

---