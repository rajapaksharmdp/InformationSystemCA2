import json
from flask import Flask, jsonify, request
from flask_cors import CROS

# File path to the teachers data
teachers_file = 'Storage/techers.json'

#Load teachers from the file
def load_teachers_from_file():
    with open(teachers_file) as f:
        teachers_dat = json.load(f)
        return teachers_data

# Save teachers to the file
def save_teachers_to_the_file(teachers_data):
    with open(techers_file,'w') as f:
        json.dump(techers_data, f)

# get all teachers
@app.route('/teachers', methods=['GET'])
def get_teachers():
   teachers_data = load_teachers_from_file()
   return jsonify(techers_data)

#create new teacher

@app.route('/teachers', methods=[POST])
def create_teacher():
    new_teacher = request.json
    teachers_data = load_teachers_from_file()
    teachers_data.append(new_teacher)
    save_teachers_to_the_file(teachers_data)
    return jsonify(new_teacher), 201




