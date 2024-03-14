


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

// Placeholder until markup is updated - will 'load' homepage on nav bar logo click
$(() => {
  $('.navbar-brand').on('click', function() {
    $.ajax({
      method: 'GET',
      url: 'api/resources/recent',
    })
      .done((response) => {
        pageCleanup();
        renderResources(response);
        $('#all-resources').prepend($('<h1>Check Out Whats New</h1>'));
      })
      .catch((err) => {
        console.log('err:', err);
      });
  });
});

$(() => {
  $(document).ready(function() {
    $.ajax({
      method: 'GET',
      url: 'api/resources/recent',
    })
      .done((response) => {
        pageCleanup();
        renderResources(response);
        $('#all-resources').prepend($('<h1>Check Out Whats New</h1>'));
      })
      .catch((err) => {
        console.log('err:', err);
      });
  });
});


