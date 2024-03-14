


const pageCleanup = () => {
  $("#navbarTogglerDemo02").collapse('hide')

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

  // check if user is logged in
  $.ajax({
    method: 'GET',
    url: 'api/users/active'
  })
  .done((response) => {
    console.log('userid?', response);

    if(response) {
      console.log('user logged in');
      $('.nav-user-only').removeClass('hidden')
      $('.nav-no-user-only').addClass('hidden')

    }
    if(!response) {
      console.log('user NOT logged in');
      $('.nav-user-only').addClass('hidden')
      $('.nav-no-user-only').removeClass('hidden')
    }

  })
};

