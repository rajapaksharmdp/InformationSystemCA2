import json
from flask import Flask, jsonify
from flask_cors import CORS

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# File path to the students data
students_file = 'Storage/students.json'


# Load students from the file
def load_students():
    with open(students_file) as f:
        students_data = json.load(f)
    return students_data


# Save students to the file
def save_students(students_data):
    with open(students_file, 'w') as f:
        json.dump(students_data, f, indent=4)


# Calculate grades for each student
def calculate_grades(students_data):
    for student in students_data:
        marks = student['subjects']
        total_marks = sum(marks[sub]['mark'] for sub in marks)
        subjects_count = len(marks)
        percentage = total_marks / subjects_count if subjects_count > 0 else 0

        if percentage >= 90:
            grade = 'A+'
        elif percentage >= 80:
            grade = 'A'
        elif percentage >= 70:
            grade = 'B'
        elif percentage >= 60:
            grade = 'C'
        elif percentage >= 50:
            grade = 'D'
        else:
            grade = 'F'

        student['grade'] = grade


# Get students
@app.route('/', methods=['GET'])
def get_students():
    students_data = load_students()
    calculate_grades(students_data)
    return jsonify(students_data)


# Run the Flask app on localhost with port 8080
if __name__ == '__main__':
    app.run(port=8080)
