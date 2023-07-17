# File path to the teachers data
teachers_file = 'Storage/teachers.json'


# Load teachers from the file
def load_teachers_from_file():
    with open(teachers_file) as f:
        teachers_data = json.load(f)
    return teachers_data


# Save teachers to the file
def save_teachers_to_file(teachers_data):
    with open(teachers_file, 'w') as f:
        json.dump(teachers_data, f)


# get all teachers
@app.route('/teachers', methods=['GET'])
def get_teachers():
    teachers_data = load_teachers_from_file()
    return jsonify(teachers_data)


# create a new teacher
@app.route('/teachers', methods=['POST'])
def create_teacher():
    new_teacher = request.json

    teachers_data = load_teachers_from_file()
    teachers_data.append(new_teacher)

    save_teachers_to_file(teachers_data)
    return jsonify(new_teacher), 201


# update a teacher
@app.route('/teachers/<int:teacher_id>', methods=['PUT'])
def update_teacher(teacher_id):
    updated_teacher = request.json

    teachers_data = load_teachers_from_file()
    for teacher in teachers_data:
        if teacher['teacher_id'] == teacher_id:
            teacher.update(updated_teacher)
            break

    save_teachers_to_file(teachers_data)
    return jsonify(updated_teacher), 200


# delete a teacher
@app.route('/teachers/<int:teacher_id>', methods=['DELETE'])
def delete_teacher(teacher_id):
    teachers_data = load_teachers_from_file()
    for teacher in teachers_data:
        if teacher['teacher_id'] == teacher_id:
            teachers_data.remove(teacher)
            break

    save_teachers_to_file(teachers_data)
    return jsonify({'message': 'Teacher deleted'}), 200
