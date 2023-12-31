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
        // Check the user's role and redirect accordingly
        if (data.role === 'admin') {
          window.location.href = 'subjects.html';
        } else if (data.role === 'teacher') {
          window.location.href = 'grades.html'; 
        } else {
          console.log('Unknown role:', data.role);
        }
      } else {
        console.log('Login failed:', data.message);
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
        alert('Username and password are required.');
        return;
      }
  
      let emailRegex = /^\S+@\S+\.\S+$/;
      if (!emailRegex.test(email)) {
        alert('Invalid email format.');
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
          if(error){
            error.classList.add('alert', 'alert-error');
            successMessage.textContent = 'Registration successful! You can now log in.';
          }

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

    
  document.getElementById('showPassword').addEventListener('change', () => {
    let passwordInput = document.getElementById('passwordInput');
    if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
    } else {
      passwordInput.type = 'password';
    }
  });

});
  