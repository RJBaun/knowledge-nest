// Created by Victoria Lane
// Created March 12, 2024
// Purpose: Fetch user data and load user-related page sections.

//////////////////////
/// LISTENERS
//////////////////////




// On 'user-registration' nav button click, load registration page.
$(() => {
  $('#user-register').on('click', () => {
    // COLLAPSE nav bar
    // EMPTY all sections
    pageCleanup();
    $(registrationPageMarkup()).appendTo('#section-registration-page');
  });
});

// On 'user-login' nav button click, load login page.
$(() => {
  $('#user-login').on('click', () => {
    // COLLAPSE nav bar
    // EMPTY all sections
    pageCleanup();
    $(loginPageMarkup()).appendTo('#section-login-page');
  });
});

// On 'user-logout' nav button click, logout user (clear cookies) and redirect to main page.
$(() => {
  $('#user-logout').on('click', () => {
    clearAllMainSections();
    // clear cookies
  });
});


// From Registration Page, on 'register-button' click, save new user data to users table. Redirect to user resources page.
$(() => {
  $('#section-registration-page').on('submit', function(event) {
    const userData = {
      username: $('#register-username').val(),
      email: $('#register-email').val(),
      password: $('#register-password').val()
    };
    $.ajax({
      method: 'POST',
      url: '/api/users',
      data: userData
    })
    .done((response) => {
      const id = response.user.id;
      // LOAD user resources page for signed-in-user
    });


    event.preventDefault();
  });
});



// // From Login Page, on 'login-button' click, log in user. Redirect to user resources page.
// $(() => {
//   $('#login-button').on('click', () => {
//     $.ajax({
//       method: 'POST',
//       url: '/api/users/login'
//     })
//       .done((response) => {
//         // SAVE COOKIE userid
//         // EMPTY all sections
//         // LOAD user profile page for signed-in-user
//       });
//   });
// });



///////////////////////////
/// HTML FUNCTIONS
///////////////////////////

/**
 * Registration page HTML
 * @returns {string}
 */
const registrationPageMarkup = () => {
  const registrationPage = `<form id="registration-form" method="POST">
  <h2> Hello </h2>
  <div class="mb-3">
    <label for="register-username" class="form-label">Username</label>
    <input type="text" name="username" class="form-control" id="register-username">
  </div>
  <div class="mb-3">
    <label for="register-email" class="form-label">Email</label>
    <input type="email" name="email" class="form-control" id="register-email">
  </div>
  <div class="mb-3">
    <label for="register-password" class="form-label">Password</label>
    <input type="password" name="password" class="form-control" id="register-password">
  </div>
  <button id="register-button" type="submit" class="btn btn-primary">Register</button>
</form>`;
  return registrationPage;
};

/**
 * Login page HTML
 * @returns {string}
 */
const loginPageMarkup = () => {
  const loginPage = `<form>
  <h2> Login </h2>
  <div class="mb-3">
    <label for="email" class="form-label">Email</label>
    <input type="email" class="form-control" id="email">
  </div>
  <div class="mb-3">
    <label for="password" class="form-label">Password</label>
    <input type="password" class="form-control" id="password">
  </div>
  <button id="login-button" type="submit" class="btn btn-primary">Login</button>
</form>`;
  return loginPage;
};





// CLEAR ALL SECTIONS

const pageCleanup = () => {
  $("#navbarTogglerDemo02").collapse('hide')

  $("#all-resources").empty();
  $("#recent-resources").empty();
  $('#section-registration-page').empty();
  $('#section-login-page').empty();
  $('#section-user-resources').empty();
  $('#section-add-new-resource').empty();
  $('#section-user-profile').empty();
};
