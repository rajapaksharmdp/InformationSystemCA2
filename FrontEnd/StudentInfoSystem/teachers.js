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


          let line = document.createElement('p');

          // Add update button for each teacher
          let updateButton = document.createElement('button');
          updateButton.textContent = 'Update';
          updateButton.className = 'btn btn-primary btn-sm ml-2';
          updateButton.addEventListener('click', () => updateTeacher(teacher));

          let deleteButton = document.createElement('button');
          deleteButton.textContent = 'Delete';
          deleteButton.className = 'btn btn-danger btn-sm ml-2';
          deleteButton.addEventListener('click', () => handleDelete(teacher));


          listItem.appendChild(line);
          listItem.appendChild(updateButton);
          listItem.appendChild(deleteButton);


          teachersList.appendChild(listItem);
        });
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }

  function handleDelete(teacher) {
    // Ask for user confirmation before deleting the teacher
    let confirmDelete = window.confirm(`Are you sure you want to delete Teacher with ID: ${teacher.teacher_id}?`);

    if (confirmDelete) {
      console.log(`Delete Teacher with ID: ${teacher.teacher_id}`);

      // Send a DELETE request to the server to delete the teacher
      fetch(`http://localhost:8080/delete_teachers/${teacher.teacher_id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(response => {
          if (response.ok) {
            console.log(`Teacher with ID ${teacher.teacher_id} deleted successfully.`);
            // Fetch the updated teachers list and update the UI
            fetchTeachers();
          } else {
            console.error('Failed to delete the teacher.');
          }
        })
        .catch(error => {
          console.error('Error:', error);
        });
    } else {
      console.log('Teacher deletion cancelled by the user.');
    }
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

  // Add event listener for adding a new teacher
  document.getElementById('addTeacherForm').addEventListener('submit', addTeacher);

  function updateTeacher(teacher) {
    document.getElementById('update_teacher_id').value = teacher.teacher_id;
    document.getElementById('update_name').value = teacher.name;
    document.getElementById('update_email').value = teacher.email;
    document.getElementById('update_phone_no').value = teacher.phone_no;
    document.getElementById('update_address').value = teacher.address;

    // Hide the addTeacherForm and show the updateTeacherForm
    document.getElementById('addTeacherForm').style.display = 'none';
    document.getElementById('updateTeacherForm').style.display = 'block';
  }

    // Get the updated values from the form
    let teacherId = document.getElementById('teacher_id').value;
    let name = document.getElementById('update_name').value;
    let email = document.getElementById('update_email').value;
    let phoneNo = document.getElementById('update_phone_no').value;
    let address = document.getElementById('update_address').value;

    teacherId = parseInt(teacherId);

    // Create an object with the updated teacher information
    let newTeacher = {
        teacher_id: parseInt(teacherId),
        name,
        email,
        phone_no: phoneNo,
        address,
      };



document.addEventListener('DOMContentLoaded', () => {
    // Fetch and display teachers list on page load
    fetchTeachers();

    // Add event listener for adding a new teacher
    document.getElementById('addTeacherForm').addEventListener('submit', addTeacher);

    // Add event listener for updating a teacher
    document.getElementById('updateTeacherForm').addEventListener('submit', (event) => {
      event.preventDefault();

      // Get the updated values from the form
      let teacherId = document.getElementById('update_teacher_id').value;
      let name = document.getElementById('update_name').value;
      let email = document.getElementById('update_email').value;
      let phoneNo = document.getElementById('update_phone_no').value;
      let address = document.getElementById('update_address').value;


       teacherId = parseInt(teacherId);
      // Create an object with the updated teacher information
      let updatedTeacher = {
        teacherId,
        name,
        email,
        phone_no: phoneNo,
        address,
      };

      // Make the API call to update the teacher
      fetch(`http://localhost:8080/update_teachers/${teacherId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTeacher),
      })
        .then(response => response.json())
        .then(data => {
          console.log('Teacher updated successfully:', data);
          // Fetch the updated teachers list and update the UI
          fetchTeachers();
          cancelUpdate(); // Show addTeacherForm after successful update
        })
        .catch(error => {
          console.error('Error:', error);
        });

      // Reset the updateTeacherForm
      document.getElementById('updateTeacherForm').reset();
    });

    // Add event listener for canceling the update operation
    document.getElementById('cancelUpdateBtn').addEventListener('click', cancelUpdate);
  });