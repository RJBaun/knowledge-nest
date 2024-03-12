// Created by Rylan Baun
// Created March 11, 2024
// Purpose: Render all resources

const collapseNavBar = () => {
  $("#navbarTogglerDemo02").slideUp();
};

const emptyMain = () => {
  $("#recent-resources").empty();
};

const createResourceMarkup = (resource) => {
  const $resource = $(`
  <article class="card" style="width: 90vw;">
  <i class=${resource.icon_link}></i>
  <div class="card-body">
    <h5 class="card-title">${resource.name}</h5>
    <p class="card-text">${resource.description}</p>
    <a href="${resource.url}" class="btn btn-primary">Visit Resource</a>
    <footer class="resource-footer">
      <span class="resource-category">#${resource.category_name}</span>
      <span class="resource-likes-and-ratings">
    </footer>
  </div>
</article>
  `);
  return $resource;
}

const renderResources = (response) => {
  response.resources.forEach (resource => {
    $("#all-resources").prepend(createResourceMarkup(resource));
  })
};


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
