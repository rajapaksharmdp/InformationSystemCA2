import requests
import json
from flask import Flask, jsonify, request
from flask_cors import CORS

# Initialize Flask app
app = Flask(__name__)
CORS(app)

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
    sort_by = request.args.get('sort_by')
    sort_order = request.args.get('sort_order')

    if sort_by and sort_order:
        subjects_data = sort_subjects(subjects_data, sort_by, sort_order)
    return jsonify(subjects_data)


def sort_subjects(subjects_data, sort_by, sort_order):
    if sort_by == 'subject_name':
        subjects_data.sort(key=lambda x: x['subject_name'], reverse=sort_order == 'desc')
    elif sort_by == 'subject_id':
        subjects_data.sort(key=lambda x: x['subject_id'], reverse=sort_order == 'desc')
    return subjects_data


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

    # Add the new subject to the list
    subjects_data.append(new_subject)

    # Save the updated subjects data to the file
    save_subjects_to_file(subjects_data)

    return jsonify(new_subject), 201  # Return the created subject with 201 status code


# update subject
@app.route('/update_subject/<subject_id>', methods=['PUT'])
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
@app.route('/delete_subject/<subject_id>', methods=['DELETE'])
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


@app.route('/filter_subjects', methods=['GET'])
def filter_subjects():
    subjects_data = load_subjects_from_file()

    # Get the filter parameters from the query string
    subject_id = request.args.get('subject_id')
    subject_name = request.args.get('subject_name')
    teacher = request.args.get('teacher')

    filtered_subjects = []

    # Filter the subjects based on the provided parameters
    for subject in subjects_data:
        if subject_id is not None and subject_id.lower() != subject['subject_id'].lower():
            continue
        if subject_name is not None and subject_name.lower() not in subject['subject_name'].lower():
            continue
        if teacher is not None:
            teacher_found = False
            for teacher_name in subject['teachers']:
                if teacher.lower() in teacher_name.lower():
                    teacher_found = True
                    break
            if not teacher_found:
                continue
        filtered_subjects.append(subject)

    return jsonify(filtered_subjects)


# Run the Flask app on localhost with port 8080
if __name__ == '__main__':
    app.run(port=8080)
