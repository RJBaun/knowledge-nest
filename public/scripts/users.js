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
    renderUserPage('#section-registration-page', registrationPageMarkup);
  });
});

// On 'user-login' nav button click, load login page.
$(() => {
  $('#user-login').on('click', () => {
    renderUserPage('#section-login-page', loginPageMarkup);
  });
});

// On 'user-logout' nav button click, logout user (clear cookies) and redirect to main page.
$(() => {
  $('#user-logout').on('click', () => {
    $.ajax({
      method: 'GET',
      url: 'api/users/logout'
    })
      .done(() => {
        pageCleanup();
        location.reload();
      });
  });
});

// On 'user-profile' nav button click, load user profile page.
$(() => {
  $('#user-profile').on('click', () => {

    $.ajax({
      method: 'GET',
      url: 'api/users/id'
    })
      .done(response => {
        if (response === null) {
          console.log('user not logged in');
        } else {
          loadUserProfile(response.user);
        }
      });
  });
});

// ON 'My Resources' nav button click, load users owned and saved resources
$(() => {
  $('#user-resources').on('click', () => {
    $.ajax({
      method: 'GET',
      url: 'api/users/resources'
    })
      .done((data) => {
        pageCleanup();
        $('#section-user-resources').append(myResourcesShellMarkup());
        renderResources("#owned-resources-tab-pane", data.ownedResources);
        renderResources("#liked-resources-tab-pane", data.likedResources);
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
            loadUserProfile(response.user);
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
          $.ajax({
            method: 'GET',
            url: 'api/users/id'
          })
            .done(response => {
              loadUserProfile(response.user);
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
        renderUserPage('#section-user-profile', editUserProfileMarkup, response.user);
      });
  });
});

// From User Profile Page, on 'user-delete-button' click, redirect to delete user profile page.
$(() => {
  $('#section-user-profile').on('click', '#user-delete-button', () => {
    renderUserPage('#section-user-profile', deleteUserProfileMarkup);
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
        loadUserProfile(response.user);
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
        loadUserProfile(response.user);
      });
    event.preventDefault();
  });
});

// From Delete User Profile Page, on form submit, update user data and redirect to user profile.
$(() => {
  $('#section-user-profile').on('submit', '#delete-profile-form', (event) => {
    $.ajax({
      method: 'POST',
      url: 'api/users/id/delete'
    })
      .done(response => {
        location.reload();
      });
    event.preventDefault();
  });
});




///////////////////////////
/// HELPER FUNCTIONS
///////////////////////////

const loadUserProfile = (user) => {
  renderUserPage('#section-user-profile', userProfileMarkup, user);
};

const renderUserPage = (destination, markup, response) => {
  pageCleanup();
  $(markup(response)).appendTo(destination);
};

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
  <button id="register-button" type="submit" class="btn btn-success">Register</button>
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
    <label for="login-email" class="form-label">Email</label>
    <input type="email" name="email" class="form-control" id="login-email">
  </div>
  <div class="mb-3">
    <label for="login-password" class="form-label">Password</label>
    <input type="password" name="password" class="form-control" id="login-password">
  </div>
  <button id="login-button" type="submit" class="btn btn-success">Login</button>
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
  <section id="profile-data">
    <h3>Username:</h3>
    <p>${user.username}</p>
    <h3>Email:</h3>
    <p>${user.email}</p>
  </section>
  <div class="buttons">
    <button id="user-edit-button" type="button" class="btn btn-success">Edit</button>
    <button id="user-delete-button" type="button" class="btn btn-danger">Delete</button>
  </div>
  <footer>
  <i class="fa-brands fa-earlybirds"></i>
  </footer>
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
  <form id="delete-profile-form" method="POST">
  <div class="buttons">
  <h2>Are you sure you want to delete your account?</h2>
  <p>If you delete your account, you will <strong>immediately</strong> lose all your saved and liked resources.</p>
  <p>You will need to create a new account to sign in again.</p>
  <button id="delete-button" type="submit" class="btn btn-danger">Yes - DELETE</button>
  <button id="cancel-button" type="button" class="btn btn-success">Nevermind, I want to keep my account</button>
</div>
</form>
`;
  return deleteUserProfile;
};

/**
 * My Resources page shell HTML
 * @returns {string}
 */
const myResourcesShellMarkup = () => {
  const $myResourcesShell = $(`
  <h1>My Nest</h1>
  <section id="resource-file">
  <ul class="nav nav-tabs" id="myTab" role="tablist">
    <li class="nav-item" role="presentation">
      <button class="nav-link active" id="owned-resources-tab" data-bs-toggle="tab" data-bs-target="#owned-resources-tab-pane" type="button" role="tab" aria-controls="owned-resources-tab-pane" aria-selected="true">My Resources</button>
    </li>
    <li class="nav-item" role="presentation">
      <button class="nav-link" id="liked-resources-tab" data-bs-toggle="tab" data-bs-target="#liked-resources-tab-pane" type="button" role="tab" aria-controls="liked-resources-tab-pane" aria-selected="false">Liked Resources</button>
    </li>
  </ul>
  <section class="tab-content" id="myTabContent">
    <article class="tab-pane fade show active" id="owned-resources-tab-pane" role="tabpanel" aria-labelledby="home-tab" tabindex="0">
    </article>
    <article class="tab-pane fade" id="liked-resources-tab-pane" role="tabpanel" aria-labelledby="profile-tab" tabindex="0">
    </article>
  </section>
  <section>
  `);
  return $myResourcesShell;
};


