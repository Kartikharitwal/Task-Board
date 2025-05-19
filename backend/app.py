import os
from flask import Flask, jsonify, request
from flask_cors import CORS
import sqlite3
import json
from datetime import datetime

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Database setup
DB_PATH = 'tasks.db'

def init_db():
    """Initialize the database with a tasks table if it doesn't exist."""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Create tasks table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT,
            status TEXT NOT NULL,
            created_at TEXT NOT NULL
        )
    ''')
    
    conn.commit()
    conn.close()

def dict_factory(cursor, row):
    """Convert database row objects to dictionaries."""
    d = {}
    for idx, col in enumerate(cursor.description):
        d[col[0]] = row[idx]
    return d

# Initialize the database
init_db()

# API Routes
@app.route('/api/tasks', methods=['GET'])
def get_tasks():
    """Get all tasks."""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = dict_factory
    cursor = conn.cursor()
    
    cursor.execute('SELECT * FROM tasks ORDER BY id DESC')
    tasks = cursor.fetchall()
    
    conn.close()
    return jsonify(tasks)

@app.route('/api/tasks', methods=['POST'])
def create_task():
    """Create a new task."""
    data = request.json
    
    if not data or 'title' not in data or 'status' not in data:
        return jsonify({'error': 'Title and status are required'}), 400
    
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = dict_factory
    cursor = conn.cursor()
    
    created_at = datetime.now().isoformat()
    
    cursor.execute(
        'INSERT INTO tasks (title, description, status, created_at) VALUES (?, ?, ?, ?)',
        (data['title'], data.get('description', ''), data['status'], created_at)
    )
    
    task_id = cursor.lastrowid
    conn.commit()
    
    # Fetch the newly created task
    cursor.execute('SELECT * FROM tasks WHERE id = ?', (task_id,))
    new_task = cursor.fetchone()
    
    conn.close()
    return jsonify(new_task), 201

@app.route('/api/tasks/<int:task_id>', methods=['GET'])
def get_task(task_id):
    """Get a specific task by ID."""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = dict_factory
    cursor = conn.cursor()
    
    cursor.execute('SELECT * FROM tasks WHERE id = ?', (task_id,))
    task = cursor.fetchone()
    
    conn.close()
    
    if task:
        return jsonify(task)
    return jsonify({'error': 'Task not found'}), 404

@app.route('/api/tasks/<int:task_id>', methods=['PUT'])
def update_task(task_id):
    """Update a task."""
    data = request.json
    
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = dict_factory
    cursor = conn.cursor()
    
    # Check if task exists
    cursor.execute('SELECT * FROM tasks WHERE id = ?', (task_id,))
    task = cursor.fetchone()
    
    if not task:
        conn.close()
        return jsonify({'error': 'Task not found'}), 404
    
    # Update fields that are provided
    fields = []
    values = []
    
    if 'title' in data:
        fields.append('title = ?')
        values.append(data['title'])
    
    if 'description' in data:
        fields.append('description = ?')
        values.append(data['description'])
    
    if 'status' in data:
        fields.append('status = ?')
        values.append(data['status'])
    
    if not fields:
        conn.close()
        return jsonify({'error': 'No valid fields to update'}), 400
    
    values.append(task_id)
    
    query = f"UPDATE tasks SET {', '.join(fields)} WHERE id = ?"
    cursor.execute(query, values)
    conn.commit()
    
    # Fetch the updated task
    cursor.execute('SELECT * FROM tasks WHERE id = ?', (task_id,))
    updated_task = cursor.fetchone()
    
    conn.close()
    return jsonify(updated_task)

@app.route('/api/tasks/<int:task_id>/status', methods=['PATCH'])
def update_task_status(task_id):
    """Update only the status of a task."""
    data = request.json
    
    if not data or 'status' not in data:
        return jsonify({'error': 'Status is required'}), 400
    
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = dict_factory
    cursor = conn.cursor()
    
    # Check if task exists
    cursor.execute('SELECT * FROM tasks WHERE id = ?', (task_id,))
    task = cursor.fetchone()
    
    if not task:
        conn.close()
        return jsonify({'error': 'Task not found'}), 404
    
    cursor.execute(
        'UPDATE tasks SET status = ? WHERE id = ?',
        (data['status'], task_id)
    )
    conn.commit()
    
    # Fetch the updated task
    cursor.execute('SELECT * FROM tasks WHERE id = ?', (task_id,))
    updated_task = cursor.fetchone()
    
    conn.close()
    return jsonify(updated_task)

@app.route('/api/tasks/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    """Delete a task."""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Check if task exists
    cursor.execute('SELECT * FROM tasks WHERE id = ?', (task_id,))
    task = cursor.fetchone()
    
    if not task:
        conn.close()
        return jsonify({'error': 'Task not found'}), 404
    
    cursor.execute('DELETE FROM tasks WHERE id = ?', (task_id,))
    conn.commit()
    conn.close()
    
    return jsonify({'message': 'Task deleted successfully'})

# Add some sample tasks if the database is empty
def add_sample_tasks():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = dict_factory
    cursor = conn.cursor()
    
    cursor.execute('SELECT COUNT(*) as count FROM tasks')
    count = cursor.fetchone()['count']
    
    if count == 0:
        created_at = datetime.now().isoformat()
        sample_tasks = [
            ('Complete project documentation', 'Write detailed documentation for the task board project', 'to-do', created_at),
            ('Design UI mockups', 'Create wireframes for all screens', 'in-progress', created_at),
            ('Setup CI/CD pipeline', 'Configure GitHub Actions for continuous integration', 'to-do', created_at),
            ('Implement drag and drop', 'Add drag and drop functionality between columns', 'done', created_at),
            ('Write unit tests', 'Create tests for backend API endpoints', 'to-do', created_at)
        ]
        
        cursor.executemany(
            'INSERT INTO tasks (title, description, status, created_at) VALUES (?, ?, ?, ?)',
            sample_tasks
        )
        conn.commit()
    
    conn.close()

# Add sample tasks when the app starts
add_sample_tasks()

if __name__ == '__main__':
    print("starting Flask server...")
    app.run(debug=True, port=5000)