// Function to search for students by name
function searchStudents() {
  // Get the search query from the input field
  const searchInput = document.getElementById('searchBar').value.toLowerCase();

  // Get the student table rows
  const tableRows = document.querySelectorAll('#studentsTable tbody tr');

  // Loop through each row and check if it matches the search query
  tableRows.forEach(row => {
    const studentName = row.querySelector('td:nth-child(2)').textContent.toLowerCase();

    // Show or hide the row based on the search query
    if (studentName.includes(searchInput)) {
      row.style.display = 'table-row';
    } else {
      row.style.display = 'none';
    }
  });
}

// Attach event listener to search bar input
document.getElementById('searchBar').addEventListener('input', searchStudents);




// Function to fetch all students and display in table
function fetchStudents() {
  fetch('http://localhost:8080/students')
    .then(response => response.json())
    .then(data => {
      const studentsData = document.getElementById('studentsData');
      studentsData.innerHTML = '';

      data.forEach(student => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${student.student_id}</td>
          <td>${student.student_name}</td>
          <td>${student.student_class}</td>
          <td>${student.student_dob}</td>
          <td>${student.student_gender}</td>
          <td>${student.student_email}</td>
          <td>${student.student_phn}</td>
        `;
        studentsData.appendChild(row);
      });
    })
    .catch(error => {
      console.error('Error fetching students:', error);
    });
}

// Function to add a new student
function addStudent(event) {
  event.preventDefault();

  const studentId = document.getElementById('studentId').value;
  const studentName = document.getElementById('studentName').value;
  const studentClass = document.getElementById('studentClass').value;
  const studentDOB = document.getElementById('studentDOB').value;
  const studentGender = document.getElementById('studentGender').value;
  const studentEmail = document.getElementById('studentEmail').value;
  const studentPhone = document.getElementById('studentPhone').value;

  const newStudent = {
    "student_id": studentId,
    "student_name": studentName,
    "student_class": studentClass,
    "student_dob": studentDOB,
    "student_gender": studentGender,
    "student_email": studentEmail,
    "student_phn": studentPhone
  };

  fetch('http://localhost:8080/newstudent', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newStudent)
  })
    .then(response => response.json())
    .then(data => {
      console.log('New student added:', data);
      // Clear input fields
      
      document.getElementById('studentId').value = '';
      document.getElementById('studentName').value = '';
      document.getElementById('studentClass').value = '';
      document.getElementById('studentDOB').value = '';
      document.getElementById('studentGender').value = '';
      document.getElementById('studentEmail').value = '';
      document.getElementById('studentPhone').value = '';
      // Refresh student table
      fetchStudents();
    })
    .catch(error => {
      console.error('Error adding student:', error);
    });

   
}


document.getElementById('deleteStudentForm').addEventListener('submit', function(event) {
  console.log('Hi');
  event.preventDefault(); // Prevent form submission

  var studentId = document.getElementById('studentIdFromForm').value;
  console.log(studentId);

  
fetch(`http://localhost:8080/deletestudents/${studentId}`, {

method: 'DELETE'
  })
    .then(response => response.json())
    .then(data => {
      console.log(data); // Log the response data
      alert('Student deleted successfully');
      document.getElementById('studentId').value = ''; // Clear the input field
      fetchStudents();
    })
    .catch(error => {
      console.error('Error:', error);
      alert('Failed to delete student');
    });
});

// Attach event listener to add student form submission
document.getElementById('addStudentForm').addEventListener('submit', addStudent);

// Fetch and display all students when the page loads
fetchStudents();
