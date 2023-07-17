import json
from flask import Flask, jsonify, request

app = Flask(__name__)

GRADES_FILE = 'Storage/grades.json'
STUDENT_FILE = 'Storage/students.json'


# Load the JSON data from a file
def load_data(file_path):
    with open(file_path) as file:
        data = json.load(file)
    return data


# Save the JSON data to a file
def save_data(data, file_path):
    with open(file_path, 'w') as file:
        json.dump(data, file, indent=2)


# Get all grades
@app.route('/grades', methods=['GET'])
def get_grades():
    grades_data = load_data(GRADES_FILE)
    return jsonify(grades_data)


# Add a grade to a student
@app.route('/grades', methods=['POST'])
def create_grade():
    # Get the new grade data from the request body
    new_grade = request.json

    # Load existing grades
    grades_data = load_data(GRADES_FILE)

    # Check if grade ID already exists
    existing_ids = [grade['grade_id'] for grade in grades_data]
    if new_grade['grade_id'] in existing_ids:
        return jsonify({'error': 'Grade ID already exists'}), 400

    # Add the new grade to the list
    grades_data.append(new_grade)

    # Save the updated grades data to the file
    save_data(grades_data, GRADES_FILE)

    return jsonify(new_grade), 201  # Return the created grade with 201 status code


# Update a grade
@app.route('/grades/<string:grade_id>', methods=['PUT'])
def update_grade(grade_id):
    # Get the updated grade data from the request body
    updated_grade = request.json

    # Load existing grades
    grades_data = load_data(GRADES_FILE)

    # Find the grade to update
    for grade in grades_data:
        if grade['grade_id'] == grade_id:
            # Update the grade data
            grade.update(updated_grade)
            # Save the updated grades data to the file
            save_data(grades_data, GRADES_FILE)
            return jsonify(grade), 200

    # Grade not found
    return jsonify({'error': 'Grade not found'}), 404


# Delete a grade
@app.route('/grades/<string:grade_id>', methods=['DELETE'])
def delete_grade(grade_id):
    # Load existing grades
    grades_data = load_data(GRADES_FILE)

    # Find the grade to delete
    for grade in grades_data:
        if grade['grade_id'] == grade_id:
            # Remove the grade from the list
            grades_data.remove(grade)
            # Save the updated grades data to the file
            save_data(grades_data, GRADES_FILE)
            return jsonify({'message': 'Grade deleted successfully'}), 200

    # Grade not found
    return jsonify({'error': 'Grade not found'}), 404


if __name__ == '__main__':
    app.run(port=8080)




