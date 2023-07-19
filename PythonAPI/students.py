import json
from flask import Flask, jsonify, request
from flask_cors import CORS


# Initialize Flask app
app = Flask(__name__)
CORS(app)


students_file = 'Storage/students.json'


def open_student():
    with open(students_file) as f:
        students_data = json.load(f)
    return students_data

def save_student(students_data):
    with open(students_file, 'w') as f:
        json.dump(students_data, f)

@app.route('/students', methods=['GET'])
def get_students():
    students_data = open_student()
    return jsonify(students_data)


#add student
@app.route('/newstudent', methods=['POST'])
def create_student():
    new_student = request.json

    students_data = open_student()
    students_data.append(new_student)

    save_student(students_data)
    return jsonify(new_student), 201

#delete student

@app.route('/deletestudents/<int:student_id>', methods=['DELETE'])
def delete_student(student_id):
    students_data = open_student()
    for student in students_data:
        if student['student_id'] == student_id:
            students_data.remove(student)
            break

    save_student(students_data)
    return jsonify({'message': 'Student Deleted'}), 200

if __name__ == '__main__':
    app.run(port=8080)