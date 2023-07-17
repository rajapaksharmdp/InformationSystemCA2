import pandas as pd
import matplotlib.pyplot as plt
import json

gradesnew = 'Storage/grade.json'


def load_grades_from_file():
    with open(gradesnew) as f:
        students_data = json.load(f)
    return students_data


students_data = load_grades_from_file()

# Convert the list of dictionaries to a DataFrame
df = pd.DataFrame(students_data)

# Choose the subject to compare (e.g., "Math", "Science", "English")
subject_to_compare = "Math"

# Filter the DataFrame to include only data for the selected subject
subject_df = df[['student_name', 'subjects']].explode('subjects')
subject_df = subject_df[subject_df['subjects'].apply(lambda x: x.get('subject_name') == subject_to_compare)]

# Create the graph
plt.figure(figsize=(10, 6))
plt.bar(subject_df['student_name'], subject_df['subjects'].apply(lambda x: x.get('mark')), color='b')

# Color-code the bars based on grades (you can customize the colors as needed)
grades = ['A', 'B', 'C', 'D']
colors = ['green', 'blue', 'orange', 'red']
for grade, color in zip(grades, colors):
    plt.bar(subject_df[subject_df['subjects'].apply(lambda x: x.get('grade') == grade)]['student_name'],
            subject_df[subject_df['subjects'].apply(lambda x: x.get('grade') == grade)]['subjects'].apply(
                lambda x: x.get('mark')),
            color=color)

# Add labels and title
plt.xlabel('Student Names')
plt.ylabel('Marks')
plt.title(f'{subject_to_compare} Subject-wise Comparison')
plt.legend(grades, title='Grades')

# Rotate the x-axis labels for better readability (optional)
plt.xticks(rotation=45)

# Display the graph
plt.tight_layout()
plt.show()
