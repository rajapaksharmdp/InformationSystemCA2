# File path to the teachers data
teachers_file = 'Storage/techers.json'

#Load teachers from the file
def load_teachers_from_file():
    with open(teachers_file) as f:
        teachers_dat = json.load(f)
        return teachers_data


