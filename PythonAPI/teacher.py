import json
from flask import Flask, json, request
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
        

