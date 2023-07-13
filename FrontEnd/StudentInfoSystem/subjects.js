// Function to fetch and display all subjects
function displayAllSubjects() {
    let sortBy = document.getElementById('sort-by').value;
    let sortOrder = document.getElementById('sort-order').value;
   
    let queryString = `?sort_by=${sortBy}&sort_order=${sortOrder}`;

    // Fetch subjects from the API with sorting options
    fetch(`http://localhost:8080/${queryString}`)
      .then(response => response.json())
      .then(data => {
        let subjectsContainer = document.getElementById('subjects');
        subjectsContainer.innerHTML = '';
  
        // Create HTML elements to display subjects
        data.forEach(subject => {
          let subjectDiv = createSubjectDiv(subject);
          subjectsContainer.appendChild(subjectDiv);
        });
      });
  }
  
  // Function to fetch and display filtered subjects
  function filterSubjects() {
    // Get filter values from input boxes
    let subjectId = document.getElementById('subject-id').value;
    let subjectName = document.getElementById('subject-name').value;
    let teacherName = document.getElementById('teacher-name').value;
  
    // Build the query string
    let queryString = '';
    if (subjectId !== '') {
      queryString += `subject_id=${subjectId}&`;
    }
    if (subjectName !== '') {
      queryString += `subject_name=${subjectName}&`;
    }
    if (teacherName !== '') {
      queryString += `teacher=${teacherName}`;
    }
  
    // Fetch filtered subjects from the API
    fetch(`http://localhost:8080/filter_subjects?${queryString}`)
      .then(response => response.json())
      .then(data => {
        let subjectsContainer = document.getElementById('subjects');
        subjectsContainer.innerHTML = '';
  
        // Create HTML elements to display filtered subjects
        data.forEach(subject => {
          let subjectDiv = createSubjectDiv(subject);
          subjectsContainer.appendChild(subjectDiv);
        });
      });
  }
  
  // Function to create subject div
  function createSubjectDiv(subject) {
    var subjectDiv = document.createElement('div');
    subjectDiv.classList.add('col-md-6', 'mb-4');
    subjectDiv.innerHTML = `
      <div class="card custom-card">
        <div class="card-body">
          <h2 class="card-title">${subject.subject_name}</h2>
          <h5 class="card-title">${subject.subject_id}</h5>
          <p class="card-text">${subject.content}</p>
          <h7 class="card-text">${getTopicsList(subject.topics)}</h7>
          <div class="card-teachers">Teachers: ${
            subject.teachers && subject.teachers.length > 0 ? subject.teachers.join(', ') : 'N/A'
          }</div>
          <div class="card-buttons">
            <button class="btn btn-primary update-button" data-subject-id="${subject.subject_id}">Update</button>
            <button class="btn btn-danger delete-button" data-subject-id="${subject.subject_id}">Delete</button>
          </div>
        </div>
      </div>
    `;
  
    let deleteButton = subjectDiv.querySelector('.delete-button');
    deleteButton.addEventListener('click', () => {
      confirmDeleteSubject(subject.subject_id);
    });
  
    // Create the update button
    let updateButton = subjectDiv.querySelector('.update-button');
    updateButton.addEventListener('click', () => openUpdateModal(subject));
  
    return subjectDiv;
  }
  
  // Function to get the topics list with numbers
  function getTopicsList(topics) {
    let topicsList = '';
    topics.forEach((topic, index) => {
      topicsList += `
        <div class="row">
          <div class="topics">${index + 1}.</div>
          <div class="topics">${topic}</div>
        </div>
      `;
    });
    return topicsList;
  }
  
  // Function to confirm subject deletion
  function confirmDeleteSubject(subjectId) {
    if (confirm('Are you sure you want to delete this subject?')) {
      deleteSubject(subjectId);
    }
  }
  
  // Function to delete subject
  function deleteSubject(subjectId) {
    fetch(`http://localhost:8080/delete_subject/${subjectId}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Error deleting subject');
        }
        // Subject deleted successfully, display success notification
        alert('Subject successfully deleted!');
        // Fetch and display all subjects to update the subject list
        displayAllSubjects();
      })
      .catch(error => {
        console.error('Error:', error);
        // Display error notification
        alert('An error occurred. Please try again.');
      });
  }
  
  // Function to open update modal
  function openUpdateModal(subject) {
    // Populate the form fields with subject data
    document.getElementById('updateSubjectIdInput').value = subject.subject_id;
    document.getElementById('updateSubjectNameInput').value = subject.subject_name;
    document.getElementById('updateContentInput').value = subject.content;
    document.getElementById('updateTopicsInput').value = subject.topics.join(',');
    document.getElementById('updateTeachersInput').value = subject.teachers.join(',');
  
    // Open the update modal
    let updateModal = new bootstrap.Modal(document.getElementById('updateModal'));
    updateModal.show();
  }
  
  // Function to update subject
  function updateSubject() {
    // Get the updated subject data from the form inputs
    let subjectId = document.getElementById('updateSubjectIdInput').value;
    let subjectName = document.getElementById('updateSubjectNameInput').value;
    let content = document.getElementById('updateContentInput').value;
    let topics = document.getElementById('updateTopicsInput').value.split(',');
    let teachers = document.getElementById('updateTeachersInput').value.split(',');
  
    // Create the updated subject object
    let updatedSubject = {
      subject_name: subjectName,
      content: content,
      topics: topics,
      teachers: teachers,
    };
  
    // Send the updated subject data to the backend API
    fetch(`http://localhost:8080/update_subject/${subjectId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedSubject),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Error updating subject');
        }
        return response.json();
      })
      .then(data => {
        // Display success notification
        alert('Subject successfully updated!');
        // Close the update modal
        let updateModal = new bootstrap.Modal(document.getElementById('updateModal'));
        updateModal.hide();
        // Fetch and display all subjects to update the subject list
        displayAllSubjects();
      })
      .catch(error => {
        console.error('Error:', error);
        // Display error notification
        alert('An error occurred. Please try again.');
      });
  }
  
  // Attach event listener to filter button when DOM is loaded
  document.addEventListener('DOMContentLoaded', () => {
    let filterBtn = document.getElementById('filter-btn');
    filterBtn.addEventListener('click', filterSubjects);
  });
  
  // Attach event listener to save subject button
  let saveSubjectBtn = document.getElementById('saveSubjectBtn');
  saveSubjectBtn.addEventListener('click', () => {
    // Get subject data from form inputs
    let subjectId = document.getElementById('subjectIdInput').value;
    let subjectName = document.getElementById('subjectNameInput').value;
    let content = document.getElementById('contentInput').value;
    let topics = document.getElementById('topicsInput').value.split(',');
    let teachers = document.getElementById('teachersInput').value.split(',');
  
    // Create subject object
    let newSubject = {
      subject_id: subjectId,
      subject_name: subjectName,
      content: content,
      topics: topics,
      teachers: teachers,
    };
  
    // Send subject data to the backend API
    fetch('http://localhost:8080/add_subject', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newSubject),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Error creating subject');
        }
        return response.json();
      })
      .then(data => {
        // Display success notification
        alert('Subject successfully added!');
        // Reset the form inputs
        document.getElementById('subjectIdInput').value = '';
        document.getElementById('subjectNameInput').value = '';
        document.getElementById('contentInput').value = '';
        document.getElementById('topicsInput').value = '';
        document.getElementById('teachersInput').value = '';
        // Close the modal
        let subjectModal = new bootstrap.Modal(document.getElementById('subjectModal'));
        subjectModal.hide();
        // Fetch and display all subjects to update the subject list
        displayAllSubjects();
      })
      .catch(error => {
        console.error('Error:', error);
        // Display error notification
        alert('An error occurred. Please try again.');
      });
  });
  
  // Attach event listener to update subject button
  let updateSubjectBtn = document.getElementById('updateSubjectBtn');
  updateSubjectBtn.addEventListener('click', updateSubject);
  
  // Display all subjects when the page loads
  document.addEventListener('DOMContentLoaded', displayAllSubjects);
  