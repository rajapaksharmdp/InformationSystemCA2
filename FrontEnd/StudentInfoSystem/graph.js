// graph.js
document.addEventListener('DOMContentLoaded', () => {
    // Function to fetch grades data from the backend API
    function fetchGradesData() {
      fetch('http://localhost:8080/getgrades')
        .then(response => response.json())
        .then(data => {
          processData(data);
        })
        .catch(error => {
          console.error('Error fetching grades data:', error);
        });
    }
  
    // Function to process grades data and create the graph
    function processData(gradesData) {
      let subjects = ['Math', 'English', 'Chemistry'];
  
      subjects.forEach(subject => {
        let subjectGrades = gradesData.filter(grade => grade.subject_id === subject);
        let marks = Array.from({ length: 5 }, () => 0); // Initialize range frequency array
  
        subjectGrades.forEach(grade => {
          let mark = grade.mark;
          if (mark >= 75 && mark < 80) {
            marks[0]++;
          } else if (mark >= 80 && mark < 85) {
            marks[1]++;
          } else if (mark >= 85 && mark < 90) {
            marks[2]++;
          } else if (mark >= 90 && mark < 95) {
            marks[3]++;
          } else if (mark >= 95 && mark <= 100) {
            marks[4]++;
          }
        });
  
        // Create the graph using Chart.js for the subject
        let ctx = document.getElementById(`${subject.toLowerCase()}GradesGraph`).getContext('2d');
        new Chart(ctx, {
          type: 'bar',
          data: {
            labels: ['75-79', '80-84', '85-89', '90-94', '95-100'],
            datasets: [{
              label: `Number of Students - ${subject}`,
              data: marks,
              backgroundColor: 'rgba(54, 162, 235, 0.6)',
            }]
          },
          options: {
            scales: {
              x: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: 'Marks Range',
                }
              },
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: 'Number of Students',
                }
              }
            }
          }
        });
      });
    }
  
    // Fetch and display grades data on page load
    fetchGradesData();
  });
  