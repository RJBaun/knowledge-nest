// Created by Victoria Lane
// Created March 12, 2024
// Purpose: Fetch user data and load user-related page sections.



//////////////////////
/// LISTENERS
//////////////////////

// On "Fetch Users" button click, all users are loaded
$(() => {
  $('#fetch-users').on('click', () => {
    $.ajax({
      method: 'GET',
      url: '/api/users'
    })
      .done((response) => {
        const $usersList = $('#users');
        $usersList.empty();

        for (const user of response.users) {
          $(`<li class="user">`).text(user.username).appendTo($usersList);
        }
      });
  });
});


// On 'user-registration' nav button click, load registration page.

$('#user-register').on('click', () => {
  // COLLAPSE nav bar
  // EMPTY all sections
  $('#example-stuff').empty();
  $(registrationPageMarkup()).appendTo('#section-registration-page');
});

// On 'user-login' nav button click, load login page.
$('#user-login').on('click', () => {
  // COLLAPSE nav bar
  // EMPTY all sections
  $('#example-stuff').empty();
  $(loginPageMarkup()).appendTo('#section-login-page');
});

// On 'user-logout' nav button click, logout user (clear cookies) and redirect to main page.
$('#user-logout').on('click', () => {
  // clear cookies
});








///////////////////////////
/// HTML FUNCTIONS
///////////////////////////

/**
 * Registration page HTML
 * @returns {string}
 */
const registrationPageMarkup = () => {
  const registrationPage = `<form>
  <h2> Register </h2>
  <div class="mb-3">
    <label for="username" class="form-label">Username</label>
    <input type="text" class="form-control" id="username">
  </div>
  <div class="mb-3">
    <label for="email" class="form-label">Email</label>
    <input type="email" class="form-control" id="email">
  </div>
  <div class="mb-3">
    <label for="password" class="form-label">Password</label>
    <input type="password" class="form-control" id="password">
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
