import json
from flask import Flask, jsonify, request
from flask_cors import CORS
import hashlib

# Initialize Flask app
app = Flask(__name__)
CORS(app)

"""--------------------------------------------------------------------------------------------------------------------
Registration and Login Section
--------------------------------------------------------------------------------------------------------------------"""
users_file = 'Storage/users.json'


def save_users_to_file(users_data):
    with open(users_file, 'w') as f:
        json.dump(users_data, f)


def load_users_from_file():
    try:
        with open(users_file) as f:
            users_data = json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        users_data = []
    return users_data


# register users
@app.route('/register', methods=['POST'])
def register():
    try:
        user_data = request.json
        users_data = load_users_from_file()

        existing_usernames = [user['username'] for user in users_data]
        if user_data['username'] in existing_usernames:
            return jsonify({'error': 'User already exists'}), 400

        password = user_data['password']
        hashed_password = hash_password(password)

        user_data['password'] = hashed_password
        users_data.append(user_data)
        save_users_to_file(users_data)

        return jsonify({'message': 'Registration successful'}), 201

    except Exception as e:
        return jsonify({'error': 'Registration failed', 'details': str(e)}), 500


def hash_password(password):
    salt = "random_salt"
    salted_password = salt + password
    hashed_password = hashlib.sha256(salted_password.encode()).hexdigest()
    return hashed_password


@app.route('/login', methods=['POST'])
def login():
    try:
        login_data = request.json
        users_data = load_users_from_file()

        username = login_data.get('username')
        password = login_data.get('password')

        for user in users_data:
            if user['username'] == username and verify_password(password, user['password']):
                role = user['role']
                return jsonify({'message': 'Login successful', 'role': role}), 200

        return jsonify({'error': 'Invalid username or password'}), 401

    except Exception as e:
        return jsonify({'error': 'Login failed', 'details': str(e)}), 500


def verify_password(password, hashed_password):
    salt = "random_salt"
    salted_password = salt + password
    hashed_input = hashlib.sha256(salted_password.encode()).hexdigest()
    return hashed_input == hashed_password


"""--------------------------------------------------------------------------------------------------------------------
Subjects Section
--------------------------------------------------------------------------------------------------------------------"""

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
    sort_by = request.args.get('sort_by')
    sort_order = request.args.get('sort_order')

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

    # Apply sorting based on the provided parameters
    if sort_by and sort_order:
        filtered_subjects = sort_subjects(filtered_subjects, sort_by, sort_order)

    return jsonify(filtered_subjects)


##############################################################################################################################
# teachers Section
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
        return jsonify(
            {"message": "Invalid teacher data. Required fields: teacher_id, name, email, phone_no, address"}), 400

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


#############################################################################################################################

###############################################################################################################################

# Grades Section

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


##############################################################################################################################


# Run the Flask app on localhost with port 8080
if __name__ == '__main__':
    app.run(port=8080)
