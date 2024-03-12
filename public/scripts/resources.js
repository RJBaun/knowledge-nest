// Created by Rylan Baun
// Created March 11, 2024
// Purpose: Render all resources

// Collapses NavBar when called
const collapseNavBar = () => {
  $("#navbarTogglerDemo02").collapse('hide');
};

// clear all sections in main container
const emptyMain = () => {
  $("#all-resources").empty();
  $("#recent-resources").empty();
};

// generates resource card and returns it given a resource object
const createResourceMarkup = (resource) => {
  const $resource = $(`
  <article class="card" style="width: 90vw;">
  <i class=${resource.icon_link}></i>
  <section class="card-body">
    <h5 class="card-title">${resource.name}</h5>
    <p class="card-text">${resource.description}</p>
    <a href="${resource.url}" class="btn btn-primary">Visit Resource</a>
    <footer class="resource-footer">
      <span class="resource-category">#${resource.category_name}</span>
      <span class="resource-likes-and-ratings">${resource.count_likes} Likes ${resource.avg_rating}/5.0 Stars</span>
    </footer>
  </section>
</article>
  `);
  return $resource;
}

// renders all resources on the webpage
const renderResources = (response) => {
  response.resources.forEach (resource => {
    $("#all-resources").prepend(createResourceMarkup(resource));
  })
};

// listener for "View all resources"
$(() => {
  $('#get-all-resources').on('click', () => {
    $.ajax({
      method: 'GET',
      url: '/api/resources'
    })
    .done((response) => {
      collapseNavBar();
      emptyMain();
      renderResources(response);
    })
    .catch((err) => {
      console.log('err:', err);
    })
  });
});



