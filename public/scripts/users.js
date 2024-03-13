// Created by Victoria Lane
// Created March 12, 2024
// Purpose: Fetch user data and load user-related page sections.

//////////////////////
/// LISTENERS
//////////////////////

////////////////////
// Nav Bar Buttons
///////////////////

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
    // pageCleanup();
    $.ajax({
      method: 'GET',
      url: 'api/users/logout'
    })
      .done(() => {
        pageCleanup();
      });
  });
});

// On 'user-profile' nav button click, load user profile page.
$(() => {
  $('#user-profile').on('click', () => {
    pageCleanup();

    $.ajax({
      method: 'GET',
      url: 'api/users/id'
    })
      .done(response => {
        if (response === null) {
          console.log('user not logged in');
        } else {
          $(userProfileMarkup(response.user)).appendTo('#section-user-profile');
        }
      });
  });
});


///////////////////////
// Registration Page
//////////////////////

// From Registration Page, on 'register-button' click, save new user data to users table. Redirect to user resources page.
$(() => {
  $('#section-registration-page').on('submit', (event) => {
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
      .done(() => {
        $.ajax({
          method: 'GET',
          url: 'api/users/id'
        })
          .done(response => {
            pageCleanup();
            $(userProfileMarkup(response.user)).appendTo('#section-user-profile');
          });
      });


    event.preventDefault();
  });
});

////////////////////
// Login Page
///////////////////

// From Login Page, on 'login-button' click, log in user. Redirect to user resources page.
$(() => {
  $('#section-login-page').on('submit', (event) => {
    const userData = {
      email: $('#login-email').val(),
      password: $('#login-password').val()
    };
    $.ajax({
      method: 'POST',
      url: '/api/users/login',
      data: userData
    })
      .done((response) => {
        if (response === null) {
          console.log('password incorrect');
        } else if (response === 'email') {
          console.log('email does not exist');
        } else {
          console.log('logged in', response);

          $.ajax({
            method: 'GET',
            url: 'api/users/id'
          })
            .done(response => {
              pageCleanup();
              $(userProfileMarkup(response.user)).appendTo('#section-user-profile');
            });
        }
      });
    event.preventDefault();
  });
});


//////////////////////
// User Profile Page
//   - Edit Page
//   - Delete Page
/////////////////////

// From User Profile Page, on 'user-update-button' click, redirect to edit user profile page.
$(() => {
  $('#section-user-profile').on('click', '#user-edit-button', () => {
    $.ajax({
      method: 'GET',
      url: 'api/users/id'
    })
      .done(response => {
        pageCleanup();
        $(editUserProfileMarkup(response.user)).appendTo('#section-user-profile');
      });
  });
});

// From User Profile Page, on 'user-delete-button' click, redirect to delete user profile page.
$(() => {
  $('#section-user-profile').on('click', '#user-delete-button', () => {
    pageCleanup();
    $(deleteUserProfileMarkup()).appendTo('#section-user-profile');
  });
});

// From User Profile Page (Edit and Delete Pages), on 'cancel-button' click, redirect to user profile page.
$(() => {
  $('#section-user-profile').on('click', '#cancel-button', () => {
    $.ajax({
      method: 'GET',
      url: 'api/users/id'
    })
      .done(response => {
        pageCleanup();
        $(userProfileMarkup(response.user)).appendTo('#section-user-profile');
      });
  });
});

// From Edit User Profile Page, on form submit, update user data and redirect to user profile.
$(() => {
  $('#section-user-profile').on('submit', '#update-profile-form', (event) => {
    const userData = {
      email: $('#updated-email').val(),
      username: $('#updated-username').val()
    };
    $.ajax({
      method: 'POST',
      url: 'api/users/id/edit',
      data: userData
    })
      .done(response => {
        pageCleanup();
        $(userProfileMarkup(response.user)).appendTo('#section-user-profile');
      });
    event.preventDefault();
  });
});


///////////////////////////
/// HTML FUNCTIONS
///////////////////////////

/**
 * Registration page HTML
 * @returns {string}
 */
const registrationPageMarkup = () => {
  const registrationPage = `<form id="registration-form" method="POST">
  <h2> Registration </h2>
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
  const loginPage = `<form id="login-form" method="POST">
  <h2> Login </h2>
  <div class="mb-3">
    <label for="email" class="form-label">Email</label>
    <input type="email" name="email" class="form-control" id="login-email">
  </div>
  <div class="mb-3">
    <label for="password" class="form-label">Password</label>
    <input type="password" name="password" class="form-control" id="login-password">
  </div>
  <button id="login-button" type="submit" class="btn btn-primary">Login</button>
</form>`;
  return loginPage;
};

/**
 * User profile page HTML
 * @param {{}} user
 * @returns {string}
 */
const userProfileMarkup = (user) => {
  const userProfile = `
  <h2>Profile</h2>
  <div class="mb-3 row">
    <label for="static-username" class="col-sm-2 col-form-label">Username:</label>
    <div class="col-sm-10">
      <input type="text" readonly class="form-control-plaintext" id="static-username" value="${user.username}">
    </div>
  <div class="mb-3 row">
    <label for="static-email" class="col-sm-2 col-form-label">Email:</label>
    <div class="col-sm-10">
      <input type="text" readonly class="form-control-plaintext" id="static-email" value="${user.email}">
    </div>
  </div>
  <div class="buttons">
    <button id="user-edit-button" type="button" class="btn btn-success">Edit</button>
    <button id="user-delete-button" type="button" class="btn btn-danger">Delete</button>
  </div>
  `;
  return userProfile;
};

/**
 * Edit user profile page HTML
 * @param {{}} user
 * @returns {string}
 */
const editUserProfileMarkup = (user) => {
  const editUserProfile = `
  <form id="update-profile-form" method="POST">
<h2>Update Profile</h2>
<div class="mb-3 row">
  <label for="updated-username" class="col-sm-2 col-form-label">Username:</label>
  <div class="col-sm-10">
    <input type="text" class="form-control" id="updated-username" value="${user.username}">
  </div>
<div class="mb-3 row">
  <label for="updated-email" class="col-sm-2 col-form-label">Email:</label>
  <div class="col-sm-10">
    <input type="email" class="form-control" id="updated-email" value="${user.email}">
  </div>
</div>
<div class="buttons">
  <button id="update-button" type="submit" class="btn btn-success">Update</button>
  <button id="cancel-button" type="button" class="btn btn-danger">Cancel</button>
</div>
</form>
`;
  return editUserProfile;
};

/**
 * Delete user profile page HTML
 * @returns {string}
 */
const deleteUserProfileMarkup = () => {
  const deleteUserProfile = `
  <div class="buttons">
  <h2>Are you sure you want to delete your account?</h2>
  <p>If you delete your account, you will <strong>immediately</strong> lose all your saved and liked resources.</p>
  <p>You will need to create a new account to sign in again.</p>
  <button id="delete-button" type="button" class="btn btn-danger">Yes - DELETE</button>
  <button id="cancel-button" type="button" class="btn btn-success">Nevermind, I want to keep my account</button>
</div>
`;
  return deleteUserProfile;
};





// CLEAR ALL SECTIONS
const pageCleanup = () => {
  $("#navbarTogglerDemo02").collapse('hide');

  $("#all-resources").empty();
  $("#recent-resources").empty();
  $('#section-registration-page').empty();
  $('#section-login-page').empty();
  $('#section-user-resources').empty();
  $('#section-add-new-resource').empty();
  $('#section-user-profile').empty();
};
