import json
import requests
import json
from flask import Flask, jsonify, request


app = Flask(__name__)


GRADES_FILE = 'grades.json'
# Load the JSON data from a file
def load_data():
    with open(GRADES_FILE, 'r') as file:
        data = json.load(file)
    return data


# Save the JSON data to a file
def save_data(data):
    with open(GRADES_FILE, 'w') as file:
        json.dump(data, file, indent=2)


# Get all students
def get_students():
    data = load_data()
    students = [student for student in data]
    return students


# Get a specific student by ID
def get_student(student_id):
    data = load_data()
    student = next((student for student in data if student['student_id'] == student_id), None)
    return student


# Create a new student
def create_student(student_id, student_name):
    data = load_data()
    new_student = {
        "student_id": student_id,
        "student_name": student_name,
        "subjects": []
    }
    data.append(new_student)
    save_data(data)


# Add a subject to a student
def add_subject(student_id, subject_id, subject_name, teacher_id, mark, grade):
    data = load_data()
    student = next((student for student in data if student['student_id'] == student_id), None)
    if student:
        new_subject = {
            "subject_id": subject_id,
            "subject_name": subject_name,
            "teacher_id": teacher_id,
            "mark": mark,
            "grade": grade
        }
        student['subjects'].append(new_subject)
        save_data(data)


# Update a subject's details
def update_subject(student_id, subject_id, mark, grade):
    data = load_data()
    student = next((student for student in data if student['student_id'] == student_id), None)
    if student:
        for subject in student['subjects']:
            if subject['subject_id'] == subject_id:
                subject['mark'] = mark
                subject['grade'] = grade
                save_data(data)
                break


# Delete a subject from a student
def delete_subject(student_id, subject_id):
    data = load_data()
    student = next((student for student in data if student['student_id'] == student_id), None)
    if student:
        student['subjects'] = [subject for subject in student['subjects'] if subject['subject_id'] != subject_id]
        save_data(data)


if __name__ == '__main__':
    app.run(port=8080)
