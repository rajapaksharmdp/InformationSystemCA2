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



if __name__ == '__main__':
    app.run(port=8080)