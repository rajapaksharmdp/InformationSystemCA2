import requests
import json
from flask import Flask, jsonify, request
from flask_cors import CORS

# Initialize Flask app
app = Flask(__name__)

# File path to the subjects data
subjects_file = 'Storage/subjects.json'


# Load subjects from the file
def load_subjects_from_file():
    with open(subjects_file) as f:
        subjects_data = json.load(f)
    return subjects_data


# Save subjects to the file
def save_subjects_to_file(subjects_data):
    with open(subjects_file, 'w') as f:
        json.dump(subjects_data, f)


# get subjects
@app.route('/', methods=['GET'])
def get_subjects():
    subjects_data = load_subjects_from_file()
    return jsonify(subjects_data)


# create subject
@app.route('/add_subject', methods=['POST'])
def create_subject():
    # Get the new subject data from the request body
    new_subject = request.json

    # Load existing subjects
    subjects_data = load_subjects_from_file()

    # Check if subject ID already exists
    existing_ids = [subject['subject_id'] for subject in subjects_data]
    if new_subject['subject_id'] in existing_ids:
        return jsonify({'error': 'Subject ID already exists'}), 400

    # Assign a new subject ID
    new_subject_id = len(subjects_data) + 1
    new_subject['subject_id'] = new_subject_id

    # Add the new subject to the list
    subjects_data.append(new_subject)

    # Save the updated subjects data to the file
    save_subjects_to_file(subjects_data)

    return jsonify(new_subject), 201  # Return the created subject with 201 status code




# update subject
@app.route('/modify_subject/<int:subject_id>', methods=['PUT'])
def update_subject(subject_id):
    # Get the updated subject data from the request body
    updated_subject = request.json

    # Load existing subjects
    subjects_data = load_subjects_from_file()

    # Find the subject to update by subject_id
    for subject in subjects_data:
        if subject['subject_id'] == subject_id:
            # Update the subject with new data
            subject.update(updated_subject)
            break

    # Save the updated subjects data to the file
    save_subjects_to_file(subjects_data)

    return jsonify(updated_subject), 200  # Return the updated subject with 200 status code


# delete subject
@app.route('/delete_subject/<int:subject_id>', methods=['DELETE'])
def delete_subject(subject_id):
    # Load existing subjects
    subjects_data = load_subjects_from_file()

    # Find the subject to delete by subject_id
    for subject in subjects_data:
        if subject['subject_id'] == subject_id:
            # Remove the subject from the list
            subjects_data.remove(subject)
            break

    # Save the updated subjects data to the file
    save_subjects_to_file(subjects_data)

    return jsonify({'message': 'Subject deleted'}), 200  # Return a response with a message and 200 status code


# Run the Flask app on localhost with port 8080
if __name__ == '__main__':
    app.run(port=8080)
