import json
from flask import Flask, jsonify, request
from flask_cors import CORS


# Initialize Flask app
app = Flask(__name__)
CORS(app)


students_file = 'Storage/students.json'


class StudentAPI:
    @staticmethod
    def open_student():
        with open(students_file) as f:
            students_data = json.load(f)
        return students_data

    @staticmethod
    def save_student(students_data):
        with open(students_file, 'w') as f:
            json.dump(students_data, f)

    @app.route('/students', methods=['GET'])
    def get_students(self):
        students_data = StudentAPI.open_student()
        return jsonify(students_data)

    # new student

    @app.route('/students', methods=['POST'])
    def create_student(self):
        new_student = request.json

        students_data = StudentAPI.open_student()
        students_data.append(new_student)

        StudentAPI.save_student(students_data)
        return jsonify(new_student), 201

    # update student

    @app.route('/students/<int:student_id>', methods=['PUT'])
    def update_student(self, student_id):
        updated_student = request.json

        students_data = StudentAPI.open_student()
        for student in students_data:
            if student['student_id'] == student_id:
                student.update(updated_student)
                break

        StudentAPI.save_student(students_data)
        return jsonify(updated_student), 200

    # delete student

    @app.route('/students/<int:student_id>', methods=['DELETE'])
    def delete_student(self, student_id):
        students_data = StudentAPI.open_student()
        for student in students_data:
            if student['student_id'] == student_id:
                students_data.remove(student)
                break

        StudentAPI.save_student(students_data)
        return jsonify({'message': 'Student Deleted'}), 200


student_api = StudentAPI()

if __name__ == '__main__':
    app.run(port=8080)
