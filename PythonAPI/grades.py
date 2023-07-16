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
# API route to get all students
@app.route('/students', methods=['GET'])
def get_students():
    return jsonify(students)

#API route to get all students
@app.route('/students',method=['GET'])
def get_students():
    return jsonify(students)
# API route to create a new student
@app.route('/students', methods=['POST'])
def create_student():
    new_student = {
        "student_id": request.json["student_id"],
        "student_name": request.json["student_name"],
        "grades": {}
    }
    students.append(new_student)
    return jsonify(new_student), 201

# API route to update a student's grades
@app.route('/students/<int:student_id>', methods=['PUT'])
def update_grades(student_id):
    student in students:
        if student["student_id"] == student_id:
            grades = request.json["grades"]
            student["grades"] = grades
            return jsonify(student)
    return jsonify({"error": "Student not found"}), 404

# API route to delete a student
@app.route('/students/<int:student_id>', methods=['DELETE'])
def delete_student(student_id):
    for student in students:
        if student["student_id"] == student_id:
            students.remove(student)
            return jsonify({"message": "Student deleted"})
    return jsonify({"error": "Student not found"}), 404

if __name__ == '__main__':
    app.run()














# Calculate grades for each student
def calculate_grades(students_data):
    for student in students_data:
        marks = student['subjects']
        total_marks = sum(marks[sub]['mark'] for sub in marks)
        subjects_count = len(marks)
        percentage = total_marks / subjects_count if subjects_count > 0 else 0

        if percentage >= 85:
            grade = 'A+'
        elif percentage >= 75:
            grade = 'A'
        elif percentage >= 65:
            grade = 'B'
        elif percentage >= 55:
            grade = 'C'
        elif percentage >= 45:
            grade = 'D'
        else:
            grade = 'F'
        student['grade'] = grade

