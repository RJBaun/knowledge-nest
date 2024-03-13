// Created by Rylan Baun
// Created March 11, 2024
// Purpose: Render all resource related pages


// Collapses NavBar when called
const collapseNavBar = () => {
  $("#navbarTogglerDemo02").collapse('hide');
};

// clear all sections in main container
const pageCleanup1 = () => {
  collapseNavBar();
  $("#all-resources").empty();
  $("#recent-resources").empty();
  $('#section-registration-page').empty();
  $('#section-login-page').empty();
  $('#section-user-resources').empty();
  $('#section-add-new-resource').empty();
  $('#section-user-profile').empty();
  $('#section-single-resource').empty();
  $('#section-edit-resource').empty();
};

// generates resource card and returns it given a resource object
const createResourceMarkup = (resource) => {
  const $resource = $(`
  <article id="resource-${resource.id}" class="card" style="width: 90vw;">
  <i class=${resource.icon_link}></i>
  <section id="resource-link" class="card-body">
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
      pageCleanup1();
      renderResources(response);
      $('.resource-link').on('click', function() {
      });
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
    pageCleanup1();
    $('#section-add-new-resource').append(newResourceFormMarkup());
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
  $('#section-add-new-resource').submit(function(event) {
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
      $.ajax({
        method: 'GET',
        url: `api/resources/${data.id}`,
      })
      .done((response) => {
        pageCleanup1();
        $('#section-single-resource').append(renderSingleResource(response.resource));
        $('#section-single-resource').append($commentForm)
        renderComments(response.comments);
      });
    })
    .catch((err) => {
      console.log('err:', err);
    })
  });
});

//Renders a single resource when the listener calls it
const renderSingleResource = (resource) => {
  let resource_ratings;
  if(!resource.avg_rating) {
    resource_ratings = "No Ratings Yet"
  } else {
    resource_ratings = `${resource.avg_rating} / 5 Stars`
  }
  const $singleResource = $(`
  <article id="resource-${resource.id}" class="card" style="width: 90vw;">
  <i class=${resource.icon_link}></i>
  <section id="single-resource" class="card-body">
    <h5 class="card-title">${resource.name}</h5>
    <p class="card-text">${resource.description}</p>
    <a href="${resource.url}" class="btn btn-primary">Visit Resource</a>
    <span>
    <button type="button" id="edit-resource-button" class="btn btn-primary btn-sm">Edit Resource</button>
    <button type="button" class="btn btn-primary btn-sm">Delete Resource</button>
    </span>
    <footer class="resource-footer">
      <span class="resource-category">#${resource.category_name}</span>
      <span class="resource-likes-and-ratings">${resource.count_likes} Likes ${resource_ratings}</span>
    </footer>
  </section>
  </article>
  `)
  return $singleResource;
};

// Creates markup for each comment under a single resource
const commentMarkup = (comment) => {
  const $comment = $(`
  <section class="comment">
  <p class="comment-message">${comment.message}</p>
  <footer>Posted By: ${comment.commenter_name} Date Posted: ${comment.post_date}</footer>
  </section>
  `);
  return $comment;
};


// Renders comments for a single resource
const renderComments = (comments) => {
  comments.forEach ((comment) => {
    $('#section-single-resource').append(commentMarkup(comment))
  })
};

// HTML to render new comment form
const $commentForm = $(`
  <form id="new-comment-form">
    <h5>Write A New Comment</h5>
    <section>
      <input type="text" class="new-comment" id="new-comment-message" placeholder="New Comment"></input>
      <button type="button" class="btn btn-primary btn-sm">Post Comment</button>
    </section>
`);

// Load new page on resource click
//// Resources are dynamically rendered so the listener works for any element with a resource-link ID within the document
$(() => {
  $(document).on('click', '#resource-link', function() {
    const resourceId = $(this).closest('article').attr('id').split('-')[1];
    $.ajax({
      method: 'GET',
      url: `api/resources/${resourceId}`,
    })
    .done((response) => {
      pageCleanup1();
      $('#section-single-resource').append(renderSingleResource(response.resource));
      $('#section-single-resource').append($commentForm)
      renderComments(response.comments);
    });
  });
});

// Render edit resource page when called
const editResourceFormMarkup = (resourceId) => {
  const $resourceForm = $(`
  <form>
  <h2>Update Your Resource</h2>
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
  <span id="${resourceId}" style="display: none;"></span>
    <button type="submit" class="btn btn-primary" id="submit-new-resource">Submit</button>
</form>
  `)
  return $resourceForm;
}

// listener for edit resources page
$(() => {
  $(document).on('click', '#edit-resource-button', function() {
    const resourceId = $(this).closest('article').attr('id').split('-')[1];
    pageCleanup1();
    $('#section-edit-resource').append(editResourceFormMarkup(resourceId));
    $.ajax({
      method: 'GET',
      url: `api/resources/${resourceId}/edit`,
    })
    .done((response) => {
      showCategoryOptions(response);
      showResourceTypeOptions(response);
    })
    .catch((err) => {
      console.log('err:', err);
    });
  });
});

//Listener fo subitting resource edits using method-override to PUT
$(() => {
  $(document).on('submit', '#section-edit-resource', function(event) {
    event.preventDefault();
    const resourceId = $(this).find('span').attr('id');
    const resource = {
      name: $('#name-field').val(),
      description: $('#description-field').val(),
      category_id: $('#category-dropdown').val(),
      resource_type_id: $('#resource_type-dropdown').val(),
      id: resourceId
    };
    $.ajax({
      method: 'POST',
      url: 'api/resources/:id',
      data: resource
    })
    .done((data) => {
      $.ajax({
        method: 'GET',
        url: `api/resources/${data.id}`,
      })
      .done((response) => {
        pageCleanup1();
        $('#section-single-resource').append(renderSingleResource(response.resource));
        $('#section-single-resource').append($commentForm)
        renderComments(response.comments);
      });
    })
    .catch((err) => {
      console.log('err:', err);
    })
  });
});

