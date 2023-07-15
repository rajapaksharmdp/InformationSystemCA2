import json
teacherslist = []
print("Started Reading json file which contains multiple json documents")
with open ('teachers.json') as f:
    for line in f:
        line = line.strip()
    if line:
        try:
            teacherDict = json.loads(line)
            teacherslist.append(teacherDict)
        except json.JSONDecodeError as e:
            print(f"Error decoding JSON: {e}")
            print(f"problematic line: {line}")
    print("printing each JSON Decoded Object")
    for teacher in teacherslist:
        print(teacher["teacher_id"], teacher["teacher_name"], teacher["teacher_email"], teacher["teacher_ph.no"], teacher["teacher_address"])


