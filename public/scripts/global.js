// Created by Victoria Lane
// Created March 12, 2024
// Purpose: General helper functions


const pageCleanup = () => {
  $("#navbarTogglerDemo02").collapse('hide');

  // empty all sections on index.html
  $("#all-resources").empty();
  $("#recent-resources").empty();
  $('#section-registration-page').empty();
  $('#section-login-page').empty();
  $('#section-user-resources').empty();
  $('#section-add-new-resource').empty();
  $('#section-user-profile').empty();
  $('#section-single-resource').empty();
  $('#section-edit-resource').empty();
  $('#section-delete-resource').empty();

  // check if user is logged in, update nav bar
  $.ajax({
    method: 'GET',
    url: 'api/users/active'
  })
    .done((response) => {
      if (response) {
        $('.nav-user-only').removeClass('hidden');
        $('.nav-no-user-only').addClass('hidden');
      }
      if (!response) {
        $('.nav-user-only').addClass('hidden');
        $('.nav-no-user-only').removeClass('hidden');
      }
    });
};

