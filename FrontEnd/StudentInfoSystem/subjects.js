// Fetch subjects from the API
fetch('http://localhost:8080/')
  .then(response => response.json())
  .then(data => {
    const subjectsContainer = document.getElementById('subjects');
    console.log(data)
    // Create HTML elements to display subjects
    data.forEach(subject => {
      const subjectDiv = document.createElement('div');
      subjectDiv.classList.add('col-md-6', 'mb-4');
      subjectDiv.innerHTML = `
        <div class="card custom-card">
          <div class="card-body">
            <h2 class="card-title">${subject.subject_name}</h2>
            <p class="card-text">${subject.content}</p>
            <p class="card-text">Teachers: ${subject.teachers.join(', ')}</p>
          </div>
        </div>
      `;
      subjectsContainer.appendChild(subjectDiv);
    });
  });
