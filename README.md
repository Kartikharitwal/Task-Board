# Task Management Board

A simple task management board application with a backend built in Python (Flask) and a frontend using React, Vite, and Tailwind CSS. This project allows users to view, create, edit, and delete tasks, as well as drag and drop tasks between status columns (To Do, In Progress, Done).

## Project Objectives

This project was built as an evaluation of skills in structuring components, managing state, implementing interactivity, and developing/integrating basic APIs, as per the provided guidelines.

## Features

*   Display tasks in "To Do", "In Progress", and "Done" columns.
*   Create new tasks with title and optional description.
*   Edit existing task details.
*   Delete tasks.
*   Drag and drop tasks between columns.
*   Data persistence using a Python Flask backend with SQLite.
*   Dark mode toggle.
*   Basic responsive design.

## Technologies Used

**Frontend:**
*   React (with Hooks)
*   Vite
*   Tailwind CSS
*   react-beautiful-dnd (for drag and drop)

**Backend:**
*   Python 3
*   Flask
*   Flask-CORS
*   SQLite (via Python's `sqlite3` module)
*   Gunicorn (for production server)

## Setup and Running Locally

Follow these steps to get the application running on your local machine.

**1. Clone the Repository:**

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
cd YOUR_REPO_NAME
```
(Replace `YOUR_USERNAME` and `YOUR_REPO_NAME` with your actual GitHub username and repository name)

**2. Backend Setup:**

Navigate into the `backend` directory:

```bash
cd backend
```

Create and activate a Python virtual environment:

*   macOS/Linux:
    ```bash
    python3 -m venv venv
    source venv/bin/activate
    ```
*   Windows:
    ```bash
    python -m venv venv
    .\venv\Scripts\activate
    ```

Install the required Python packages:

```bash
pip install -r requirements.txt
```
*(Ensure your `backend/requirements.txt` file lists all necessary packages like `Flask`, `Flask-CORS`, and `gunicorn`. If it's empty or missing packages, activate your venv locally and run `pip freeze > requirements.txt`.)*

Run the Flask backend server:

```bash
python app.py
```
The backend server should start on `http://127.0.0.1:5000/`. Keep this terminal open.

**3. Frontend Setup:**

Open a *new* terminal window and navigate to the `frontend` directory:

```bash
cd ../frontend # Go back to the root, then into frontend
```
(Or if you are already in the root, just `cd frontend`)

Install the Node.js dependencies:

```bash
npm install
```

Run the frontend development server:

```bash
npm run dev
```
The frontend should start on `http://localhost:5173/` (or a similar port). Keep this terminal open.

**4. Access the Application:**

Open your web browser and go to the address provided by the `npm run dev` command (e.g., `http://localhost:5173/`).

The task board should load, fetching data from the backend running locally.

## AI Usage
This project was built with guidance and coding help from ChatGPT by OpenAI, which provided support with debugging, deployment, and feature implementation.


## Live Application

The live deployed version of the application can be accessed here:
https://dainty-faun-7c704f.netlify.app/


*(Remember to update the `frontend/src/services/api.js` file in your code to point to your deployed backend URL before deploying the frontend.)*

## Demo Video
https://go.screenpal.com/watch/cThqo8n6QCC

