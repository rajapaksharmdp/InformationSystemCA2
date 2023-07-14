import json
from flask import Flask, jsonify
from flask_cors import CORS

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# File path to the subjects data
students_file = 'Storage/students.json'


# open students from the file
def open_students():
    with open(students_file) as std_file:
        std_data = json.load(std_file)
    return std_data


# get students
@app.route('/', methods=['GET'])
def get_students():
    std_data = open_students()
    return jsonify(std_data)


# Run the Flask app on localhost with port 8080
if __name__ == '__main__':
    app.run(port=8080)
