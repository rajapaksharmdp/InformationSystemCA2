document.addEventListener('DOMContentLoaded', () => {
  // Function to fetch and display grades data
  function fetchGradesData() {
    fetch('http://localhost:8080/getgrades', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(data => {
        // Clear existing data from the table
        document.getElementById('gradesTableBody').innerHTML = '';

        // Loop through the grades data and create table rows
        data.forEach(grade => {
          let row = document.createElement('tr');
          row.innerHTML = `
            <td>${grade.grade_id}</td>
            <td>${grade.student_id}</td>
            <td>${grade.subject_id}</td>
            <td data-field="mark" contenteditable>${grade.mark}</td>
            <td data-field="grade" contenteditable>${grade.grade}</td>
            <td>
              <button class="btn btn-sm btn-primary" data-grade-id="${grade.grade_id}">Edit</button>
              <button class="btn btn-sm btn-danger" data-grade-id="${grade.grade_id}">Delete</button>
            </td>
          `;
          document.getElementById('gradesTableBody').appendChild(row);
        });
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }

  // Call the fetchGradesData function to display grades on page load
  fetchGradesData();

  // Function to handle grade deletion
  
  function deleteGrade(gradeId) {
    if (confirm('Are you sure you want to delete this grade?')) {
      fetch(`http://localhost:8080/deletegrades/${gradeId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(response => {
          if (response.ok) {
            fetchGradesData(); // Refresh the table after deletion
          } else {
            console.error('Error deleting grade:', response.statusText);
          }
        })
        .catch(error => {
          console.error('Error:', error);
        });
    }
  }

  function createGrade(newGrade) {
    fetch('http://localhost:8080/addgrades', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newGrade),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Grade created:', data);
        fetchGradesData(); // Refresh the table after adding the grade
      })
      .catch(error => {
        console.error('Error creating grade:', error);
      });
  }


     // Function to handle grade editing
  function editGrade(gradeId) {
    let markCell = document.querySelector(`tr[data-grade-id="${gradeId}"] td[data-field="mark"]`);
    let gradeCell = document.querySelector(`tr[data-grade-id="${gradeId}"] td[data-field="grade"]`);

    // Save the current values before editing
    let originalMark = markCell.textContent;
    let originalGrade = gradeCell.textContent;

    // Make the mark and grade cells editable
    markCell.contentEditable = true;
    gradeCell.contentEditable = true;

    // Add a class to indicate editable cells
    markCell.classList.add('editable');
    gradeCell.classList.add('editable');

    // Add the save icon (checkmark) for the editable cells
    markCell.innerHTML += '<i class="fas fa-check text-success save-icon"></i>';
    gradeCell.innerHTML += '<i class="fas fa-check text-success save-icon"></i>';

    // Add event listener to save changes when editing is done
    markCell.addEventListener('blur', () => {
      markCell.contentEditable = false;
      markCell.classList.remove('editable');

      // Remove the save icon
      markCell.querySelector('.save-icon').remove();

      // Check if the value changed
      if (markCell.textContent !== originalMark) {
        let updatedGrade = {
          mark: markCell.textContent,
          grade: originalGrade, // Use the original grade value as it hasn't changed
        };
        updateGrade(gradeId, updatedGrade);
      }
    });

    gradeCell.addEventListener('blur', () => {
      gradeCell.contentEditable = false;
      gradeCell.classList.remove('editable');

      // Remove the save icon
      gradeCell.querySelector('.save-icon').remove();

      // Check if the value changed
      if (gradeCell.textContent !== originalGrade) {
        let updatedGrade = {
          mark: originalMark, // Use the original mark value as it hasn't changed
          grade: gradeCell.textContent,
        };
        updateGrade(gradeId, updatedGrade);
      }
    });
  }
  
  
  

  document.getElementById('gradesTableBody').addEventListener('click', function(event) {
    let target = event.target;
    if (target.tagName === 'BUTTON' && target.dataset.action === 'edit') {
      editGrade(target.dataset.gradeId);
    } else if (target.tagName === 'BUTTON' && target.classList.contains('btn-danger')) {
      deleteGrade(target.dataset.gradeId);
    }
  });

  document.getElementById('addNewBtn').addEventListener('click', () => {
    // Get the input values from the user
    let gradeId = parseInt(document.getElementById('gradeId').value, 10);
    let studentId = parseInt(document.getElementById('studentId').value, 10);
    let subjectId = parseInt(document.getElementById('subjectId').value, 10);
    let mark = parseInt(document.getElementById('mark').value, 10);
    let grade = document.getElementById('grade').value;
  

    // Create a new grade object
    let newGrade = {
      grade_id: gradeId,
      student_id: studentId,
      subject_id: subjectId,
      mark: mark,
      grade: grade,
    };

    createGrade(newGrade);
  });
  
});
