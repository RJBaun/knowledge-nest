// Client facing scripts here

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
$(() => {
  $('#user-register').on('click', () => {
    // COLLAPSE nav bar
    // EMPTY all sections
    $('#example-stuff').empty();
    $(registrationPageMarkup()).appendTo('#section-registration-page');
  });
});





///////////////////////////
/// HTML Functions
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
  <button id="register" type="submit" class="btn btn-primary">Register</button>
</form>`;
  return registrationPage;
};
