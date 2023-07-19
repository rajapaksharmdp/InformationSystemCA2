// Function to fetch teachers list from the server
function fetchTeachers() {
    fetch('http://localhost:8080/getteachers')
      .then(response => response.json())
      .then(data => {
        let teachersList = document.getElementById('teachersList');
        teachersList.innerHTML = '';
  
        data.forEach(teacher => {
          let listItem = document.createElement('li');
          listItem.className = 'list-group-item';
          listItem.textContent = `ID: ${teacher.teacher_id}, Name: ${teacher.name}, Email: ${teacher.email}, Phone: ${teacher.phone_no}, Address: ${teacher.address}`;
          teachersList.appendChild(listItem);
        });
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }
  
  // Function to add a new teacher
  function addTeacher(event) {
    event.preventDefault();
    let teacherId = document.getElementById('teacher_id').value;
    let name = document.getElementById('name').value;
    let email = document.getElementById('email').value;
    let phoneNo = document.getElementById('phone_no').value;
    let address = document.getElementById('address').value;
  
    let newTeacher = {
      teacher_id: parseInt(teacherId),
      name,
      email,
      phone_no: phoneNo,
      address,
    };
  
    fetch('http://localhost:8080/addteachers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newTeacher),
    })
      .then(response => response.json())
      .then(data => {
        fetchTeachers();
      })
      .catch(error => {
        console.error('Error:', error);
      });
  
    document.getElementById('addTeacherForm').reset();
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    // Fetch and display teachers list on page load
    fetchTeachers();
  
    // Add event listener for adding a new teacher
    document.getElementById('addTeacherForm').addEventListener('submit', addTeacher);
  });

// Function to update a teacher
function updateTeacher(event) {
  event.preventDefault();
  let teacherId = document.getElementById('teacher_id').value;
  let name = document.getElementById('name').value;
  let email = document.getElementById('email').value;
  let phoneNo = document.getElementById('phone_no').value;
  let address = document.getElementById('address').value;

  let updatedTeacher = {
    teacher_id: parseInt(teacherId),
    name,
    email,
    phone_no: phoneNo,
    address,
  };

  fetch(`http://localhost:8080/update_teachers/${teacherId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedTeacher),
  })
    .then(response => response.json())
    .then(data => {
      fetchTeachers();
    })
    .catch(error => {
      console.error('Error:', error);
    });

  document.getElementById('addTeacherForm').reset();
}

document.addEventListener('DOMContentLoaded', () => {
  // Fetch and display teachers list on page load
  fetchTeachers();

  // Add event listener for adding a new teacher
  document.getElementById('addTeacherForm').addEventListener('submit', addTeacher);

  // Add event listener for updating a teacher
  document.getElementById('updateTeacherForm').addEventListener('submit', updateTeacher);
});

