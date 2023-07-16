document.getElementById('loginBtn').addEventListener('click', () => {
    let username = document.getElementById('username_Input').value;
    let password = document.getElementById('password_Input').value;
  
    let loginData = {
      username: username,
      password: password,
    };
  
    fetch('http://localhost:8080/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData),
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        if (data.message === 'Login successful') {
          console.log("hari");
          window.location.href = 'subjects.html'; // Redirect to subjects.html on successful login
        } else {
          console.log('Login failed:', data.message);
          // Handle the failed login case here
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
});

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('registerBtnModal').addEventListener('click', () => {

      let fullname = document.getElementById('nameInput').value;
      let username = document.getElementById('usernameInput').value;
      let email = document.getElementById('emailInput').value;
      let role = document.getElementById('roleInput').value;
      let password = document.getElementById('passwordInput').value;
  

      // Check if required fields are empty
      if (username.trim() === '' || password.trim() === '') {
        console.log('Username and password are required.');
        console.log(username);
        console.log(password);
        return;
      }
  
      let registrationData = {
        fullname: fullname,
        username: username,
        email: email,
        role: role,
        password: password,
      };
  
      console.log(registrationData);
  
      fetch('http://localhost:8080/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationData),
      })
        .then(response => response.json())
        .then(data => {
          // Check if registration was successful
          if (data.message === 'Registration successful'){
            console.log('Registration successful');
            let successMessage = document.createElement('div');
            successMessage.classList.add('alert', 'alert-success');
            successMessage.textContent = 'Registration successful! You can now log in.';
            let modalBody = document.querySelector('#registrationModal .modal-body');
            modalBody.appendChild(successMessage);
        setTimeout(() => {
          let registrationModal = new bootstrap.Modal(document.getElementById('registrationModal'));
          registrationModal.hide();
        }, 2000);
          } else {
            console.log('Registration failed:', data.message);
    
          }
        })
        .catch(error => {
          console.error('Error:', error);
        });
    });
  });
  