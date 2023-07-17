from typing import Any
import requests
import json

from flask import Flask, jsonify, request

app = Flask(__name__)

teachers_file = 'Storage/teachers.json'

def load_teachers_from_file():
    with open(teachers_file) as f:
        teachers_data = json.load(f)
    return teachers_data

def save_teachers_to_file(teachers_data):
    with open(teachers_file, 'w') as f:
        json.dump(teachers_data, f, indent=4)


@app.route('/getteachers', methods=['GET'])
def get_teachers():
    teachers_data = load_teachers_from_file()
    return jsonify(teachers_data)


@app.route('/addteachers', methods=['POST'])
def create_teacher():
    new_teacher = request.json
    if not new_teacher or not all(key in new_teacher for key in ['teacher_id', 'name', 'email', 'phone_no', 'address']):
        return jsonify({"message": "Invalid teacher data. Required fields: teacher_id, name, email, phone_no, address"}), 400

    teachers_data = load_teachers_from_file()
    teachers_data.append(new_teacher)
    save_teachers_to_file(teachers_data)
    return jsonify(new_teacher), 201

@app.route('/update_teachers/<int:teacher_id>', methods=['PUT'])
def update_teacher(teacher_id):
    updated_teacher = request.json
    teachers_data = load_teachers_from_file()

    for i, teacher in enumerate(teachers_data):
        if teacher['teacher_id'] == teacher_id:
            teachers_data[i].update(updated_teacher)
            save_teachers_to_file(teachers_data)
            return jsonify(updated_teacher), 200

    return jsonify({"message": "Teacher not found"}), 404

@app.route('/delete_teachers/<int:teacher_id>', methods=['DELETE'])
def delete_teacher(teacher_id):
    teachers_data = load_teachers_from_file()
    for i, teacher in enumerate(teachers_data):
        if teacher['teacher_id'] == teacher_id:
            del teachers_data[i]
            save_teachers_to_file(teachers_data)
            return jsonify({"message": "Teacher deleted"}), 200

    return jsonify({"message": "Teacher not found"}), 404

    if __name__ == '__main__':
            app.run(debug=True)
