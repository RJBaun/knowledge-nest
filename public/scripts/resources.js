// Created by Rylan Baun
// Created March 11, 2024
// Purpose: Render all resources

// Collapses NavBar when called
const collapseNavBar = () => {
  $("#navbarTogglerDemo02").collapse('hide');
};

// clear all sections in main container
const pageCleanup = () => {
  collapseNavBar();
  $("#all-resources").empty();
  $("#recent-resources").empty();
  $('#section-registration-page').empty();
  $('#section-login-page').empty();
  $('#section-user-resources').empty();
  $('#section-add-new-resource').empty();
  $('#section-user-profile').empty();
};

// generates resource card and returns it given a resource object
const createResourceMarkup = (resource) => {
  const $resource = $(`
  <article id="resource-${resource.id}" class="card" style="width: 90vw;">
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
      pageCleanup();
      renderResources(response);
    })
    .catch((err) => {
      console.log('err:', err);
    })
  });
});

//Renders form for new resources
const newResourceFormMarkup = () => {
  const $resourceForm = $(`
  <form>
  <h2>Create New Resource</h2>
  <article class="mb-3">
    <label for="url-field" class="form-label" style="display: none">Resource URL</label>
    <input type="url" class="form-control" id="url-field" placeholder="URL">
  </article>
  <article class="mb-3">
    <label for="name-field" class="form-label" style="display: none">Resource Title</label>
    <input type="text" class="form-control" id="name-field" placeholder="Title">
  </article>
  <article class="mb-3">
    <label for="description-field" class="form-label" style="display: none">Resource Description</label>
    <input type="text" class="form-control" id="description-field" placeholder="Description">
  </article>
  <select class="form-select" id="category-dropdown">
    <option selected>Category</option>
  </select>
  <select class="form-select" id="resource_type-dropdown">
    <option selected>Resource Type</option>
  </select>
  <button type="submit" class="btn btn-primary" id="submit-new-resource">Submit</button>
</form>
  `)
  return $resourceForm;
}

//Adds categories to the dropdown
const showCategoryOptions = (response) => {
  response.categories.forEach (category => {
    $("#category-dropdown").append(categoryMarkup(category));
  })
};

//Creates markup for categories to be shown in the dropdown
const categoryMarkup = (category) => {
  const $category = $(`
  <option>${category.name}</option>
  `);
  return $category;
};

//Adds resource_types to the dropdown
const showResourceTypeOptions = (response) => {
  response.resource_types.forEach (resource_type => {
    $("#resource_type-dropdown").append(resourceTypeMarkup(resource_type));
  })
};

//Creates markup for resource_types to be shown in the dropdown
const resourceTypeMarkup = (resource_type) => {
  const $resource_type = $(`
  <option>${resource_type.name}</option>
  `);
  return $resource_type;
};

//Listener for "Add Resource" that displays creation form
$(() => {
  $('#show-new-resource-form').on('click', () => {
    pageCleanup();
    $('#new-resource-form').append(newResourceFormMarkup());
    $.ajax({
      method: 'GET',
      url: '/api/resources/new'
    })
    .done((response) => {
      showCategoryOptions(response);
      showResourceTypeOptions(response);
    })
    .catch((err) => {
      console.log('err:', err);
    })
  });
});

// Listener for new resource form submission
$(() => {
  $('#new-resource-form').submit(function(event) {
    event.preventDefault();
    const resource = {
      url: $('#url-field').val(),
      name: $('#name-field').val(),
      description: $('#description-field').val(),
      category_id: $('#category-dropdown').val(),
      resource_type_id: $('#resource_type-dropdown').val(),
      owner_id: 1
    };
    $.ajax({
      method: 'POST',
      url: 'api/resources/',
      data: resource
    })
    .done((data) => {
      console.log(data);
    })
    .catch((err) => {
      console.log('err:', err);
    })
  });
});

// Load new page on resource click
$(() => {
  $resource.find('.resource-link').on('click', () => {
    console.log('clicked')
  })
})

