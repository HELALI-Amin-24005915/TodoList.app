<div align="center">
  <h1>✨ TodoList.app</h1>
  <p><i>A comprehensive, responsive, and robust React task management application.</i></p>

  <!-- Tech Stack Badges -->
  <p>
    <a href="https://reactjs.org/" target="_blank">
      <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
    </a>
    <a href="https://getbootstrap.com" target="_blank">
      <img src="https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white" alt="Bootstrap" />
    </a>
    <a href="https://mui.com/" target="_blank">
      <img src="https://img.shields.io/badge/Material%20UI-007FFF?style=for-the-badge&logo=mui&logoColor=white" alt="MUI" />
    </a>
    <a href="https://www.chartjs.org/" target="_blank">
      <img src="https://img.shields.io/badge/Chart.js-FF6384?style=for-the-badge&logo=chartdotjs&logoColor=white" alt="Chart.js" />
    </a>
    <a href="https://nodejs.org/" target="_blank">
      <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
    </a>
    <a href="https://github.com/features/actions" target="_blank">
      <img src="https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=white" alt="GitHub Actions" />
    </a>
  </p>
</div>

---

## 📖 Overview

A React task management app with folders, multi-criteria filtering, sorting, advanced editing, and a responsive UI tailored for both mobile and desktop experiences.

## ✨ Main Features

### 📝 Task Management
- **Full CRUD Operations**: Create, edit, delete, and mark tasks as completed.
- **Many-to-Many Relationships**: Flexibly link tasks to multiple folders.

### 📁 Folder Management
- **Organize & Customize**: Create, edit, and delete folders with color coding for quick visual identification.

### 🔍 Advanced Filtering & Sorting
- **Combined Filters**: 
  - Filter by status (multi-select)
  - Filter by folder (multi-select)
  - View tasks without a folder
  - Automatically hide tasks overdue by more than 7 days
- **Dynamic Sorting**:
  - Due date (ascending / descending)
  - Creation date
  - Alphabetical order

### 🧭 Contextual Navigation
- **Seamless Switching**: Readily toggle between **Tasks mode** and **Folders mode**.
- **Quick Filtering**: Click a folder to instantly view its tasks, or click folder badges directly on individual tasks.
- **Data Reset**: Easily restore the initial backup data at startup.

---

## 🛠️ Technical Stack

- **[React 18](https://react.dev/)**: Core framework (Create React App)
- **Context API**: Global state management ensuring a single source of truth
- **[React-Bootstrap](https://react-bootstrap.netlify.app/) & Bootstrap 5**: Responsive layout grids and UI components
- **[React Icons](https://react-icons.github.io/react-icons/) & [MUI Icons](https://mui.com/components/material-icons/)**: Comprehensive iconography
- **[Chart.js](https://www.chartjs.org/)**: Summary charts and statistics visualization
- **[JSDoc](https://jsdoc.app/) & [better-docs](https://github.com/SoftwareBrothers/better-docs)**: Code documentation generation

---

## ⚙️ Installation & Setup

### Prerequisites
- **Node.js**: 18+ recommended
- **npm**: Node Package Manager

### Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```
   > **Note:** If you encounter a peer dependency conflict related to `better-docs`, run:
   > ```bash
   > npm install --legacy-peer-deps
   > ```

2. **Run the application in development mode:**
   ```bash
   npm start
   ```
   *Open [http://localhost:3000](http://localhost:3000) to view it in the browser.*

---

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Runs the app in development mode. |
| `npm test` | Launches the test runner in interactive watch mode. |
| `npm run lint` | Runs ESLint to check code quality. |
| `npm run build` | Builds the app for production to the `build` folder. |
| `npm run docs` | Generates JSDoc documentation inside the `docs/` folder. |

---

## 🏗️ Architecture Summary

- `src/App.js`: App composition, context provider, conditional tasks/folders rendering, and creation modal.
- `src/contexts/TodoContext.jsx`: Single source of truth for tasks, folders, relations, current view, and folder filters.
- `src/components/TodoList`: Tasks view with sorting, filtering, and task card rendering.
- `src/components/FolderManager`: Folders view, folder editing, and folder-to-tasks navigation.
- `src/components/Task`: Task display/editing and folder association management.
- `src/components/Header`: App statistics, mobile menu, view switch, and startup reset modal.
- `src/components/CreateItemModal`: Shared modal for task and folder creation.

> **Deep Dive:** For detailed architecture and flow information, read the [Project Documentation](documentation/PROJECT_DOCUMENTATION.md).

---

## 📚 Documentation

- **Technical Documentation**: [documentation/PROJECT_DOCUMENTATION.md](documentation/PROJECT_DOCUMENTATION.md)
- **Local API Docs (JSDoc)**: Available at `docs/index.html` after running `npm run docs`.
- **Deployed API Docs**: Hosted via GitHub Pages at [https://helali-amin-24005915.github.io/TodoList.app/](https://helali-amin-24005915.github.io/TodoList.app/)

### Automated Deployment
The repository contains a GitHub Actions workflow that automates documentation deployment:
1. Installs dependencies
2. Generates JSDoc 
3. Publishes to GitHub Pages

Workflow configuration: [`.github/workflows/deploy-docs.yml`](.github/workflows/deploy-docs.yml)

---

## 🧪 Quality Notes

- **CI Validation**: Strict linting, testing, and building on Node 18 and 20.
- **CI Workflow Configuration**: [`.github/workflows/ci.yml`](.github/workflows/ci.yml)
