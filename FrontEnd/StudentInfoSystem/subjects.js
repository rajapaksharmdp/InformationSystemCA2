

// Function to fetch and display all subjects
function displayAllSubjects() {
    fetch('http://localhost:8080/')
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
  
  // Function to create HTML elements for a subject
  function createSubjectDiv(subject) {
    let subjectDiv = document.createElement('div');
    subjectDiv.classList.add('col-md-6', 'mb-4');
    subjectDiv.innerHTML = `
      <div class="card custom-card">
        <div class="card-body">
          <h2 class="card-title">${subject.subject_name}</h2>
          <h5 class="card-title">ID: ${subject.subject_id}</h5>
          <p class="card-text">${subject.content}</p>
          <h7 class="card-text">${getTopicsList(subject.topics)}</h7>
          <div class="card-teachers">Teachers: ${subject.teachers.join(', ')}</div>
        </div>
      </div>
    `;
    return subjectDiv;
  }
  
  // Function to fetch and display filtered subjects
  function filterSubjects() {
    // Get filter values from input boxes
    let subjectId = document.getElementById('subject-id').value;
    let subjectName = document.getElementById('subject-name').value;
    let teacherName = document.getElementById('teacher-name').value;
  
    // Build the query string
    let queryString = `subject_id=${subjectId}&subject_name=${subjectName}&teacher=${teacherName}`;
  
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
  
  // Attach event listener to filter button
  let filterBtn = document.getElementById('filter-btn');// Function to fetch and display all subjects
  function displayAllSubjects() {
    fetch('http://localhost:8080/')
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
          <div class="card-teachers">Teachers: ${subject.teachers && subject.teachers.length > 0 ? subject.teachers.join(', ') : 'N/A'}</div>
        </div>
      </div>
    `;
    return subjectDiv;
  }
  
  
  
  
// Function to fetch and display filtered subjects
function filterSubjects() {
    // Get filter values from input boxes
    const subjectId = document.getElementById('subject-id').value;
    const subjectName = document.getElementById('subject-name').value;
    const teacherName = document.getElementById('teacher-name').value;
  
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
        const subjectsContainer = document.getElementById('subjects');
        subjectsContainer.innerHTML = '';
  
        // Create HTML elements to display filtered subjects
        data.forEach(subject => {
          const subjectDiv = createSubjectDiv(subject);
          subjectsContainer.appendChild(subjectDiv);
        });
      });
  }
  
  

// Attach event listener to filter button when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  filterBtn = document.getElementById('filter-btn');
  filterBtn.addEventListener('click', filterSubjects);
});

  
  
  // Display all subjects when the page loads
  document.addEventListener('DOMContentLoaded', displayAllSubjects);
  
  filterBtn.addEventListener('click', filterSubjects);
  
  // Display all subjects when the page loads
  document.addEventListener('DOMContentLoaded', displayAllSubjects);
  

// Save subject button click event
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
