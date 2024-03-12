// Created by Rylan Baun
// Created March 11, 2024
// Purpose: Render all resources
const createResourceMarkup = (resource) => {
  const $resource = $(`
  <article class="resource">
    <p>${resource.id}${resource.name}</p>
  </article>
  `);
  return $resource;
}

const renderResources = (resources) => {
  $("#main-content").empty();
  $("#example-stuff").hide();
  resources.resources.forEach (resource => {
    console.log((resource))
    $("#main-content").prepend(createResourceMarkup(resource));
  })
};


$(() => {
  $('#get-all-resources').on('click', () => {
    $.ajax({
      method: 'GET',
      url: '/api/resources'
    })
    .then((response) => {
      renderResources(response);
    })
    .catch((err) => {
      console.log('err:', err);
    })
  });
});
